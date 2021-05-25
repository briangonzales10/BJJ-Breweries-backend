//Required
require('dotenv').config()
const express = require('express')
const {MongoClient} = require('mongodb')
let ObjectId = require('mongodb').ObjectID;
const app = express()

//Variables
const PORT = process.env.PORT || 3000
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.cthf2.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
//Uses
app.use(express.json())
const client = new MongoClient(DB_URL)



client.connect( (err) =>{
    if (err) {
        return console.error(err)
    }
    console.log('Connected to DB Server');
    const db = client.db(DB_NAME)
 
    const tourCollection = db.collection("tour")
    console.log(db);

  app.listen(PORT, () =>{
    console.log(`Connected & listening on port ${PORT}`);
})

///////////////////DB CONNECTION OPEN////////////////////
app.get('/list', async(req, res) =>{
    const results = await tourCollection.find({}).toArray()
    res.json(results)
})


app.post('/tours', async(req, res) =>{
    const newTour = {
        name: req.body.name,
        breweries: req.body.breweries,
    };
    console.log(newTour);
    
    if (Array.isArray(newTour.breweries)) {

    const result = await tourCollection.insertOne(newTour)
    console.log(result);
    res.send('success')
    }
    else {
        res.send('breweries must be an array')
    }

})

app.delete('/tours/:id', async (req, res) =>{
    const deleteID = { 
        "_id" : ObjectId(req.params.id) 
    }
    console.log(deleteID);
    await tourCollection.deleteOne(deleteID)
    res.send('Deletion Success')
})

app.put("/tours/:id", async(req, res) =>{
    const {name, breweries} = req.body
    const {id} = req.params
    const filter = {'_id' : ObjectId(id)}
   
    console.log(`Brewery Array Length ${breweries.length}`);

    const updateBreweries = breweries

    if (name.length !== 0){
        await tourCollection.updateOne(filter, 
           {$set: {name: name} })
    }
console.log(updateBreweries);
    if (Array.isArray(updateBreweries)) {
        await tourCollection.updateOne(filter, 
            {$addToSet: {breweries: {$each: updateBreweries}}})
            console.log('multi array pushed');
            res.send({status: "Success"})
    }else{
        res.send("please update breweries")
    }
    
    
})




////////////////////DB CONNECTION CLOSE//////////////////
// client.close();

})