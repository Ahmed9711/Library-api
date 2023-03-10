import { model, Schema } from "mongoose";

const issueSchema = new Schema({
    book_info: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Book'
        },
        book_name: {
            type: String,
            required: true
        },
        issueDate: {
            type: Schema.Types.Date,
            default: Date.now()
        },
        returnDate: {
            type: Schema.Types.Date,
            default: Date.now() + 5 * 60 * 1000  // 5 mins from the issue date for testing
        },
        returned: {
            type: Boolean,
            default: false
        },
        late: {
            type: Number,
            default: 0
        },
        fine: {
            type: Number,
            default: 0
        }
    },

    user_info:{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        username: {
            type: String,
            required: true
        }
    }
})

const issueModel = model("Issue",issueSchema);
export default issueModel;