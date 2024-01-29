const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context) => {
  try {
    const { username, password, verification } = event;

    const parameter = await ssm
      .getParameter({
        Name: "/authAmp/client-id",
        WithDecryption: true,
      })
      .promise();

    const clientKey = parameter.Parameter.Value;

    if (!verification) {
      // If verification code is not provided, initiate forgot password
      const initiateForgotPasswordParams = {
        ClientId: clientKey,
        Username: username,
      };

      await cognito.forgotPassword(initiateForgotPasswordParams).promise();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Forgot password initiated" }),
      };
    }

    // If verification code is provided, confirm forgot password
    const confirmForgotPasswordParams = {
      ClientId: clientKey,
      ConfirmationCode: verification,
      Password: password,
      Username: username,
    };

    const data = await cognito
      .confirmForgotPassword(confirmForgotPasswordParams)
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Creds successfully updated",
        data: data,
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
