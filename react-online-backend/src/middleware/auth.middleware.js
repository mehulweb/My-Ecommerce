import jwt from "jsonwebtoken";


export const tokenVerification = (req, res, next) => {
    try {
        const usertoken = req.cookies.usertoken || req.headers.authorization?.split(' ')[1];

        if (!usertoken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(usertoken, process.env.JWT_SECRET);
        
        req.userId = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const refreshToken = async (req, res) => {

    try {
        const userrefreshtoken = req.cookies.userrefreshtoken || req.headers.authorization?.split(' ')[1];

        if (!userrefreshtoken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accessToken = jwt.verify(userrefreshtoken, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("useraccesstoken", accessToken)
        res.status(200).json({ message: "Token refreshed successfully", token: accessToken })

    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });

    }
};