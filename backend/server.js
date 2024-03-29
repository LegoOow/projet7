const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.use(bodyParser.json());

const db = require("./models");

db.sequelize.sync();

require("./routes/user")(app);
require("./routes/post")(app);
require("./routes/comment")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});