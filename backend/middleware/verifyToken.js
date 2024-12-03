import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using JWT secret
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

export default verifyToken;
