export function createResponse(statusCode, body, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  return {
    statusCode,
    headers: { ...defaultHeaders, ...headers },
    body: JSON.stringify(body)
  };
}

export function success(body, statusCode = 200) {
  return createResponse(statusCode, body);
}

export function error(message, statusCode = 400) {
  return createResponse(statusCode, { error: message });
}

export function unauthorized(message = 'Unauthorized') {
  return createResponse(401, { error: message });
}

export function forbidden(message = 'Forbidden') {
  return createResponse(403, { error: message });
}