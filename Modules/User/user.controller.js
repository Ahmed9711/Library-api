import userModel from "../../DB/Models/user.model.js";
import bcrypt from 'bcryptjs'
import { tokenFunction } from "../../utils/tokenFunction.js";
import { sendEmail } from "../../Services/sendEmail.js";
import cloudinary from "../../utils/cloudinary.js";


export const signup = async (req,res, next ) => {
    const {name, email, mobile, password} = req.body;
    const hashedpassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    const user = new userModel({name, email, mobile, password: hashedpassword});
    const token = tokenFunction({payload: {_id: user._id}});
    const confirmtionLink = `${req.protocol}://${req.headers.host}/library/user/confirmEmail/${token}`;
    const emailCheck = sendEmail({
        to: user.email,
        subject: "Confirm your email",
        message: `<a href=${confirmtionLink}>Click here to confirm</a>`
    })
    if(emailCheck){
        const savedUser = await user.save();
        if(savedUser){
            res.status(201).json({message:"Sign Up done, try to login", savedUser});
        }
        else{
            next(new Error("Sign Up failed"))
        }
    }
    else{
        next(new Error("Unknown error, please try to sign up again"))
    }
}

export const confirmEmail = async (req,res, next ) => {
    const {token} = req.params;
    const decoded = tokenFunction({payload: token, generate: false});
    if(decoded?._id){
        const updatedUser = await userModel.findByIdAndUpdate(
            decoded._id,
            {confirmed: true}
        )
        res.status(200).json({message:"Confirmation success, try to login", updatedUser});
    }
    else{
        next(new Error("Unknown error, please try again"))
    }
}

export const Login = async (req,res,next) => {
    const {email, password} = req.body;
    const userCheck = await userModel.findOne({email});
    if(userCheck){
        if(userCheck.status == "Not-Active"){
            return next(new Error("User does not exist", {cause: 404}))
        }
        if(!userCheck.confirmed){
            return next(new Error("Confirm your email", {cause: 400}))
        }
        const match = bcrypt.compareSync(password, userCheck.password);
        if(match){
            userCheck.isLoggedIn = true;
            await userCheck.save();
            const token = tokenFunction({payload: {id: userCheck._id, email: userCheck.email}})
            res.json({message:"Login Success", token});
        }
        else{
            next(new Error("In-Valid Login information", {cause: 400}))
        }
    }
    else{
        next(new Error("In-Valid Login information", {cause: 400}))
    }
}

export const LogOut = async (req,res) => {
    const {_id} = req.user;
    const userLogOut = await userModel.findByIdAndUpdate(
        _id,
        {isLoggedIn: false }
    )
    if(userLogOut){
        // return boolean DestroyToken = true to the client side to delete the token
        res.status(200).json({message:"Log Out success", DestroyToken: true});
    }
    else{
        next(new Error("Log Out failed"))
    }
}

export const getUser = async (req,res, next) => {
    const user = req.user;
    if( user){
        if(user.status == "Not-Active"){
            return next(new Error("User does not exist", {cause: 404}))
        }
        res.status(200).json({message: "Done", user});
    }
    else{
        next(new Error("In-Valid Id", {cause: 400}))
    }
}

export const updateUser = async (req,res, next) => {
    const {name, mobile} = req.body;
    const userCheck = req.user;
    if(userCheck.status == "Not-Active"){
        return next(new Error("User does not exist", {cause: 404}))
    }
    const user = await userModel.findByIdAndUpdate(
        userCheck._id,
        {name, mobile},
        {new: true}
    )
    if(user){
        res.status(200).json({message:"Update Done", user});
    }
    else{
        // res.json({message:"Update Failed"});
        next(new Error("Update Failed"))
    } 
}

export const softDeleteUser = async (req,res,next) => {
    const userCheck = req.user;
    if(userCheck.status == "Not-Active"){
        return next(new Error("User does not exist", {cause: 404}))
    }
    const user = await userModel.findByIdAndUpdate(
        userCheck._id,
        {status: "Not-Active"},
        {new: true}
    );
    if( user.deletedCount){
        res.json({message: "Soft Delete Done", user});
    }
    else{
        next(new Error("In-Valid Id", {cause: 400}))
    }
}

export const deleteUser = async (req,res,next) => {
    const {_id} = req.user;
    const user = await userModel.deleteOne({_id});
    if( user.deletedCount){
        res.json({message: "Delete Done", user});
    }
    else{
        next(new Error("In-Valid Id", {cause: 400}))
    }
}

export const changePassword = async (req,res,next) => {
    const {oldpassword,password} = req.body;
    const {_id} = req.user;
    const user = await userModel.findById(_id);
    if(user){
        const match = bcrypt.compareSync(oldpassword, user.password);
        if(match){
            user.password = bcrypt.hashSync(password,+process.env.SALT_ROUNDS);
            await user.save();
            res.status(200).json({message: "Password changed successfully"});
        }
        else{
            return next(new Error("In-Valid Password", {cause: 400}))
        }
    }
    else{
        next(new Error("Unknown error, Try again"));
    }
}

export const sendForgetPasswordCode = async (req,res,next) => {
    const {email} = req.body;
    const user = await userModel.findOne({email});
    if(user){
        const emailCheck = sendEmail({
            to: email,
            subject: "Reset Password",
            message: `<a>Confirm Code: ${process.env.FORGOT_PASSWORD_CODE}</a>`
        })
        if(emailCheck){
            res.status(200).json({message: "Email resent password sent"});
        }
        else{
            return next(new Error("Unknown Error, try again"))
        }
    }
    else{
        next(new Error("In-Valid email", {cause: 400}))
    }
}

export const resetPassword = async (req,res,next) => {
    const {code, email, newpassword} = req.body;
    if(code == process.env.FORGOT_PASSWORD_CODE){
        const hashedpassword = bcrypt.hashSync(newpassword,+process.env.SALT_ROUNDS);
        const user = await userModel.findOneAndUpdate(
            {email},
            {password: hashedpassword}
        )
        if(user){
            res.status(200).json({message: "Password Changed , try to login"});
        }
        else{
            return next(new Error("Unknown Error, try again"))
        }
    }
    else{
        next(new Error("In-Valid Code", {cause: 400}))
    }
}

// Upload Profile Picture
export const uploadProfilePicture = async (req, res, next) => {
    if(!req.file){
        next(new Error("Please upload your picture", {cause: 400}))
    }
    const {_id} = req.user;
    const user = await userModel.findByIdAndUpdate(
        _id,
        {profile_pic_local: req.file.path},
        {new: true}
    )
    if(!user){
       return next(new Error("Please try to login", {cause: 400}))
    }
    res.status(200).json({message: "Profile picture uploaded", user});
}

// Upload Profile Picture Cloudinary
export const uploadProfilePictureCloud = async (req, res, next) => {
    if(!req.file){
        next(new Error("Please upload your picture", {cause: 400}))
    }
    const {_id, name} = req.user;
    console.log(req.file);
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder: `Library/user/${name}`
    });

    const user = await userModel.findByIdAndUpdate(
        _id,
        {profile_pic_cloud: secure_url, profile_pic_id: public_id},
        {new: true}
    )
    if(!user){
       return next(new Error("Please try to login", {cause: 400}))
    }
    res.status(200).json({message: "Profile picture uploaded", user});

}