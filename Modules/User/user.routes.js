import { Router } from "express";
import { auth } from "../../Middleware/authentication.js";
import { validation } from "../../Middleware/validation.js";
import { myMulter, myMulterCloud, validaition_file } from "../../Services/local_multer.js";
import { asyncHandler } from "../../utils/errorHanding.js";
import * as userController from './user.controller.js'
import { changePasswordValidation, forgotPasswordValidation, LoginValidation, resetPasswordValidation, SignUpValidation, updateValidation } from "./user.validation.js";
const router = Router();


router.post("/Signup",validation(SignUpValidation),asyncHandler(userController.signup));
router.get("/confirmEmail/:token",asyncHandler(userController.confirmEmail));
router.post("/Login",validation(LoginValidation),asyncHandler(userController.Login));
router.get("/Logout",auth(),asyncHandler(userController.LogOut));
router.get("/",auth(),asyncHandler(userController.getUser));
router.put("/update",auth(),validation(updateValidation),asyncHandler(userController.updateUser));
router.put("/softdelete",auth(),asyncHandler(userController.softDeleteUser));
router.delete("/",auth(),asyncHandler(userController.deleteUser));
router.put("/changePassword",auth(),validation(changePasswordValidation),asyncHandler(userController.changePassword));
router.post("/forgotPassword",validation(forgotPasswordValidation),asyncHandler(userController.sendForgetPasswordCode));
router.post("/resetPassword",validation(resetPasswordValidation),asyncHandler(userController.resetPassword));

//Upload local
router.patch("/profile/local",auth(),myMulter(validaition_file.image,'user').single('profile'),asyncHandler(userController.uploadProfilePicture));
//Upload cloud
router.patch("/profile/cloud",auth(),myMulterCloud().single('profile'),asyncHandler(userController.uploadProfilePictureCloud));
export default router;