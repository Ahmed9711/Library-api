
export const validation = (schema) =>{
    return (req,res,next) =>{
        const requestKeys = ['body','params','query','headers','file','files'];
        let validationErrors = [];
        for (const key of requestKeys) {
            if(schema[key]){
                const validationResult = schema[key].validate(req[key],{abortEarly: false});
                if(validationResult?.error?.details){
                    validationErrors.push(validationResult.error.details)
                }
            }
        }

        if(validationErrors.length){
            return res.json({message: "Validation Error", Error: validationErrors});
        }
        return next();
    }
}