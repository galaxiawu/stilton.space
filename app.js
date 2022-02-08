const express = require("express");
const app = express()
const {return_word} = require("./brain_of_stilton");

app.use(express.json())

app.post("/brain", async function (req, res) {
  const data = req.body
  const response = await return_word(data['word'], data['fun_prob'])
  res.send(response)
})

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")
})

// start the server listening for requests
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));