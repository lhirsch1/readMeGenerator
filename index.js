const axios = require('axios');
const fs = require('fs');
const util = require('util');

const questions = [

];

function writeToFile(fileName, data) {
}

function init() {

    axios
  .get("https://api.github.com/users/lhirsch1")
  .then(function(res) {
    console.log(res.data);
  });

}

init();

//take user input for user name
  //then 
//get git hub info
  // project title, description, table of cont, installation, usage, license, contributing, tests, questions,profile pic, githubemail

//create new readme.md file
//populate read me with info from git hub

