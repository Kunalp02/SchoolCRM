const jwt = require('jsonwebtoken');
const SECRET_KEY = 'jwt-token-secret-key'; 

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY); 
        req.user = verified; 
        next(); 
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};

module.exports = authToken;
