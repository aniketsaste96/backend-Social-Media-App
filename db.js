

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://aksaste:aksaste@cluster0.xypsb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection

connection.on('connected', () => {
    console.log('Mongo db connection successfully')
})

connection.on('error', () => {
    console.log('Mongo db connection error')
})

module.exports = mongoose