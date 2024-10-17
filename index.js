

const express = require('express')
const session = require('express-session')
const connectDb = require('./server/config/db.js')
const expressLayouts = require("express-ejs-layouts")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT
app.listen(PORT, ()=>{
  console.log(`app listening at http://localhost:${PORT}`)
})
connectDb()

//body parser to json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//EXPRESS SESSIONS
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookies:{
    maxAge: 600000,
    secure: false
  }
}))



//VIEWS
app.set("view engine", "ejs")
app.set("views", "views")

//LAYOUTS
app.use(expressLayouts)
app.set("layout", "layouts/main")

//STATIC
app.use(express.static('public'))

//ROUTING
app.use("/", require('./server/routes/admin_routes.js'))
app.use("/", require('./server/routes/routes.js'))

