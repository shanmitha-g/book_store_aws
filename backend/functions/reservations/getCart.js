const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { verifyToken } = require("../../utils/auth.js");

const client = new DynamoDBClient({ region: "us-east-1" });
const TABLE_NAME = "Reservations-v2";

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://main.d19473rqp7700n.amplifyapp.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const token = event.headers.Authorization?.replace("Bearer ", "");
    if (!token) {
      return { statusCode: 401, headers, body: JSON.stringify({ message: "Unauthorized" }) };
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;

    // Get all in-cart items for this user
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "userId = :u AND #status = :s",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":u": { S: userId },
        ":s": { S: "in_cart" },
      },
    });

    const result = await client.send(command);
    const items = result.Items.map(item => ({
      bookId: item.bookId.S,
      title: item.bookTitle.S,
      author: item.bookAuthor.S,
      price: Number(item.bookPrice.N),
      quantity: Number(item.quantity.N),
      reservationId: item.reservationId.S,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, cart: items }),
    };
  } catch (err) {
    console.error("Error fetching cart:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
