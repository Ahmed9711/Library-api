import jwt from 'jsonwebtoken'

export const tokenFunction = ({
    payload = {} || '',
    signature = process.env.TOKEN_SECRET,
    generate = true
}) => {
    if(typeof payload == 'object' && generate){
        if(!Object.keys(payload).length){
            return false;
        }
        const token = jwt.sign(payload, signature);
        return token;
    }

    else if(typeof payload == 'string' && !generate){
        if(payload == ""){
            return false;
        }
        const decoded = jwt.verify(payload, signature);
        return decoded;
    }
};