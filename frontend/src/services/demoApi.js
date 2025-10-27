import axios from 'axios';

const API_BASE_URL = 'https://mqm0a25hy5.execute-api.us-east-1.amazonaws.com/prod';

class DemoApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Book endpoints - only what we need for demo
  async getBooks() {
    const response = await this.client.get('/books');
    return response.data;
  }

  async addBook(bookData) {
    // For demo, we'll just log this since the backend might not have the endpoint
    console.log('Would add book:', bookData);
    return { success: true, bookId: 'demo-' + Date.now() };
  }

  async updateBookStock(bookId, stock) {
    // For demo, we'll just log this
    console.log(`Would update book ${bookId} stock to ${stock}`);
    return { success: true };
  }
}

export default new DemoApiService();