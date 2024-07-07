const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let matchedUser = users.filter((user) => {
        return user.username === username
    });
    return matchedUser.length > 0 ? false : true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let authUser = users.filter((user) => {
        return user.username === username && user.password === password
    });
    return authUser.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  console.log(username);
  console.log(password);
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
}
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data: password
    }, "access", {expiresIn: 60*60});
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
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.session.authorization.username;
  if(books[isbn]){
    let bookRev = books[isbn].reviews;
    bookRev[user] = review;
    return res.send(200).json({message: `Book review added or modified successfully!`});
  }else{
      return res.status(404).json({message: `Book with ISBN ${isbn} not found!`});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;
    if (books[isbn]) {
        let bookRev = books[isbn].reviews;
        delete bookRev[user];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
