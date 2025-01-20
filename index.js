require('dotenv').config()
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wwjbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const database = client.db("Akademi");
        const scholarshipsCollection = database.collection("Scholarships");

        app.get('/', async (req, res) => {
            const result = await scholarshipsCollection.find().sort({ $natural: -1 }).sort({ applicationFees: 1 }).limit(6).toArray();
            res.send(result)
        })

        app.get('/all-data', async (req, res) => {
            const result = await scholarshipsCollection.find().toArray()
            res.send(result)
        })
        app.get('/scholarship/:id', async (req, res) => {
            const result = await scholarshipsCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});