import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
         // returns the decoded payload
        req.user = jwt.verify(token, secretKey); // attach user info to request
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

export default authenticateToken;


// import jwt from 'jsonwebtoken';
//
// const secretKey = process.env.SECRET_KEY
//
// function authenticateToken(req, res, next) {
//     // Get token from Authorization header: "Bearer <token>"
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//
//     if (!token) {
//         return res.status(401).json({ message: 'Access token missing' });
//     }
//
//     jwt.verify(token, secretKey, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid or expired token' });
//         }
//
//         // Attach user info (payload) to request object
//         req.user = user;
//         next();
//     });
// }
//
// export default authenticateToken;