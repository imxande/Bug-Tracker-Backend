// import our environment variables
require("dotenv").config();

// create our server using our express app
const server = require("./api/app");

// loading port from dotenv file
const port = process.env.PORT;

// listens for connections on the given path
server.listen(port, () => {
  // log to the terminal our server status
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
