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
        const options = {
            sort: { publishTime: -1 },
            projection: { _id: 0, publishTime: 1},
          };
        const cursor = packagesCollection.find(query, options);
        const packages = await cursor.toArray();
        console.log(packages);
        res.send(packages);
    });

    app.get('/packages/home', async(req, res) =>{
        const query = {};
        const options = {
            sort: { publishTime: -1 },
            projection: { _id: 0, publishTime: 1},
          };
        const cursor = packagesCollection.find(query, options).limit(3);
        const packages = await cursor.toArray();
        res.send(packages);
    });

    app.get('/packages/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const eachPackage = await packagesCollection.findOne(query);
        res.send(eachPackage);
    });

    app.post('/packages', async(req, res) =>{
        const review = req.body;
        console.log(review);
        const result = await packagesCollection.insertOne(review);
        res.send(result);
    });

    app.get('/reviews', async(req, res) =>{
        let query = {};
        if(req.query.packageId){
            query = {
                packageId: req.query.packageId
            }
        }
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    //API For My Reviews Page
    app.get('/myreviews', async(req, res) =>{
        let query = {};
        if(req.query.email){
            query = {
                email: req.query.email
            }
        };
        const cursor = reviewsCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
    });

    //API for Editing Review
    app.put('/reviews/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const message = req.body;
        // console.log(message);
        const updateUser = {$set: {
            message: message.message
        }}
        const result = await reviewsCollection.updateOne(filter, updateUser, options);
        res.send(result);
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