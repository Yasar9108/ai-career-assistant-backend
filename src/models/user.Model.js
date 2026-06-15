const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: [true, "Name is required"]
    },

    gmail :{
        type : String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]     
    },

    password:{
        type: String,
        required: [true, "Password is required"],
        minLength : [6, "Password must be at least 6 characters long"],
        select: false
    },

    timeStamp:{
        type:Number
    }
})

userSchema.pre("save", async function(){
        if(!this.isModified("password")){
            return;
        }
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash
        return
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

const  UserModel= mongoose.model("UserModel", userSchema);
module.exports = UserModel;