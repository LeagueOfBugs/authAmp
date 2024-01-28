const AWS = require("aws-sdk");
const ssm = new AWS.SSM();

const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context) => {
  try {
    // Parse input from the event
    const { username, password, email } = event;

    const parameter = await ssm
      .getParameter({
        Name: "/authAmp/client-id",
        WithDecryption: true,
      })
      .promise();

    const clientKey = parameter.Parameter.Value;
    console.log("clientKey: ", clientKey);
    // Register a user
    const params = {
      ClientId: clientKey,
      Username: username,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    const data = await cognito.signUp(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User registered successfully",
        response: data,
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
