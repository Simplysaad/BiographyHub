const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const connectDb = require("./Server/Config/db.js");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`);
});
connectDb();

//body parser to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.set("views", "views");

//LAYOUTS
app.use(expressLayouts);
app.set("layout", "Layouts/main");

//STATIC
app.use(express.static("./PUBLIC"));

//ROUTING
app.use("/auth", require("./Server/Routes/auth.routes.js"));
app.use("/admin", require("./Server/Routes/admin.routes.js"));
app.use("/", require("./Server/Routes/main.routes.js"));
