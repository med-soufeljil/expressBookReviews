const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configure session for /customer
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for routes that require authorization
app.use("/customer/auth", function auth(req, res, next) {
    // Check if the session contains an access token
    if (req.session && req.session.token) {
        // Verify the access token
        jwt.verify(req.session.token, 'fingerprint_customer', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            // Attach the decoded token data to the request
            req.user = decoded;
            next(); // Proceed to the next middleware or route
        });
    } else {
        // No token in session, unauthorized
        return res.status(401).json({ message: 'Unauthorized, please log in' });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
