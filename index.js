const express = require("express");
const bodyParser = require('body-parser')
const path = require("path");
const authRoutes = require("./routes/auth");
const datapointsRoutes = require("./routes/datapoints")

const port = process.env.PORT || 5000
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("dotenv").config();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users/:id/datapoints", datapointsRoutes);

//Serve React in Production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));    });
}

app.listen(port, () => console.log(`Connected on port ${port}`))