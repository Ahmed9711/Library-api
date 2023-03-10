import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    } ,
    mobile: Number,
    password: String,
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    status:{
        type: String,
        default: "Active"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    bookIssuesInfo: [
        {
            type: Schema.Types.ObjectId,
            ref: "Issue"
        }
    ],
    profile_pic_local: String,
    profile_pic_cloud: String,
    profile_pic_id: String
},{
    timestamps: true
})

const userModel = model("User",userSchema);
export default userModel;