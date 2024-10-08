//index.js
//import {POSTS, findPostById} from './postDb.js'

require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
//const bodyParser = require('body-parser')
const connectDb = require('./server/config/db')


const app = express()
let PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
  console.log(`app listening at http://localhost:${PORT}`)
})
connectDb()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.json());

//VIEWS
app.set('view engine', 'ejs')
app.set('views', 'views')


//LAYOUTS
app.use(expressLayouts)
app.set('layout', 'layouts/main')


//ROUTING
app.use('/', require('./server/routes/admin_routes.js'))
app.use('/', require('./server/routes/routes.js'))
  
