const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");


async function authMiddleWare(req, res,next){
    try{
        console.debug("Entered into authMiddleWare: " + Date.now());
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message : "Unauthorized Access"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({
                message : "Unauthorized Access"
            })
        }
        req.userData = user;
        return next();
        
    }catch(err){
        console.error("Error in authMiddleWare: ", err);
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
    console.debug("Entered Exited into authMiddleWare: " + Date.now());
}

module.exports = authMiddleWare;
