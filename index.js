const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config()

// use middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g008r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send(" Watch World ## Server Running well ✅✅")
})



async function run() {

    try {
        await client.connect();
        const database = client.db("WatchWorldWebsite");
        const watchesCollection = database.collection("watches");
        const userCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");

        // adding watches to database
        app.post('/addWatches', async (req, res) => {
            const newWatch = req.body;
            const result = await watchesCollection.insertOne(newWatch);
            res.send(result)

        })



        // load all watches
        app.get('/watches', async (req, res) => {
            const result = await watchesCollection.find({}).toArray()
            res.json(result)
        })


        // load single watch
        app.get('/watches/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await watchesCollection.findOne(query)
            res.json(result)
        })

        // delete watch from manage products page
        app.delete('/deleteWatch/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await watchesCollection.deleteOne(query)
            res.send(result)

        })



        // add user to database when they register
        app.post('/addUsers', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // load all users and check they are admin or not
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            console.log(user);
            let isAdmin = false
            if (user?.role === 'admin') {
                isAdmin = true
            }

            res.json({ isAdmin })

        })


        // make user admin 
        app.put('/makeAdmin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        })


        //add order
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // all orders for manage all order option by admin
        app.get('/allOrders', async (req, res) => {
            const allOrders = await ordersCollection.find({}).toArray()
            res.send(allOrders)
        })

        // get orders based on email
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const myOrders = await ordersCollection.find(query).toArray()
            res.send(myOrders)
        })
        // delete specific user order
        app.delete('/ordersDelete/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.send(result)

        })

        // load single order based on id
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.findOne(query)
            res.send(result)
        })

        // modify order
        app.put('/modifyOrder/:id', async (req, res) => {
            const id = req.params.id
            const order = req.body;
            console.log('updated order', order);
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: order
            }

            const result = await ordersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })


        //take review from user
        app.post('/addReview', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        // show reviews to ui

        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find({}).toArray()
            res.send(reviews)
        })


    }

    finally {
        // await client.close();
    }
}


run().catch(console.dir);









app.listen(port, () => {
    console.log(`app listening at :${port}`)
})