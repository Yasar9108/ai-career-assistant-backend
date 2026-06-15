const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const LOG_TAG = "-->"
const emailServices = require("../services/email.service") 
async function userRegisterController(req, res){
    try{
        console.debug(LOG_TAG, " Entered into userRegisterController post methode: " + Date.now())
        const {name, gmail, password} = req.body;
        if(!name || !gmail || !password){
            return res.status(400).json({
                message : " Please Enter required fields"
            })
        }
        var JSONOBJ = new Object();
        JSONOBJ.name =     name;
        JSONOBJ.gmail =    gmail;
        JSONOBJ.password = password;
        JSONOBJ.timeStamp = Date.now();
       
        const userData = new UserModel(JSONOBJ);
        const records = await userData.save();
        const token = jwt.sign({id:userData._id}, process.env.JWT_SECRET, {expiresIn:"20d"})
        console.debug(LOG_TAG, " User registered successfully: " + userData._id);
        res.cookie("token",token)
        console.debug("tokenCreated", token)
        await emailServices.sendRegistrationEmail(userData.gmail, userData.name)
        res.status(200).json({
            message : "records are saved",
            records : records
        })
    }catch(err){
        res.status(400).json({
            message: err
        })
        console.debug(LOG_TAG, err)
    }
    console.debug(LOG_TAG, "Exited from userRegisterController post methode: " + Date.now())
}

async function userLoginController(req,res){
    try{
        console.debug(LOG_TAG, " Entered into post userLoginController methode: " + Date.now());
         
        const userPassword = req.body.password;
        const userGmail = req.body.gmail;
        
        const userExit = await UserModel.findOne({gmail:userGmail}).select("+password");

        if(!userExit){
            return res.status(400).json({
                message : " user Does not exit"
            })
        }

        if(userExit){
            const ifMatch = await userExit.comparePassword(userPassword);

            if(!ifMatch){
                return res.status(400).json({
                    message : " Invalid Password"
                })
            }

            const token = jwt.sign({id:userExit._id}, process.env.JWT_SECRET, {expiresIn:"20d"});
            res.cookie("token", token)
            res.status(200).json({
                message: "User login successfully"
            })
        }
    }catch(err){
        console.debug(LOG_TAG, err);
        console.debug(LOG_TAG, " Exited from post userLoginController methode: " + Date.now());
    }
}

async function fetchUserData(req, res){
    try{
        console.debug(LOG_TAG, " Entered into get fetchUserData methode: " + Date.now())
        const userId = req.userData._id;

        if(!userId){
            return res.status(400).json({
                message : " User profile not found"
            })
        }

        const records = await UserModel.findOne({_id:userId});
        return res.status(200).json({
            message : "Profile fetched successfully",
            user : records
        })

    }catch(err){
        console.error(LOG_TAG, err);
        res.status(400).json({
            message : err
        })
    }
    console.debug(LOG_TAG, " Exited from get fetchUderData methode: " + Date.now());
}

async function userLogoutController(req,res){
    try{
        res.clearCookie("token")

        return res.status(200).json({
            message : " User loged out successfully"
        })

    }catch(err){
        console.debug(LOG_TAG, "Error" + err);
        res.status(400).json({
            message : err
        })
    }
}

module.exports ={
    userRegisterController,
    userLoginController,
    fetchUserData,
    userLogoutController
}