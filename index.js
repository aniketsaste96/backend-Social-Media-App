const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const cors = require("cors");
const dbConnection = require("./db.js")
const port = process.env.PORT || 9000;
const usersRoute = require("./routes/usersRoute")
const postRoute = require("./routes/postsRoute")
//even if i entered values in body getting validation error
const bodyParser = require("body-parser")
app.use(cors())
//***middleware parses incoming requests with JSON payloads 
//too much file upload set file size limit
app.use(express.json({ limit: '25mb' }));

app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/", (req, res) => {
//     res.send("This is social Media")
// })

//routes
app.use('/api/users/', usersRoute)
app.use('/api/posts/', postRoute)



//server 
app.listen(port, () => console.log(`server running in ${port}👍😊`));