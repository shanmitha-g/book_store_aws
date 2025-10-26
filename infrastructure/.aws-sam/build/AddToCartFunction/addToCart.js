import { Database } from '../../utils/dynamodb.js';
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
};