import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://main.d19473rqp7700n.amplifyapp.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "PUT, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

  try {
    const body = JSON.parse(event.body || "{}");
    const { reservationId, quantity } = body;

    if (!reservationId || quantity == null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing reservationId or quantity" })
      };
    }

    const params = {
      TableName: "Reservations-v2",
      Key: { reservationId: { S: reservationId } },
      UpdateExpression: "SET quantity = :q",
      ExpressionAttributeValues: {
        ":q": { N: quantity.toString() }
      },
      ReturnValues: "ALL_NEW"
    };

    const result = await client.send(new UpdateItemCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, updatedItem: result.Attributes })
    };
  } catch (err) {
    console.error("UpdateCart Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};
