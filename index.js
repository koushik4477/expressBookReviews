const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Parse JSON bodies
app.use(express.json());

// Set up session middleware for /customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Authentication middleware for all /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization.accessToken;  // ✅ FIXED: was 'token'
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        return next();
      } else {
        return res.status(403).json({ message: "Invalid token" });
      }
    });
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
});

// Use customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
