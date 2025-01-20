require('dotenv').config()
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SC_KEY);

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
        const userCollection = database.collection('Users')
        const reviewCollection = database.collection('Reviews')

        // use verify admin after verifyToken
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === 'admin';
            if (!isAdmin) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            next();
        }

        const verifyModerator = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isModerator = user?.role === 'moderator';
            if (!isModerator) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            next();
        }

        //////// user related //////// 

        app.post('/create-user', async (req, res) => {
            const data = req.body
            const query = { userEmail: data.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne({ userName: data.displayName, userEmail: data.email, role: 'user' })
            res.send(result)
        })
        //////// user related //////// 


        //////// data related //////// 

        // get data for home page condition => lowest application fee and recently added
        app.get('/', async (req, res) => {
            const result = await scholarshipsCollection.find().sort({ $natural: -1 }).sort({ applicationFees: 1 }).limit(6).toArray();
            res.send(result)
        })

        // get all data 
        app.get('/all-data', async (req, res) => {
            const result = await scholarshipsCollection.find().toArray()
            res.send(result)
        })
        app.get('/scholarship/:id', async (req, res) => {
            const result = await scholarshipsCollection.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })
        //////// data related //////// 

        //////// review related ////////

        app.post('/add-review/:id', async (req, res) => {
            const id = req.params.id
            const review = req.body
            const result = await reviewCollection.insertOne({ postId: id, review })
            res.send(result)
        })
        //////// review related ////////


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