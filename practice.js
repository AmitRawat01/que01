// Import the built-in 'http' module to create an HTTP server
const http = require('http');

// Create an HTTP server that listens for requests and sends responses
const server = http.createServer((req, res) => {
    // Set the response status code to 200 (OK) and content type to plain text
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    
    // Send the response body as 'Hello, World!' and end the response
    res.end('Hello, World!');
});

// Define the port number where the server will listen for incoming requests
const PORT = 3000;

// Start the server and make it listen on the specified port
server.listen(PORT, () => {
    // Log a message to the console indicating that the server is running
    console.log(`Server is running on http://localhost:${PORT}`);
});
