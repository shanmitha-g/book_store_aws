import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "https://main.d19473rqp7700n.amplifyapp.com",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "DELETE, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers };

  try {
    const body = JSON.parse(event.body || "{}");
    const { reservationId } = body;

    if (!reservationId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing reservationId" })
      };
    }

    // Option 1: Soft delete (change status)
    const params = {
      TableName: "Reservations-v2",
      Key: { reservationId: { S: reservationId } },
      UpdateExpression: "SET #status = :s",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":s": { S: "removed" } }
    };

    await client.send(new UpdateItemCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Item removed" })
    };
  } catch (err) {
    console.error("RemoveCart Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};
