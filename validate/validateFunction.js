const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context) => {
  try {
    // Parse input from the event
    const { username, verificationCode } = event;

    // retrieve clientKey
    const parameter = await ssm
      .getParameter({
        Name: "/authAmp/client-id",
        WithDecryption: true,
      })
      .promise();
    const clientKey = parameter.Parameter.Value;

    // Confirm user registration
    const params = {
      ClientId: clientKey,
      ConfirmationCode: verificationCode,
      Username: username,
    };

    const data = await cognito.confirmSignUp(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registration confirmed", data }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
