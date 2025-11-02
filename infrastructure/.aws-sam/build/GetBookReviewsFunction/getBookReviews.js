const { Database } = require('../../utils/dynamodb.js');
const { success, error } = require('../../utils/response.js');

export const handler = async (event) => {
  try {
    const bookId = event.pathParameters.bookId;
    
    if (!bookId) {
      return error('Book ID is required');
    }

    const reviews = await Database.query('Reviews', {
      expression: 'bookId = :bookId',
      values: { ':bookId': bookId }
    }, { index: 'BookIndex' });

    // Calculate average rating
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return success({
      reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return error('Failed to fetch reviews');
  }
};