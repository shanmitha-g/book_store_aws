/*const { Database } = require('../../utils/dynamodb.js');
const { verifyToken } = require('../../utils/auth.js');
const { success, error, unauthorized } = require('../../utils/response.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://main.d19473rqp7700n.amplifyapp.com',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
    'Access-Control-Allow-Credentials': true
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log('📦 Fetching cart items...');

    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return unauthorized('Authentication required');
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;
    console.log('User ID:', userId);

    // Fetch user's cart items from Reservations-v2
    const cartItems = await Database.scan('Reservations-v2', {
      expression: 'userId = :u AND #status = :s',
      names: { '#status': 'status' },
      values: {
        ':u': userId,
        ':s': 'in_cart'
      }
    });

    console.log('Found', cartItems.length, 'cart items');

    return success({
      message: 'Cart fetched successfully',
      cart: cartItems
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return error('Failed to fetch cart: ' + err.message);
  }
};
*/
const { Database } = require('../utils/dynamodb.js');
const { verifyToken } = require('../utils/auth.js');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://main.d19473rqp7700n.amplifyapp.com',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': true
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, message: 'Authentication required' })
      };
    }

    // Decode JWT
    const decoded = await verifyToken(token);
    const userId = decoded.sub;

    // Query Reservations-v2 by userId USING UserIndex GSI
    const items = await Database.query(
      'Reservations-v2',
      {
        expression: 'userId = :uid',
        values: { ':uid': userId }
      },
      { index: 'UserIndex' }
    );

    // Keep only "in_cart"
    const cartItems = items.filter(item => item.status === 'in_cart');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        items: cartItems
      })
    };
  } catch (err) {
    console.error('Error fetching cart:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to fetch cart: ' + err.message
      })
    };
  }
};
