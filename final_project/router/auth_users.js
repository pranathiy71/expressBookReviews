const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const matchedUser = users.filter((user) => user.username === username);
    return matchedUser.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const authUser = users.filter((user) => user.username === username && user.password === password);
    return authUser.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, "access", {expiresIn: 60*60});
    req.session.authorization = {
        accessToken,
        username
    };
    return res.status(200).json({message: `User successfully logged in.`});
  }else{
      return res.status(404).json({message: `Username or password is invalid.`});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
