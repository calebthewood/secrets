//jshint esversion:6

require('dotenv').config(); //not set as a const b/c it calls config when starting which will run constantly in the background.
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//mongoose connection route
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//mongoose schema
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//mongoose encryption, convenient method.
//key moved to dotenv file. dotenv is not JS. use snake_case and whatever other standards.
userSchema.plugin( encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//mongoose model
const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
  res.render("home")
});

app.get("/login", function(req, res){
  res.render("login")
});

app.get("/register", function(req, res){
  res.render("register")
});

app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username, //using body-parser to grab info from userName & pswd input on register page
    password: req.body.password
  });

  newUser.save(function(err){
    if(err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password) {
          res.render("secrets")
        }
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
