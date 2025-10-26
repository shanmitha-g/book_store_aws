import { Database } from '../../utils/dynamodb.js';
import { ComprehendClient, DetectSentimentCommand, DetectKeyPhrasesCommand } from '@aws-sdk/client-comprehend';
import { verifyToken } from '../../utils/auth.js';
import { success, error, unauthorized } from '../../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

const comprehend = new ComprehendClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  try {
    // Verify authentication
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return unauthorized('Authentication required');
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;

    const body = JSON.parse(event.body);
    const { bookId, rating, reviewText } = body;

    if (!bookId || !rating || !reviewText) {
      return error('Book ID, rating, and review text are required');
    }

    // Verify book exists
    const book = await Database.get('Books', { bookId });
    if (!book) {
      return error('Book not found', 404);
    }

    // Analyze sentiment using Amazon Comprehend
    const sentimentCommand = new DetectSentimentCommand({
      Text: reviewText,
      LanguageCode: 'en'
    });

    const phrasesCommand = new DetectKeyPhrasesCommand({
      Text: reviewText,
      LanguageCode: 'en'
    });

    const [sentimentResult, phrasesResult] = await Promise.all([
      comprehend.send(sentimentCommand),
      comprehend.send(phrasesCommand)
    ]);

    // Create review
    const review = {
      reviewId: uuidv4(),
      bookId,
      userId,
      rating: parseInt(rating),
      reviewText,
      sentiment: sentimentResult.Sentiment,
      sentimentScore: sentimentResult.SentimentScore[sentimentResult.Sentiment],
      keyPhrases: phrasesResult.KeyPhrases.map(phrase => phrase.Text),
      isFlagged: sentimentResult.Sentiment === 'NEGATIVE' && sentimentResult.SentimentScore.NEGATIVE > 0.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await Database.put('Reviews', review);

    // Update book's average rating
    const bookReviews = await Database.query('Reviews', {
      expression: 'bookId = :bookId',
      values: { ':bookId': bookId }
    }, { index: 'BookIndex' });

    const newAverageRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
    
    await Database.update('Books', { bookId }, {
      averageRating: Math.round(newAverageRating * 10) / 10,
      reviewCount: bookReviews.length
    });

    return success(review, 201);
  } catch (err) {
    console.error('Error adding review:', err);
    return error('Failed to add review');
  }
};