/*import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

//const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID
};//

const poolData = {
  UserPoolId: 'us-east-1_wRsIhvNoQ',      // Your actual ID
  ClientId: 'clccm3iqk4f9eaq7ru1r1q4f7'   // Your actual Client ID
};

const userPool = new CognitoUserPool(poolData);

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      
      if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            const userData = {
              username: cognitoUser.getUsername(),
              email: getAttribute(attributes, 'email'),
              firstName: getAttribute(attributes, 'given_name'),
              lastName: getAttribute(attributes, 'family_name'),
              isAdmin: session.getIdToken().payload['cognito:groups']?.includes('Admins') || false,
              token: session.getIdToken().getJwtToken()
            };
            
            setUser(userData);
            setIsLoading(false);
          });
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoading(false);
    }
  };

  const getAttribute = (attributes, name) => {
    const attr = attributes.find(attr => attr.getName() === name);
    return attr ? attr.getValue() : '';
  };

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
              return;
            }
            
            const userData = {
              username: cognitoUser.getUsername(),
              email: getAttribute(attributes, 'email'),
              firstName: getAttribute(attributes, 'given_name'),
              lastName: getAttribute(attributes, 'family_name'),
              isAdmin: session.getIdToken().payload['cognito:groups']?.includes('Admins') || false,
              token: session.getIdToken().getJwtToken()
            };
            
            setUser(userData);
            resolve(userData);
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };
  
  const demoLogin = (email, isAdmin = false) => {
  const userData = {
    username: email,
    email: email,
    firstName: 'Demo',
    lastName: 'User',
    isAdmin: isAdmin,
    token: 'demo-token'
  };
  setUser(userData);
  return Promise.resolve(userData);
};

  const register = async (email, password, firstName, lastName, userType) => {
    return new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          { Name: 'email', Value: email },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
        ],
        null,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Add user to group
          if (userType === 'admin') {
            // Note: This would typically be done in a Lambda function
            console.log('Admin registration - need backend processing');
          }
          
          resolve(result.user);
        }
      );
    });
  };

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    demoLogin,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}*/

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
//import CryptoJS from 'crypto-js';


const calculateSecretHash = (username) => {
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error('Client secret not configured');
  }
  const crypto = require('crypto');
  const message = username + poolData.ClientId;
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(message)
    .digest('base64');
};

const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_wRsIhvNoQ',
  ClientId: process.env.REACT_APP_CLIENT_ID || 'clccm3iqk4f9eaq7ru1r1q4f7'
};

const userPool = new CognitoUserPool(poolData);
/*
// Calculate secret hash for Cognito
const calculateSecretHash = (username) => {
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error('Client secret not configured');
  }
  const message = username + poolData.ClientId;
  return CryptoJS.HmacSHA256(message, clientSecret).toString(CryptoJS.enc.Base64);
};
*/
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      
      if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            setUser(null);
            setIsLoading(false);
            return;
          }
          
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              setUser(null);
              setIsLoading(false);
              return;
            }
            
            const userData = {
              username: cognitoUser.getUsername(),
              email: getAttribute(attributes, 'email'),
              firstName: getAttribute(attributes, 'given_name'),
              lastName: getAttribute(attributes, 'family_name'),
              isAdmin: session.getIdToken().payload['cognito:groups']?.includes('Admins') || false,
              token: session.getIdToken().getJwtToken()
            };
            
            setUser(userData);
            setIsLoading(false);
          });
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsLoading(false);
    }
  };

  const getAttribute = (attributes, name) => {
    const attr = attributes.find(attr => attr.getName() === name);
    return attr ? attr.getValue() : '';
  };

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err);
              return;
            }
            
            const userData = {
              username: cognitoUser.getUsername(),
              email: getAttribute(attributes, 'email'),
              firstName: getAttribute(attributes, 'given_name'),
              lastName: getAttribute(attributes, 'family_name'),
              isAdmin: session.getIdToken().payload['cognito:groups']?.includes('Admins') || false,
              token: session.getIdToken().getJwtToken()
            };
            
            setUser(userData);
            resolve(userData);
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const register = async (email, password, firstName, lastName) => {
    return new Promise((resolve, reject) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
        new CognitoUserAttribute({ Name: 'given_name', Value: firstName }),
        new CognitoUserAttribute({ Name: 'family_name', Value: lastName }),
      ];

      userPool.signUp(
        email,
        password,
        attributeList,
        null,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.user);
        }
      );
    });
  };

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}