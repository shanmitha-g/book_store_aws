import React, { createContext, useContext, useState, useEffect } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_CLIENT_ID
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
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}