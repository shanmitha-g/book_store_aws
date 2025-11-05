import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_BASE_URL = 'https://87yd38llp0.execute-api.us-east-1.amazonaws.com/prod';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const cognitoUser = JSON.parse(localStorage.getItem('cognitoUser') || '{}');
        if (cognitoUser.token) {
          config.headers.Authorization = `Bearer ${cognitoUser.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('cognitoUser');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async registerUser(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  // Book endpoints
  async getBooks(filters = {}) {
    const response = await this.client.get('/books', { params: filters });
    return response.data;
  }

  async getBookById(bookId) {
    const response = await this.client.get(`/books/${bookId}`);
    return response.data;
  }

  async searchBooks(query) {
    const response = await this.client.get('/books/search', { params: { q: query } });
    return response.data;
  }

  // Review endpoints
  async getBookReviews(bookId) {
    const response = await this.client.get(`/reviews/book/${bookId}`);
    return response.data;
  }

  async addReview(reviewData) {
    const response = await this.client.post('/reviews', reviewData);
    return response.data;
  }

  // Cart endpoints
  async getCart() {
    const response = await this.client.get('/cart');
    return response.data;
  }

  async addToCart(bookId, quantity = 1) {
    const response = await this.client.post('/cart/', { bookId, quantity });
    return response.data;
  }

  async createReservation(reservationData) {
    const response = await this.client.post('/reservations', reservationData);
    return response.data;
  }

  // Admin endpoints
  async addBook(bookData) {
    const response = await this.client.post('/admin/books', bookData);
    return response.data;
  }

  async updateBookStock(bookId, stock) {
    const response = await this.client.put(`/admin/books/${bookId}/stock`, { stock });
    return response.data;
  }
}

export default new ApiService();
