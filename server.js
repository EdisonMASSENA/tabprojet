// Install express server 
const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/tabprojet'));



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./src/app/models');

db.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/tabprojet/index.html'));
});

require('./src/app/routes/auth.routes')(app);
require("./src/app/routes/tableau.routes")(app);
require('./src/app/routes/file.routes')(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});