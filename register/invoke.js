const AWS = require("aws-sdk");

const lambda = new AWS.Lambda();

const invokeLambda = async () => {
  try {
    const params = {
      FunctionName: "registerFunction", 
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        username: "andres",
        password: "Password1!",
        email: "andres-a23@live.com",
      }),
    };

    const result = await lambda.invoke(params).promise();
    console.log("Lambda Response:", JSON.parse(result.Payload));
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
  }
};

invokeLambda();
