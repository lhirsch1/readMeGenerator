const axios = require('axios');
const fs = require('fs');
const util = require('util');
const inquirer = require('inquirer');

const appendFileAsync = util.promisify(fs.appendFile);

let qArray;

let userName = '';
let avatar = '';

const questions = [];

const repoArray = [];

function writeToFile(fileName, data) {
}

function init() {

  //repos https://api.github.com/users/lhirsch1/repos

  inquirer
    .prompt({
      message: "Enter your GitHub username:",
      name: "username"
    })
    .then(function ({ username }) {
      //console.log(username);

      //axios call to github retrives user information
      axios
        .get(`https://api.github.com/users/${username}/repos`)
        .then(function (res) {
          userName = username;
          console.log(userName);
          //for loop puts repo names into an array
          for (i = 0; i < res.data.length; i++) {
            //console.log(res.data[i].name);
            repoArray.push(res.data[i].name);
          }
          console.log("owner ", res.data[0].owner);
          console.log(repoArray);
          avatar = res.data[0].avatar_url;
          var email = "himom@github.com"
          //console.log(`avatar ${avatar}`);

          // console.log(userName)
          generateQuestions(userName,avatar,repoArray);

          fs.writeFile("log.md", `${username}'s read me![image of ${username}](${avatar})`, function (err) {

            if (err) {
              return console.log(err);
            }

          

          });
        });
      //add error handing for username search

    });
}

init();



// project title, description, table of cont, installation, usage, license, contributing, tests, questions,profile pic, githubemail

//create new readme.md file
//populate read me with info from git hub

//table of contents
//add a link for every chunk user chooses to do. 




//elements to save to data variable
//badge


//inputs


async function generateQuestions() {

  //class to construct questions that are type input and confirm
  class InputConfirmQuestion {
    constructor(type, message, name) {
      this.type = type;
      this.message = message;
      this.name = name;
    }
    makeQuestion() {
      console.log('hi')
    }
  }

  //class to construct questions with multiple choices
  class ChoiceQuestion {
    constructor(type, message, name, choices) {
      this.type = type;
      this.message = message;
      this.name = name;
      this.choices = choices
    }
    makeQuestion() {
      console.log('hi')
    }
  }
  const qRepo = new ChoiceQuestion('list', "Which repo would you like to make a read me for?", 'repos', repoArray);
  const qTitle = new InputConfirmQuestion('input', 'What is your project title?', 'projectTitle');
  const qDescription = new InputConfirmQuestion('input', 'What is your project description?', 'description');
  const qInstallation = new InputConfirmQuestion('input', 'What are the instalation instructions?', 'installation');
  const qUsage = new InputConfirmQuestion('input', 'What is your usage tips?', 'usage');
  const qAddContributors = new InputConfirmQuestion('input', `List contributor's GitHub usernames separated by spaces`, `contributorList`);
  //const qTests = new InputConfirmQuestion('input', 'Enter text for Tests section', 'tests');
  //elements question asks which items user would like to have in their read me
  const qElements = new ChoiceQuestion('checkbox', 'Which of these elements would you like in your read me?', 'elements', ['Title', 'Repo', 'Installation', 'Usage', 'License', 'Contributors', 'TableOfContents'])

  const qLicense = new ChoiceQuestion('checkbox', 'Which license would you like to use?', 'license', ['MIT', 'GPLv2', 'Apache']);

  inquirer.prompt([qElements]).then(function (data) {
    //take data array, add q to start insert into inquirer
    qArray = data.elements;

    //this for loop takes the elements the user selected to be in the readme and adds q infront of the name
    //to turn the items back into the question variables. Shut up, I know. 
    for (i = 0; i < qArray.length;) {
      qArray[i] = eval('q' + qArray[i]);
      i++
      //console.log(qArray);
    }

    inquirer.prompt(qArray).then(function (data) {
      console.log(data);
      if (data.hasOwnProperty("projectTitle")) {
        
        appendFileAsync('readme2.md', `Title: ${data.projectTitle} \n`);
      }
      if (data.hasOwnProperty("repos")) {
        appendFileAsync('readme2.md', `Repository: ${data.repos} \n`);
      }
      if (data.hasOwnProperty("description")) {
        appendFileAsync('readme2.md', `Description: ${data.description} \n`);
      }
      if (data.hasOwnProperty("installation")) {
        appendFileAsync('readme2.md', `Installation: ${data.installation} \n`);
      }
      if (data.hasOwnProperty("usage")) {
        appendFileAsync('readme2.md', `Usage: ${data.usage} \n`);
      }
      if (data.hasOwnProperty("contributorList")) {
        appendFileAsync('readme2.md', `Contributors: ${data.contributorList} \n`);
      }
      if (data.hasOwnProperty("license")) {
        appendFileAsync('readme2.md', `License: ${data.license} \n`);
      }

    }).catch(function (err) {
      console.log(err);
    })
  }
  )
}
//project title
//description
//which elements
//installation
//usage


//confirms


//table of contents
//contributing


//list
//license







//tests

//questions

