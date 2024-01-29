const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context) => {
  try {
    const { username, password } = event;
    const parameter = await ssm
      .getParameter({
        Name: "/authAmp/client-id",
        WithDecryption: true,
      })
      .promise();

    const clientKey = parameter.Parameter.Value;
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: clientKey,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const data = await cognito.initiateAuth(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User login successful",
        accessToken: data.AuthenticationResult.AccessToken,
        idToken: data.AuthenticationResult.IdToken,
        refreshToken: data.AuthenticationResult.RefreshToken,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
