const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if( username && password){
        if(isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: `User with username ${username} is registered.`});
        }else{
            return res.status(404).json({message: `User with username ${username} already exists.`});
        }
    }else if(!username){
        return res.status(404).json({message: "Please provide username!"});
    }else if(!password){
        return res.status(404).json({message: "Please provide password!"});
    }
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
function getBooksList(){
    let booksList = new Promise((resolve, reject) =>{
        resolve(books);
    })
    return booksList;
}
public_users.get('/',function (req, res) {
    getBooksList()
    .then((allBooks) => res.send(JSON.stringify(allBooks)));
    // if(books){
    //     return res.send(JSON.stringify(books));
    // }else{
    //     return res.status(300).json({message: "Yet to be implemented"});
    // }
});

// Get book details based on ISBN
function getBooksonIsbn(isbn){
    let booksList = new Promise((resolve, reject) =>{
        if(books[isbn]){
            resolve(books[isbn]);
        }else{
            reject({status: 404,
            message: `Book with ISBN ${isbn} is not found!`});
        }
    })
    return booksList;
}
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn);
  getBooksonIsbn(isbn)
  .then(
      result => res.send(result),
      error => res.status(error.status).json({message: error.message})
  );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooksList()
    .then((allBooks) => Object.values(allBooks))
    .then((bks) => {
        return bks.filter((filterBooks) => filterBooks.author === author);
    })
    .then((booksL) => res.send(booksL))
    .catch((err) =>{
        res.status(404).json({message: `Author ${author} not found!!`});
    })
    // console.log(Object.values(books));
    // return res.status(300).json({message: `Yet to be implemented ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooksList()
    .then((allBooks) => Object.values(allBooks))
    .then((bks) => {
        return bks.filter((filterBooks) => filterBooks.title === title);
    })
    .then((booksL) => res.send(booksL))
    .catch((err) =>{
        res.status(404).json({message: `Author ${author} not found!!`});
    })
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  if(books[isbn]){
    res.send(books[isbn].reviews);
  }else{
    return res.status(404).json({message: `Book with ISBN ${isbn} not found!`});
  }
});

module.exports.general = public_users;
