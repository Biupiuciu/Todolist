import { CognitoUserPool } from 'amazon-cognito-identity-js';
import "dotenv/config";
const poolData = {
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID as string, // Replace with your User Pool ID
  ClientId: process.env.AWS_COGNITO_CLIENT_ID as string, // Replace with your App Client ID
};

if (!process.env.AWS_COGNITO_USER_POOL_ID || !process.env.AWS_COGNITO_CLIENT_ID) {
    throw new Error('Missing required Cognito UserPoolId or ClientId');
}

const userPool = new CognitoUserPool(poolData);

export default userPool;