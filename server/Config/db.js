//db.js


const mongoose = require('mongoose')

const connectDb = async() =>{


  try{    
   mongoose.set('strictQuery', false)
    
    let conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB connected to ${conn.connection.host}`)

    
  }
  catch(err){
    console.log(err)
  }
}

module.exports = connectDb
