
// const {MongoClient, ObjectID}= require('mongodb');

// const connectionURL= 'mongodb://127.0.0.1:27017'
// const databaseName='invoiceBill'
// MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    
//     if(error)
//     {           
//          return console.log('Unable to connect to database');
//     }
//     console.log("con")
//     const db=client.db(databaseName);

// client.close();
// })

require('dotenv').config()
const mongoose = require('mongoose')

// MONGO_PREFIX=mongodb+srv://
// MONGO_DATABASE=invoiceBill
// MONGO_URL=@cluster-1.pcaai.mongodb.net/
// MONGO_USERNAME=admin
// MONGO_PASSWORD=Raja3011
// const mongoUsername=process.env.MONGO_USERNAME
// const mongoPassword=process.env.MONGO_PASSWORD
// const mongoDatabase=process.env.MONGO_DATABASE
// const urlPrefix=process.env.MONGO_PREFIX
// const url=process.env.MONGO_URL

const mongoUsername="admin"
const mongoPassword="Raja3011"
const mongoDatabase="invoiceBill"
const urlPrefix="mongodb+srv://"
const url="@cluster-1.pcaai.mongodb.net/"

mongoose.connect(urlPrefix+mongoUsername+":"+mongoPassword+url+mongoDatabase, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})