import { Router } from "express";
import { auth } from "../../Middleware/authentication.js";
import { validation } from "../../Middleware/validation.js";
import { myMulter, myMulterCloud, validaition_file } from "../../Services/local_multer.js";
import { asyncHandler } from "../../utils/errorHanding.js";
import * as bookController from './book.controller.js'
import { createBookValidation } from "./book.validation.js";
const router = Router();

router.post("/new",auth(),validation(createBookValidation),asyncHandler(bookController.createBook));
router.get("/",auth(),asyncHandler(bookController.getAllBooks));

//Upload local
router.patch("/picture/local/:_id",auth(),myMulter(validaition_file.image,'book').single('image'),asyncHandler(bookController.uploadBookPicture))
//Upload cloud
router.patch("/picture/cloud/:book_id",auth(),myMulterCloud().single('image'),asyncHandler(bookController.uploadBookPictureCloud))

export default router;