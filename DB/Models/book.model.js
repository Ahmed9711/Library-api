import { model, Schema } from "mongoose";

const bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: String,
    author: String,
    num: Number,
    isBorrowed: {
        type: Boolean,
        default: false
    },
    book_pic_local: String,
    book_pic_cloud: String,
    book_pic_id: String
})

const bookModel = model("Book",bookSchema);
export default bookModel;