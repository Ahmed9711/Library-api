import express from "express"
import { config } from "dotenv"
import * as Routers from './Modules/index.routes.js'
import { stackVar } from './utils/errorHanding.js';
import { ConnectionDB } from './DB/connection.js';

config({path: './utils/setup.env'});
const app = express();
const port = process.env.PORT;
const BaseURL = '/library';
app.use(express.json());
// Connect to the database
ConnectionDB();
// Routers
app.use(`${BaseURL}/user`,Routers.userRouter);
app.use(`${BaseURL}/book`,Routers.bookRouter);
app.use(`${BaseURL}/issue`,Routers.issueRouter);

//Get Uploads
app.use(`${BaseURL}/Uploads`,express.static('./Uploads'))

//Fail response
app.use((err, req,res,next) => {
    if(err){
        res.status(err['cause'] || 500).json({
            message: "Catch error",
            Error: err.message,
            stack: stackVar
        })
    }
})

app.listen(port, () => console.log(`Library app listening on port ${port}!`))