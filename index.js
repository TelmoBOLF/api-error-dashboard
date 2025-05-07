const { render } = require("./dist/server");

exports.handler = async (event, context) => {
  try {
    // Extract the path from the event
    const path = event.path || "/";

    // Render the HTML
    const html = await render(path);

    // Return the response for API Gateway
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: html,
    };
  } catch (error) {
    console.error("Render error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Internal Server Error",
    };
  }
};
