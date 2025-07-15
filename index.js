const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

require("dotenv").config();

const connectDb = require("./Server/Config/db.js");

const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
    connectDb();
});

//body parser to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Morgan
app.use(morgan("dev"));

//EXPRESS SESSIONS
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookies: {
            maxAge: 3600000,
            secure: false
        }
    })
);

const errorMiddleWare = require("./Server/Utils/error.middleware.js");
app.use(errorMiddleWare);
//USE COOKIE PARSER
app.use(cookieParser());

//VIEWS
app.set("view engine", "ejs");
app.set("views", "Views");

//LAYOUTS
app.use(expressLayouts);
app.set("layout", "Layouts/main");

//STATIC
app.use(express.static("./Public"));

//ROUTING
app.use("/auth", require("./Server/Routes/auth.routes.js"));
app.use("/admin", require("./Server/Routes/admin.routes.js"));
app.use("/", require("./Server/Routes/main.routes.js"));

cron.schedule("30 7,14,19 * * *", async () => {
    try {
        let response = await fetch(
            "https://biographyhub.onrender.com/automate"
        );
        console.log(
            "Posted a new blog automatically at " + new Date().toLocaleString()
        );
        console.log({ ...response });
    } catch (err) {
        console.error(err);
    }
});

async function sendMailNotification() {
    try {
        // create reusable transporter object using Gmail SMTP with your App Password
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // use TLS
            auth: {
                user: process.env.GMAIL_USER, // your Gmail address
                pass: process.env.GMAIL_PASS // your generated App Password
            }
        });

        // setup email data
        const mailOptions = {
            from: '"saad idris" <saadidris23@gmail.com>',
            to: "saadidris23@gmail.com",
            subject: "Biographyhub automated post notification",
            text: "This is to notify you that your post has been sent"
            // html: '<b>This is a test email sent using Nodemailer and Gmail SMTP.</b>',
        };

        // send mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log("Error:", error);
            }
            console.log("Email sent:", info.response);
        });
    } catch (err) {
        console.error(err);
        throw new Error("Error sending mail", err);
    }
}
