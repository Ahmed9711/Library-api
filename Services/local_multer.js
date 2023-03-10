import multer from "multer";
import { nanoid } from "nanoid";
import path from 'path'
import { fileURLToPath } from "url";
import fs from 'fs'
import exp from "constants";
// Directory path
const dir_name = path.dirname(fileURLToPath(import.meta.url));
// Validation
export const validaition_file = {
    image: ['image/png','image/jpeg','image/gif']
}

export const myMulter = (validation = validaition_file.image, customPath = 'general') => {

    //file path
    const fullPath = path.join(dir_name, `../Uploads/${customPath}`)
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath, {recursive: true})
    }

    const storage = multer.diskStorage({
        destination:(req, file, cb) => {
            cb(null, fullPath)
        },
        filename:(req, file, cb) => {
            const uniquename = nanoid(6) + '__' + file.originalname;
            cb(null, uniquename);
        }
    })

    const fileFilter = (req,  file, cb) => {
        if(validation.includes(file.mimetype)){
            return cb(null, true)
        }
        cb(new Error("In-valid Extension", {cause: 400}), false);
    }

    const upload = multer({fileFilter, storage})
    return upload;
}

export const myMulterCloud = (validation = validaition_file.image) => {
    const storage = multer.diskStorage({})

    const fileFilter = (req,  file, cb) => {
        if(validation.includes(file.mimetype)){
            return cb(null, true)
        }
        cb(new Error("In-valid Extension", {cause: 400}), false);
    }

    const upload = multer({fileFilter, storage})
    return upload;
}