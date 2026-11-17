import jwt from "jsonwebtoken";


export const sellertokenVerification = (req, res, next) => {
    try {
        const sellertoken = req.cookies.sellertoken || req.headers.authorization?.split(' ')[1];

        if (!sellertoken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(sellertoken, process.env.JWT_SECRET);
        
        req.sellerId = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const sellerrefreshToken = async (req, res) => {

    try {
        const sellerrefreshtoken = req.cookies.sellerrefreshtoken || req.headers.authorization?.split(' ')[1];

        if (!sellerrefreshtoken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accessToken = jwt.verify(sellerrefreshtoken, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("selleraccesstoken", accessToken)
        res.status(200).json({ message: "Token refreshed successfully", token: accessToken })

    } catch (error) {
        res.status(500).json({ message: "Error refreshing token" });

    }
};