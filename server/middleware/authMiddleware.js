import jwt from 'jsonwebtoken';
import User from "../models/User.js";

async function authMiddleware(req, res, next) {
    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);


        if (!req.body) {
            req.body = {};
        }


        req.body.userId = token_decode.id;

        next();

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
}



async function isOwner(req, res, next) {
    try {

        const { userId } = req.body;


        const user = await User.findById(userId);


        if (user.role !== "hotelOwner") {
            return res.json({ success: false, message: "Access Denied. Owners Only." });
        }


        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying owner" });
    }
}



export { authMiddleware, isOwner }; 