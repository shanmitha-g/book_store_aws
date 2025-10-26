import { Database } from '../../utils/dynamodb.js';
import { success, error } from '../../utils/response.js';

export const handler = async (event) => {
  try {
    const query = event.queryStringParameters?.q;
    
    if (!query) {
      return error('Search query is required');
    }

    const books = await Database.scan('Books', {
      expression: 'contains(title, :query) OR contains(author, :query) OR contains(description, :query)',
      values: { ':query': query }
    });

    return success(books);
  } catch (err) {
    console.error('Error searching books:', err);
    return error('Failed to search books');
  }
};