import { Router } from "express";
import { auth } from "../../Middleware/authentication.js";
import { asyncHandler } from "../../utils/errorHanding.js";
import * as issueController from "./issue.controller.js"
const router = Router();

router.post("/:book_id",auth(),asyncHandler(issueController.issueBook));
router.get("/user/books",auth(),asyncHandler(issueController.getUserIssuedBooks));
router.get("/user/books/notReturned",auth(),asyncHandler(issueController.getUserNotReturnedbooks));
router.get("/user/book/return/:book_id",auth(),asyncHandler(issueController.returnBook));

export default router;