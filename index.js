const express = require('express')
const { MongoClient } = require('mongodb');
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
    res.send("Server Running well ✅✅")
})



async function run() {

    try {
        await client.connect();
        const database = client.db("WatchWorldWebsite");
        const watchesCollection = database.collection("watches");

        // adding watches to database
        app.post('/addWatches', async (req, res) => {
            const newWatch = req.body;
            const result = await watchesCollection.insertOne(newWatch);
            console.log(result);
            res.send(result)

        })

        // load all watches
        app.get('/watches', async (req, res) => {
            const result = await watchesCollection.find({}).toArray()
            console.log(result);
            res.json(result)
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