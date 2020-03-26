const axios = require('axios');
const fs = require('fs');
const util = require('util');
const inquirer = require('inquirer');

const questions = [

];

function writeToFile(fileName, data) {
}

function init() {

  //repos https://api.github.com/users/lhirsch1/repos

  inquirer
    .prompt({
      message: "Enter your GitHub username:",
      name: "username"
    })
    .then(function ({username}) {
      console.log(username);

      axios
        .get(`https://api.github.com/users/${username}/events/public`)
        .then(function (res) {
          console.log(res.data);
          var avatar = res.data.avatar_url;
          console.log(`avatar ${avatar}`);
        });

    });
}

init();

//take user input for user name
//prompt user to select repo
//get git hub info
  // project title, description, table of cont, installation, usage, license, contributing, tests, questions,profile pic, githubemail

//create new readme.md file
//populate read me with info from git hub

