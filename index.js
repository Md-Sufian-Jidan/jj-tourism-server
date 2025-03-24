const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.port || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvjjrvn.mongodb.net/?appName=Cluster0`;


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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        const addTouristPlaceCollection = client.db("Jj-tourism").collection("add-tourist-place");
        const userCollection = client.db("Jj-tourism").collection("users");
        const placesCollection = client.db("Jj-tourism").collection("places");

        // users related apis
        app.post('/user', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // tourist place related data
        app.get('/tourist-spots', async (req, res) => {
            const result = await placesCollection.find().toArray();
            res.send(result);
        });

        app.get('/tourist-spot/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await placesCollection.findOne(query);
            res.send(result);
        });

        app.post('/add-tourist-spot', async (req, res) => {
            const tourist_spot = req.body;
            const result = await addTouristPlaceCollection.insertOne(tourist_spot);
            res.send(result);
        });

        app.get('/all-tourist-place', async (req, res) => {
            const result = await addTouristPlaceCollection.find().toArray();
            res.send(result);
        });

        app.get('/tourist-place/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addTouristPlaceCollection.findOne(query);
            res.send(result);
        });

        // my list related api
        app.get('/my-list/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await addTouristPlaceCollection.find(query).toArray();
            res.send(result);
        });

        app.patch('/update-tourist/:id', async (req, res) => {
            const updateTourist = req?.body;
            const id = req?.params?.id;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: updateTourist?.name,
                    email: updateTourist?.email,
                    Country: updateTourist?.Country,
                    average_cost: updateTourist?.average_cost,
                    image: updateTourist?.image,
                    location: updateTourist?.location,
                    seasonality: updateTourist?.seasonality,
                    short_description: updateTourist?.short_description,
                    totalVisitorsPerYear: updateTourist?.totalVisitorsPerYear,
                    tourists_spot_name: updateTourist?.tourists_spot_name,
                    travel_time: updateTourist?.travel_time,
                },
            };
            const result = await addTouristPlaceCollection.updateOne(query, update);
            res.send(result);
            console.log(query, update, result);
        });


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('jj tourism server is ready');
});

app.listen(port, (req, res) => {
    console.log(`jj tourism server is running on port: ${port}`);
});