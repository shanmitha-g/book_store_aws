/*const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

function checkAdmin(decodedToken) {
  const groups = decodedToken['cognito:groups'] || [];
  return groups.includes('Admins');
}

module.exports = { verifyToken, checkAdmin };*/

const https = require('https');
const crypto = require('crypto');

// Cache JWKS public keys
let jwksCache = null;

// Download JWKS keys from Cognito
function fetchJWKS(userPoolId) {
  const jwksUrl = `https://cognito-idp.us-east-1.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  return new Promise((resolve, reject) => {
    https.get(jwksUrl, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jwks = JSON.parse(data);
          jwksCache = jwks.keys;
          resolve(jwks.keys);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Helper: Convert base64url → base64
function base64urlToBuffer(base64url) {
  base64url = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64url.length % 4;
  if (pad) base64url += '='.repeat(4 - pad);
  return Buffer.from(base64url, 'base64');
}

// Verify JWT using Cognito JWKS
async function verifyToken(token) {
  if (!process.env.USER_POOL_ID) {
    throw new Error("Missing USER_POOL_ID environment variable");
  }

  // Split JWT
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  const header = JSON.parse(Buffer.from(headerB64, 'base64').toString());
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
  const signature = base64urlToBuffer(signatureB64);

  // Ensure JWKS is loaded
  if (!jwksCache) {
    await fetchJWKS(process.env.USER_POOL_ID);
  }

  // Get key with matching kid
  const jwk = jwksCache.find(k => k.kid === header.kid);
  if (!jwk) {
    throw new Error("JWKS key not found for token kid");
  }

  // Build public key buffer
  const publicKey = crypto.createPublicKey({
    key: Buffer.from(
      `-----BEGIN PUBLIC KEY-----\n${jwk.x5c[0]}\n-----END PUBLIC KEY-----`,
      'utf8'
    ),
    format: 'pem'
  });

  // Verify signature
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();

  const isValid = verifier.verify(publicKey, signature);

  if (!isValid) {
    throw new Error("Invalid token signature");
  }

  // Check token expiration
  if (payload.exp * 1000 < Date.now()) {
    throw new Error("Token expired");
  }

  return payload; // decoded JWT
}

// Check Admin group
function checkAdmin(decodedToken) {
  const groups = decodedToken['cognito:groups'] || [];
  return groups.includes('Admins');
}

module.exports = { verifyToken, checkAdmin };
