import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

const sampleBooks = [
  {
    bookId: "B001",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    description: "A young wizard discovers his magical heritage and begins his education at Hogwarts School of Witchcraft and Wizardry.",
    price: 12.99,
    stock: 15,
    imageUrl: "",
    averageRating: 4.8,
    reviewCount: 1250,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    bookId: "B002",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    genre: "Science Fiction",
    description: "In a dystopian future, a young girl volunteers to take her sister's place in a deadly televised competition.",
    price: 11.99,
    stock: 8,
    imageUrl: "",
    averageRating: 4.6,
    reviewCount: 890,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function initializeData() {
  try {
    console.log('Starting data initialization...');
    
    for (const book of sampleBooks) {
      const params = {
        TableName: 'Books-v2',
        Item: book
      };
      
      await ddbDocClient.send(new PutCommand(params));
      console.log(`✅ Added book: ${book.title}`);
    }
    
    console.log('🎉 Sample data initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
}

initializeData();