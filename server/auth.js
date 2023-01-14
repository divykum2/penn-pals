// import jwt
const jwt = require('jsonwebtoken');
const axios = require('axios');
const api = axios.create({baseURL: "http://localhost:8080"});

// import the db interactions module
const dbLib = require('./dbFunctions');

/**
 * autheticates a user by decoding the JWT
 * @returns true if the user is valid
 */
const authenticateUser = (token, key) => {
  // check the params
  if (token === 'null' || key === null || !key) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, key);
    return true;
  } catch (err) {
    console.log("error inside auth", err)
    return false;
  }
};

module.exports = { authenticateUser };