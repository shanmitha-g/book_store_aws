/*import { Database } from '../../utils/dynamodb.js';
import { verifyToken } from '../../utils/auth.js';
import { success, error, unauthorized } from '../../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event) => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return unauthorized('Authentication required');
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;

    const body = JSON.parse(event.body);
    const { bookId, quantity = 1 } = body;

    if (!bookId) {
      return error('Book ID is required');
    }

    // Verify book exists and has stock
    const book = await Database.get('Books', { bookId });
    if (!book) {
      return error('Book not found', 404);
    }

    if (book.stock < quantity) {
      return error(`Only ${book.stock} copies available`);
    }

    // Check if item already in cart
    const existingItems = await Database.query('Reservations', {
      expression: 'userId = :userId AND begins_with(reservationId, :cart)',
      values: { 
        ':userId': userId,
        ':cart': 'CART_'
      }
    });

    const existingItem = existingItems.find(item => item.bookId === bookId && item.status === 'in_cart');

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      await Database.update('Reservations', 
        { reservationId: existingItem.reservationId }, 
        { quantity: newQuantity }
      );
    } else {
      // Add new item to cart
      const cartItem = {
        reservationId: `CART_${uuidv4()}`,
        userId,
        bookId,
        quantity,
        status: 'in_cart',
        createdAt: new Date().toISOString(),
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price
      };

      await Database.put('Reservations', cartItem);
    }

    return success({ message: 'Item added to cart' });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return error('Failed to add item to cart');
  }
};*/

/*
import { Database } from '../../utils/dynamodb.js';
import { verifyToken } from '../../utils/auth.js';
import { success, error, unauthorized } from '../../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event) => {
  try {
    console.log('Add to cart event received');
    
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return unauthorized('Authentication required');
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;
    console.log('User:', userId);

    const body = JSON.parse(event.body);
    const { bookId, quantity = 1 } = body;
    console.log('Adding book:', bookId, 'Quantity:', quantity);

    if (!bookId) {
      return error('Book ID is required');
    }

    // Verify book exists and has stock
    const book = await Database.get('Books', { bookId });
    if (!book) {
      return error('Book not found', 404);
    }

    if (book.stock < quantity) {
      return error(`Only ${book.stock} copies available`);
    }

    // FIXED: Use scan to find existing cart items (since we don't have GSI for userId)
    const existingItems = await Database.scan('Reservations', {
      expression: 'userId = :userId AND bookId = :bookId AND #status = :status AND begins_with(reservationId, :cart)',
      values: { 
        ':userId': userId,
        ':bookId': bookId,
        ':status': 'in_cart',
        ':cart': 'CART_'
      }
    });

    console.log('Found existing items:', existingItems.length);

    if (existingItems.length > 0) {
      // Update quantity of existing item
      const existingItem = existingItems[0];
      const newQuantity = existingItem.quantity + quantity;
      
      console.log('Updating existing item:', existingItem.reservationId, 'New quantity:', newQuantity);
      
      await Database.update('Reservations', 
        { reservationId: existingItem.reservationId }, 
        { quantity: newQuantity }
      );
      
      return success({ 
        message: 'Cart item quantity updated',
        action: 'updated',
        newQuantity: newQuantity
      });
    } else {
      // Add new item to cart
      const cartItem = {
        reservationId: `CART_${uuidv4()}`,
        userId: userId,
        bookId: bookId,
        quantity: quantity,
        status: 'in_cart',
        createdAt: new Date().toISOString(),
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price,
        bookImage: book.imageUrl || null
      };

      console.log('Adding new cart item:', cartItem);
      await Database.put('Reservations', cartItem);
      
      return success({ 
        message: 'Item added to cart successfully',
        action: 'added',
        cartItem: {
          reservationId: cartItem.reservationId,
          bookId: cartItem.bookId,
          title: cartItem.bookTitle,
          quantity: cartItem.quantity,
          price: cartItem.bookPrice
        }
      });
    }
  } catch (err) {
    console.error('Error in AddtoCart:', err);
    console.error('Error stack:', err.stack);
    return error('Failed to add item to cart: ' + err.message);
  }
};*/












import { Database } from '../../utils/dynamodb.js';
import { verifyToken } from '../../utils/auth.js';
import { success, error, unauthorized } from '../../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

export const handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://main.d19473rqp7700n.amplifyapp.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': true
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }

  try {
    console.log('Add to cart event received');
    
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return {
        statusCode: 401,
        headers: headers,
        body: JSON.stringify({ success: false, message: 'Authentication required' })
      };
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;
    console.log('User:', userId);

    const body = JSON.parse(event.body);
    const { bookId, quantity = 1 } = body;
    console.log('Adding book:', bookId, 'Quantity:', quantity);

    if (!bookId) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ success: false, message: 'Book ID is required' })
      };
    }

    // Verify book exists and has stock
    const book = await Database.get('Books', { bookId });
    if (!book) {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ success: false, message: 'Book not found' })
      };
    }

    if (book.stock < quantity) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ success: false, message: `Only ${book.stock} copies available` })
      };
    }

    // Use scan to find existing cart items
    const existingItems = await Database.scan('Reservations', {
      expression: 'userId = :userId AND bookId = :bookId AND #status = :status AND begins_with(reservationId, :cart)',
      values: { 
        ':userId': userId,
        ':bookId': bookId,
        ':status': 'in_cart',
        ':cart': 'CART_'
      }
    });

    console.log('Found existing items:', existingItems.length);

    if (existingItems.length > 0) {
      // Update quantity of existing item
      const existingItem = existingItems[0];
      const newQuantity = existingItem.quantity + quantity;
      
      console.log('Updating existing item:', existingItem.reservationId, 'New quantity:', newQuantity);
      
      await Database.update('Reservations', 
        { reservationId: existingItem.reservationId }, 
        { quantity: newQuantity }
      );
      
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Cart item quantity updated',
          action: 'updated',
          newQuantity: newQuantity
        })
      };
    } else {
      // Add new item to cart
      const cartItem = {
        reservationId: `CART_${uuidv4()}`,
        userId: userId,
        bookId: bookId,
        quantity: quantity,
        status: 'in_cart',
        createdAt: new Date().toISOString(),
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: book.price,
        bookImage: book.imageUrl || null
      };

      console.log('Adding new cart item:', cartItem);
      await Database.put('Reservations', cartItem);
      
      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Item added to cart successfully',
          action: 'added',
          cartItem: {
            reservationId: cartItem.reservationId,
            bookId: cartItem.bookId,
            title: cartItem.bookTitle,
            quantity: cartItem.quantity,
            price: cartItem.bookPrice
          }
        })
      };
    }
  } catch (err) {
    console.error('Error in AddtoCart:', err);
    console.error('Error stack:', err.stack);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ 
        success: false,
        message: 'Failed to add item to cart: ' + err.message 
      })
    };
  }
};