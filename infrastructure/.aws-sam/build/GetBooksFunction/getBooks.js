//import { Database } from '../../utils/dynamodb.js';
//import { success, error } from '../../utils/response.js';
const { Database } = require('../../utils/dynamodb.js');
const { success, error } = require('../../utils/response.js');

export const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    
    let books = [];
    
    if (queryParams.genre) {
      // Query by genre using GSI
      books = await Database.query('Books', {
        expression: 'genre = :genre',
        values: { ':genre': queryParams.genre }
      }, { index: 'GenreIndex' });
    } else if (queryParams.author) {
      // Scan with author filter
      books = await Database.scan('Books', {
        expression: 'contains(author, :author)',
        values: { ':author': queryParams.author }
      });
    } else {
      // Get all books
      books = await Database.scan('Books');
    }

    return success(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    return error('Failed to fetch books');
  }
};