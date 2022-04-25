require("dotenv").config();

// create our server using our express app
const server = require("./app");

// loading port from dotenv file
const port = process.env.PORT;

// listens for connections on the given path
server.listen(port, (req, res) => {
  // sends the HTTP response
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
