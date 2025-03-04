const express = require("express");
const app = express();

// Middleware function
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  if(req.get("id") == "test"){
    next();
  }
//   next(); // Move to the next step
res.send("not authorised");
});

// Route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


  
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
