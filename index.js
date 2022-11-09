const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
    const packagesCollection = client.db("pixelCloud").collection("packages");
    app.get('/packages', async(req, res) =>{
        const query = {};
        const cursor = packagesCollection.find(query);
        const packages = await cursor.toArray();
        res.send(packages);
    })
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