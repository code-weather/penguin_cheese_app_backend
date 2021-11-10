////////////////
// Dependencies
////////////////
require("dotenv").config()
const {PORT = 3002, DATABASE_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")

///////////////////////
// Database Connection
///////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))


/////////////////////
// Models
/////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
}, {timestamps: true})

const Cheese = mongoose.model("Cheese", CheeseSchema)


/////////////////////////
// Middleware
/////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies


///////////////
// Routes
///////////////
// create a test route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// index route
app.get("/cheese", async (req, res) => {
    try {
        // send all cheese
        res.json(await Cheese.find({}))
    } catch(error) {
        res.status(400).json({ error })
    }
})

// create route
app.post("/cheese", async (req, res) => {
    try {
        // create a new cheese
        res.json(await Cheese.create(req.body))
    } catch(error) {
        res.status(400).json({ error })
    }
})

// update route
app.put("/cheese/:id", async (req, res) => {
    try {
        // update a cheese
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    } catch (error) {
        res.status(400).json({ error });
    }
})

// destroy route
app.delete("/cheese/:id", async (req, res) => {
    try {
        // update a cheese
        res.json(await Cheese.findByIdAndRemove(req.params.id, req.body))
    } catch (error) {
        res.status(400).json({ error })
    }
})


/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})