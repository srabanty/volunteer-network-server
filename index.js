const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const ObjectId = require('mongodb').ObjectID;

const port = 5000


const app = express()

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ytkts.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;

app.get('/',(req, res)=>{
    res.send('Hello World !')
})



const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const events = client.db("volunteerNetwork").collection("events");
  const works = client.db("volunteerNetwork").collection("allWorks");
  console.log("success");
  app.post('/addEvents',(req,res)=>{
    const newEvent = req.body;
    events.insertOne(newEvent)
    .then(result=>{
        console.log(result);
        res.send(result.insertedCount > 0);
    })
    console.log(newEvent);
})

app.post('/addWorks',(req,res)=>{
    const work = req.body;
    console.log(work);
    works.insertMany(work)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
})

app.get('/works',(req,res)=>{
    works.find({})
    .toArray((err,documents)=>{
        res.send(documents);
    })
})

app.get('/volunteer', (req,res)=>{
    events.find({})
    .toArray((err, documents)=>{
        res.send(documents);
    })
})

app.get('/events', (req,res)=>{
    events.find({email: req.query.email})
    .toArray((err, documents)=>{
        res.send(documents);
    })
})

app.delete('/delete/:id',(req,res)=>{
    console.log(req.params.id);
    events.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
        console.log(result);
        res.send(result.deletedCount > 0);
        // res.redirect('/events');
    })
})

});



app.listen(port)