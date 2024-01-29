const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context) => {
  try {
    const { username } = event;
    const parameter = await ssm
      .getParameter({
        Name: "/authAmp/client-id",
        WithDecryption: true,
      })
      .promise();

    const clientKey = parameter.Parameter.Value;
    const params = {
      UserPoolId: clientKey,
      Username: username,
    };

    const data = await cognito.adminUserGlobalSignOut(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User successfully logged out",
        data: data,
      }),
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
