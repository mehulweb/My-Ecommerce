import jwt from "jsonwebtoken";


export const tokenVerification = (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const refreshToken = async (req, res) => {

    try {
        const refreshtoken = req.cookies.refreshtoken || req.headers.authorization?.split(' ')[1];

        if (!refreshtoken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accessToken = jwt.verify(refreshtoken, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("access token", accessToken)
        res.status(200).json({ message: "Token refreshed successfully", token: accessToken })

    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });

    }
};