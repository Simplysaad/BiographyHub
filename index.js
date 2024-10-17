

const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const connectDb = require('./server/Config/db.js')
const expressLayouts = require("express-ejs-layouts")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
  console.log(`app listening at http://localhost:${PORT}`)
})
connectDb()

//body parser to json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//EXPRESS SESSIONS
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookies:{
    maxAge: 3600000,
    secure: false
  }
}))

//USE COOKIE PARSER 
app.use(cookieParser())

//VIEWS
app.set("view engine", "ejs")
app.set("views", "views")

//LAYOUTS
app.use(expressLayouts)
app.set("layout", "layouts/main")

//STATIC
app.use(express.static('PUBLIC'))

//ROUTING
app.use("/", require('./server/Routes/admin_routes.js'))
app.use("/", require('./server/Routes/routes.js'))

