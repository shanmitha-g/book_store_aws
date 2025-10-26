import { Database } from '../../utils/dynamodb.js';
import { verifyToken } from '../../utils/auth.js';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { success, error, unauthorized } from '../../utils/response.js';
import { v4 as uuidv4 } from 'uuid';

const ses = new SESClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '');
    if (!token) {
      return unauthorized('Authentication required');
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;
    const userEmail = decoded.email;

    // Get cart items
    const cartItems = await Database.query('Reservations', {
      expression: 'userId = :userId AND begins_with(reservationId, :cart)',
      values: { 
        ':userId': userId,
        ':cart': 'CART_'
      }
    });

    const activeCartItems = cartItems.filter(item => item.status === 'in_cart');

    if (activeCartItems.length === 0) {
      return error('Cart is empty');
    }

    // Verify stock and process reservation
    const reservationId = `RES_${uuidv4()}`;
    const reservations = [];
    let totalAmount = 0;

    for (const item of activeCartItems) {
      const book = await Database.get('Books', { bookId: item.bookId });
      
      if (!book || book.stock < item.quantity) {
        return error(`Insufficient stock for ${book?.title || 'book'}`);
      }

      // Update book stock
      await Database.update('Books', { bookId: item.bookId }, {
        stock: book.stock - item.quantity
      });

      // Update cart item to reserved
      await Database.update('Reservations', 
        { reservationId: item.reservationId }, 
        { 
          status: 'reserved',
          reservationId: reservationId,
          totalAmount: item.quantity * (book.price || 0)
        }
      );

      reservations.push({
        ...item,
        status: 'reserved',
        reservationId: reservationId,
        totalAmount: item.quantity * (book.price || 0)
      });

      totalAmount += item.quantity * (book.price || 0);
    }

    // Send confirmation email
    const emailParams = {
      Destination: {
        ToAddresses: [userEmail]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <h1>Book Reservation Confirmation</h1>
              <p>Your reservation has been confirmed!</p>
              <p><strong>Reservation ID:</strong> ${reservationId}</p>
              <p><strong>Total Items:</strong> ${reservations.length}</p>
              <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
              <h3>Reserved Books:</h3>
              <ul>
                ${reservations.map(item => 
                  `<li>${item.bookTitle} by ${item.bookAuthor} (Qty: ${item.quantity})</li>`
                ).join('')}
              </ul>
              <p>Please pick up your books within 7 days.</p>
            `
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Book Reservation Confirmation - My Book Haven'
        }
      },
      Source: process.env.SES_FROM_EMAIL
    };

    try {
      await ses.send(new SendEmailCommand(emailParams));
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the reservation if email fails
    }

    return success({
      reservationId,
      message: 'Reservation created successfully',
      reservations,
      totalAmount
    });
  } catch (err) {
    console.error('Error creating reservation:', err);
    return error('Failed to create reservation');
  }
};