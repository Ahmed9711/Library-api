let stackVar;
export const asyncHandler = (API) =>{
    return (req, res, next) => {
        API(req,res,next).catch(err => {
            //console.log(err);
            if(err.code == 11000){
                // return res.status(409).json({message:"Email already registered"});
                stackVar = err.stack;
                next(new Error("Email already registered", {cause: 409}))
            }
            // res.status(500).json({message: "Catch error", Error: err.message, stack: err.stack});
            stackVar = err.stack;
            console.log(err.message);
            next(new Error(err.message))
        })
    }
}

export {stackVar}