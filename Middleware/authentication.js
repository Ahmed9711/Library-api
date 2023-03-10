import userModel from '../DB/Models/user.model.js';
import { tokenFunction } from '../utils/tokenFunction.js';

export const auth = () => {
    return async (req, res, next) => {
        try {
            const {authorization} = req.headers;
            if(!authorization){
                return res.json({message: "Req headers does not have a token"})
            }
            if(!authorization.startsWith(process.env.TOKEN_PREFIX)){
                return res.json({message: "In-Valid token"})
            }
            const token = authorization.split(process.env.TOKEN_PREFIX)[1];
            const decoded = tokenFunction({payload: token, generate: false })
            if(!decoded?.id){
                return res.json({message: "Unvalid token payload"})
            }
            const user = await userModel.findById(decoded.id);
            if(!user){
                return res.json({message: "This user does not exist"})
            }
            req.user = user;
            next();
        } catch (error) {
            res.json({message: "Auth Error", error});
        }
    }
}