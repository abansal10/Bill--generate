const path = require('path');
const express = require('express');
//const bodyParser = require('body-parser');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const port= process.env.port || 4000
require('./mongodb/mongodb')

const errorController = require('./controllers/error');
// const User = require('./models/user');
<<<<<<< HEAD
//Added By Raja

=======
//commented by Akash
>>>>>>> origin
const adminRoutes=require('./route/admin')
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use(bodyParser.urlencoded())
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// parse various different custom JSON types as JSON
//app.use(bodyParser.json({ type: 'application/*+json' }));
// parse some custom thing into a Buffer
app.use(express.static(path.join(__dirname, 'public')));


app.use(adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

app.listen(port,()=>{
  console.log(`running on port dev ${port}`)
})
