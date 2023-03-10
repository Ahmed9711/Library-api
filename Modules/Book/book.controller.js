import bookModel from "../../DB/Models/book.model.js"
import cloudinary from "../../utils/cloudinary.js";

// Create book document by admin
export const createBook = async (req, res, next) => {
    // Check if user is admin
    const user = req.user;
    if(!user.isAdmin){
        return next(new Error("User not authorized to add books info", {cause: 401}))
    }
    // create book
    const {name, category, author, num} = req.body;
    const book = new bookModel({name, category, author, num});
    const savedBook = await book.save();
    if(savedBook){
        res.status(201).json({message: "Book Added", savedBook});
    }
    else{
        next(new Error("Unknown error, Try again"));
    }
}
// Get all books info
export const getAllBooks = async (req, res, next) => {
    const books = await bookModel.find({},'-_id name category author isBorrowed');
    if(books.length){
        res.status(200).json({message: "Books:",books})
    }
    else{
        next(new Error("Unknown error, Try again"));
    }
}

// Upload Book Picture local
export const uploadBookPicture = async (req, res, next) => {
    if(!req.file){
        next(new Error("Please upload the book picture", {cause: 400}))
    }
    const {_id} = req.params;
     // Check if user is admin
     const user = req.user;
     if(!user.isAdmin){
         return next(new Error("User not authorized to add books info", {cause: 401}))
     }
    const book = await bookModel.findByIdAndUpdate(
        _id,
        {book_pic_local: req.file.path},
        {new: true}
    )
    if(!book){
       return next(new Error("In-valid Book Id", {cause: 400}))
    }
    res.status(200).json({message: "Book picture uploaded", book});
}

// Upload Book Picture Cloudinary
export const uploadBookPictureCloud = async (req, res, next) => {
    if(!req.file){
        next(new Error("Please upload your picture", {cause: 400}))
    }
    // Check if user is admin
    const user = req.user;
    if(!user.isAdmin){
        return next(new Error("User not authorized to add books info", {cause: 401}))
    }
    const {book_id} = req.params
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder: `Library/book`
    });

    const book = await bookModel.findByIdAndUpdate(
        book_id,
        {book_pic_cloud: secure_url, book_pic_id: public_id},
        {new: true}
    )
    if(!book){
       return next(new Error("In-valid Book Id", {cause: 400}))
    }
    res.status(200).json({message: "Book picture uploaded", book});

}