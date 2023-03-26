const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error");
const cors=require('cors');
//images
const multer = require('multer');
const path = require('path');
// body parser for json | urlencoded if form
const body_parser = require('body-parser');
//Load env 
require('dotenv').config();

//Router Files
const publicRouter=require("./routes/publicRoutes");
const userRouter = require("./routes/user");
const patientRouter = require("./routes/patient");
const clinicRouter = require("./routes/clinic");
const employeeRouter = require("./routes/employee");
const appointmentRouter = require("./routes/appointment");
const medicineRouter = require("./routes/medicine");
const rescriptionRouter = require("./routes/prescription");
const doctorRouter = require("./routes/doctor");
const calender = require("./routes/doctorsCalender")
const invoiceRouter = require("./routes/invoice");
const paymentRouter=require("./routes/payment");
const loginRouter =require("./routes/login");
const authinticationMw = require("./middlewares/authinticationMw")
const reportRouter=require("./routes/report");


//var for store image 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // direname =>manage OS (w|linux) diraction of file(path)
        cb(null, path.join(__dirname, "images"))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toLocaleDateString("en-US").replace(/\//g, "-") + "=" + file.originalname);

    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image.jpg" || file.mimetype == "image.png" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


//Server
const server = express();


let port = process.env.PORT || 8080;
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL)
    .then(() => {
        server.listen(port, () => {
            console.log(`Server Is Running In ${process.env.DB_URL} On Port ${port}`)
        });
    })
    .catch(error => {
        console.log(" BD Problem" + error)
    })

//Morgan middleware --- Logger 
server.use(morgan('tiny'))

//  cross domain to access from any web to my website =>(codepen)
// server.use((request, response, next) => {
//     response.header("Access-Controll-Allow-Origin", "*"); // access for all
//     response.header("Access-Controll-Allow-Method", "POST,DELETE,PUT,GET,OPTIONS"); //OPTIONS =>for detect error in browser and handle it
//     response.header("Access-Controll-Allow-Headers", "Content-Type,Authorization");  //handle req & response Auth & fetch
//     next();
// });

// server.use((request,response,next)=>{
//     response.header("Access-Control-Allow-Origin","*");
//     response.header("Access-Control-Allow-Methods","GET,POST,DELETE,PATCH,OPTIONS");
//     response.header("Access-Control-Allow-Headers","Content-Type,Authorization")
//     next();
// })

server.use(cors());
// Body Parser (Convert body data to Json format)
server.use(express.json())

server.use(publicRouter)
//Login
// server.use(loginRouter);

// //Authentication MW
// server.use(authinticationMw.login)

//Routes
server.use(userRouter)
server.use(patientRouter)
server.use(clinicRouter)
server.use(employeeRouter)
server.use( "/appointment",appointmentRouter)
server.use("/medicines",medicineRouter);
server.use(rescriptionRouter);
server.use(doctorRouter);
server.use("/calender",calender);
server.use(invoiceRouter);
server.use(paymentRouter);
server.use(reportRouter);



//Not Found Middleware
server.use((request, response, next) => {
    response.status(404).json({ data: "Not Found" });
})
//Error MiddleWare

server.use(errorHandler)
server.use((error, request, response, next) => {
    response.status(500).json({ message: ` ${error}` });
})