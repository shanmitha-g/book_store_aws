const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

class Database {
  static async scan(tableName, filters = {}) {
    const params = {
      TableName: tableName,
    };

    if (filters.expression && filters.values) {
      params.FilterExpression = filters.expression;
      params.ExpressionAttributeValues = filters.values;
    }

    try {
      const data = await ddbDocClient.send(new ScanCommand(params));
      return data.Items || [];
    } catch (error) {
      console.error('Scan error:', error);
      throw error;
    }
  }

  static async query(tableName, keyCondition, options = {}) {
    const params = {
      TableName: tableName,
      KeyConditionExpression: keyCondition.expression,
      ExpressionAttributeValues: keyCondition.values,
    };

    if (options.index) {
      params.IndexName = options.index;
    }

    if (options.filter) {
      params.FilterExpression = options.filter.expression;
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ...options.filter.values
      };
    }

    try {
      const data = await ddbDocClient.send(new QueryCommand(params));
      return data.Items || [];
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  static async get(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key,
    };

    try {
      const data = await ddbDocClient.send(new GetCommand(params));
      return data.Item;
    } catch (error) {
      console.error('Get error:', error);
      throw error;
    }
  }

  static async put(tableName, item) {
    const params = {
      TableName: tableName,
      Item: item,
    };

    try {
      await ddbDocClient.send(new PutCommand(params));
      return item;
    } catch (error) {
      console.error('Put error:', error);
      throw error;
    }
  }

  static async update(tableName, key, updates) {
    let updateExpression = 'SET';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    let first = true;

    for (const [field, value] of Object.entries(updates)) {
      if (!first) updateExpression += ',';
      updateExpression += ` #${field} = :${field}`;
      expressionAttributeNames[`#${field}`] = field;
      expressionAttributeValues[`:${field}`] = value;
      first = false;
    }

    updateExpression += ', #updatedAt = :updatedAt';
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    try {
      const data = await ddbDocClient.send(new UpdateCommand(params));
      return data.Attributes;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }

  static async delete(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key,
    };

    try {
      await ddbDocClient.send(new DeleteCommand(params));
      return { success: true };
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}
module.exports = { Database };