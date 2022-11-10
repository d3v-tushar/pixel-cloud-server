const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID, ObjectId } = require('bson');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@learnph.159fxoq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    try{
    const packagesCollection = client.db("pixelCloud").collection("packages");
    const reviewsCollection = client.db("pixelCloud").collection("reviews");
    app.get('/packages', async(req, res) =>{
        const query = {};
        const cursor = packagesCollection.find(query);
        const packages = await cursor.toArray();
        res.send(packages);
    });

    app.get('/packages/home', async(req, res) =>{
        const query = {};
        const cursor = packagesCollection.find(query).limit(3);
        const packages = await cursor.toArray();
        res.send(packages);
    });

    app.get('/packages/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const eachPackage = await packagesCollection.findOne(query);
        res.send(eachPackage);
    });

    app.get('/reviews', async(req, res) =>{
        const query = {};
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    app.get('/reviews', async(req, res) =>{
        console.log(req.query);
        let query = {};
        if(req.query.packageId){
            query = {packageId: req.query.packageId};
        }
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    app.post('/reviews', async(req, res) =>{
        const review = req.body;
        console.log(review);
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
    });

    app.delete('/reviews/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await reviewsCollection.deleteOne(query);
        res.send(result);
    });
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