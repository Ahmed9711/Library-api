import moment from "moment/moment.js";
import bookModel from "../../DB/Models/book.model.js";
import issueModel from "../../DB/Models/issue.model.js";

export const issueBook = async (req, res, next) => {
    const {book_id} = req.params;
    const {_id, name} = req.user;
    const book = await bookModel.findOne({_id: book_id, isBorrowed: false});
    if(!book){
        return next(new Error("Invalid action", {cause: 400}))
    }
    const issued = new issueModel({
        book_info:{
            id: book._id,
            book_name: book.name
        },
        user_info: {
            id: _id,
            username: name
        }
    })
    const savedIssued = await issued.save();
    if(savedIssued){
        book.isBorrowed = true;
        req.user.bookIssuesInfo.push(savedIssued._id);
        await book.save();
        await req.user.save();
        res.status(201).json({message:"Book issued", savedIssued})
    }
    else{
        next(new Error("Unknown error, try again"));
    }
}

// user Issued books dashboard
export const getUserIssuedBooks = async (req, res, next) => {
    const {_id} = req.user;
    const userbooks = await issueModel.find({"user_info.id": _id},'book_info.book_name book_info.issueDate book_info.returnDate');
    if(userbooks.length){
        res.status(200).json({message:"Done", userbooks})
    }
    else{
        next(new Error("Unknown error, try again"));
    }
}

//user not returned book dashboard
export const getUserNotReturnedbooks = async (req, res, next) => {
    const {_id} = req.user;
    const userbooks = await issueModel.find({"user_info.id": _id, "book_info.returned":false}, "book_info");
    if(userbooks){
        for (const book of userbooks) {
            let date1 = moment(book.book_info.returnDate);
            let date2 = moment(Date.now());
            let diff = date1.diff(date2,'minutes')
            if(diff < 0){
                book.book_info.late = Math.abs(diff);
                book.book_info.fine = Math.abs(diff) * 10;
                await book.save();
            }
        }
        res.status(200).json({message:"Done", userbooks})
    }
    else{
        next(new Error("Unknown error, try again"));
    }
}

// user return book to the library
export const returnBook = async (req, res, next) => {
    const {book_id} = req.params;
    const {_id} = req.user;
    const book = await bookModel.findOne({_id: book_id, isBorrowed: true});
    if(!book){
        return next(new Error("Invalid action", {cause: 400}))
    }
    const issue = await issueModel.findOne({"book_info.id": book._id, "user_info.id":_id});
    if(!issue){
        console.log(issue);
        return next(new Error("Invalid action", {cause: 400}))
    }
    let date1 = moment(issue.book_info.returnDate);
    let date2 = moment(Date.now());
    let diff = date1.diff(date2,'minutes')
    if(diff < 0){
        issue.book_info.late = Math.abs(diff);
        issue.book_info.fine = Math.abs(diff) * 10;
    }
    issue.book_info.returned = true;
    book.isBorrowed = false;
    const savedBook = await book.save();
    const savedIssued = await issue.save();
    if(savedBook && savedIssued){
        res.status(200).json({message: "Book Return Compete", late_fine: issue.book_info.fine})
    }
    else{
        next(new Error("Unknown error, try again"))
    }
}
