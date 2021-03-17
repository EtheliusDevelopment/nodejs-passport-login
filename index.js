'use strict'
const mongoose = require ('mongoose');
const app = require ('./App');
const dotenv = require ('dotenv');



dotenv.config({path: './config/config.env'});


const port = 3000;

const uri = process.env.MONGO_URI
                

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('db connesso'))
    .catch(e => console.log(e));


/* app.listen(port, () => {
    console.log (`Running on port http://localhost:${port}`)
}) */

app.listen(port, () => {
    console.log(`Running le mie prime API at http://localhost:${port}`)     // visualizzo in console
  })

