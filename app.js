const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const remoteDB = "mongodb+srv://admin-naman:Naman%40456@cluster0.0nvvwvh.mongodb.net/?retryWrites=true&w=majority/test"
const localDB = "mongodb://localhost:27017/capstonePortal";
mongoose.connect(remoteDB, {useNewUrlParser: true});


const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  rollnumber: String,
  laststatus: String,
  entry: String,
  exit: String
}, {
  writeConcern: {
          j: true,
          wtimeout: 1000
        }
});

//Level 2 encrypting the database-add before model
// const secret = "Thisisourlittlesecret.";
// userSchema.plugin(encrypt,{secret:secret, encryptedFields:['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req,res)=>{ // GET on "/" to obtain all records
  User.find(function(err,foundUsers){
    //res.send(foundUsers);
    if(!err) res.send(foundUsers);
    //res.send("Hello World")
  })
})

app.get("/:email",function(req,res){  //GET on "/:email" to get records of a specific user
  const requestedUser = req.params.email;

  User.findOne({email: requestedUser}, function(err, foundUser){
      if(!err){
        res.send(foundUser);
      } else {
        res.send(err);
      }
  });
});

app.post("/:email", function(req,res){  // POST on "/email" to create a new user.

  // User.findOne({email: req.params.email},function(err, foundUser){
  //   if(foundUser){
  //     res.send("User already exists");
  //   }
  //   else{
  //
  //   }
  // })

  const newUser = new User({
    email: req.params.email,
    password: req.body.password,
    rollnumber: req.body.rollnumber,
    laststatus: "Exit",
    entry: "",
    exit: ""
  });

  newUser.save(function(err){
    if(!err){
      res.send("Successfully added new user!")
    } else {
      res.send(err);
    }
  });


});

app.patch("/:email", function(req,res){
  const requestedUser = req.params.email;
  User.updateOne(
    {email: requestedUser},
    {$set: req.body},
    function(err){
      if(err) console.log(err)
      else res.send("Successfully Updated");
    }
  )
});

app.delete("/:email", function(req,res){
  User.deleteOne(
    {email: req.params.email},
    function(err){
      if(!err){
        res.send("Record Deleted Successfully!")
      }
    }
  )
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});
