const { Database } = require('../../utils/dynamodb.js');
const { success, error } = require('../../utils/response.js');

export const handler = async (event) => {
  try {
    const bookId = event.pathParameters.bookId;
    
    if (!bookId) {
      return error('Book ID is required');
    }

    const book = await Database.get('Books-v2', { bookId });
    
    if (!book) {
      return error('Book not found', 404);
    }

    return success(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    return error('Failed to fetch book');
  }
};