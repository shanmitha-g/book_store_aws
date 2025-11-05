/*const { Database } = require('../../utils/dynamodb.js');
const { success, error } = require('../../utils/response.js');

export const handler = async (event) => {
  try {
    const bookId = event.pathParameters.bookId;
    
    if (!bookId) {
      return error('Book ID is required');
    }

    const reviews = await Database.query('Reviews-v2', {
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
};*/
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "Reviews-v2"; // Change if needed

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://main.d19473rqp7700n.amplifyapp.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
  };

  try {
    const bookId = event.pathParameters?.bookId;

    if (!bookId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Book ID is required" })
      };
    }

    // Since your table key is reviewId, we use Scan + Filter
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: "bookId = :b",
      ExpressionAttributeValues: {
        ":b": { S: bookId }
      }
    };

    const command = new ScanCommand(params);
    const result = await client.send(command);
    const reviews = result.Items || [];

    // Calculate average rating if "rating" exists in reviews
    const ratings = reviews
      .map(r => Number(r.rating?.N || 0))
      .filter(n => !isNaN(n) && n > 0);
    const averageRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Reviews fetched successfully",
        reviews,
        averageRating,
        totalReviews: reviews.length
      })
    };
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Failed to fetch reviews",
        error: err.message
      })
    };
  }
};
