const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB
const uri = "mongodb+srv://<username>:<password>@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
    const packagesCollection = client.db("pixelCloud").collection("packages");
    }
    finally{
        // client.close();
    }
};
run().catch(error => console.log(error));


app.get('/', (req, res) =>{
    res.send('Hello From Pixel Cloud Server');
});

app.listen(port, () =>{
    console.log(`Pixel Cloud Server is Running on port : ${port}`)
});