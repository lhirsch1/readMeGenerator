//requiring dependencies
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const inquirer = require('inquirer');

//creating async function in a variable
const appendFileAsync = util.promisify(fs.appendFile);

//array to hold questions
let qArray;

//variables for github data
let userName = '';
let avatar = '';

//array holds user repos
const repoArray = [];

//variable to generate markdown string
var markDownString = '';

//function is called to write data to new file
function writeToFile(fileName,data) {
  appendFileAsync(fileName,data);
  console.log("done");
}

//init function runs api call and calls other functions
function init() {

  //repos https://api.github.com/users/lhirsch1/repos

  //inquirer used to make CLI prompts
  inquirer
    .prompt({
      //prompt gets user github name
      message: "Enter your GitHub username:",
      name: "username"
    })
    //promise funciton calls API
    .then(function ({ username }) {
      //axios call to github retrives user information
      axios
        .get(`https://api.github.com/users/${username}/repos`)
        .then(function (res) {
          //sets username variable to input
          userName = username;
          
          //for loop puts repo names into an array
          for (i = 0; i < res.data.length; i++) {
            
            repoArray.push(res.data[i].name);
          }
          //gets avatar image from github
          avatar = res.data[0].avatar_url;
  
          //calls generate questions function w/parameters
          generateQuestions(userName,avatar,repoArray);

          
        });
      //add error handing for username search

    });
}

//calls init function
init();

//generate questions creates prompts to get user input to create MD file
async function generateQuestions() {

  //class to construct questions that that 3 parameters
  class InputConfirmQuestion {
    constructor(type, message, name) {
      this.type = type;
      this.message = message;
      this.name = name;
    }
  }

  //class to construct questions with multiple choices (take 4 parameters)
  class ChoiceQuestion {
    constructor(type, message, name, choices) {
      this.type = type;
      this.message = message;
      this.name = name;
      this.choices = choices
    }
  }
  //instantiate questions
  const qRepo = new ChoiceQuestion('list', "Which repo would you like to make a read me for?", 'repos', repoArray);
  const qTitle = new InputConfirmQuestion('input', 'What is your project title?', 'projectTitle');
  const qDescription = new InputConfirmQuestion('input', 'Enter text for project description?', 'description');
  const qInstallation = new InputConfirmQuestion('input', 'Enter text for installation instructions?', 'installation');
  const qUsage = new InputConfirmQuestion('input', 'Enter text for usage tips?', 'usage');
  const qContributors = new InputConfirmQuestion('input', `List contributor's GitHub usernames separated by spaces`, `contributorList`);
  const qTests = new InputConfirmQuestion('input', 'Enter text for Tests section', 'tests');
  const qQuestions = new InputConfirmQuestion('input', 'Enter text for Questions section', 'questions');
  const qLicense = new ChoiceQuestion('list', 'Which license would you like to use?', 'license', ['MIT', 'GPLv2', 'Apache']);
  const qTableOfContents = new InputConfirmQuestion('confirm', 'Would you like a table of contents?', 'table');
  
  
  //elements question asks which items user would like to have in their read me
  const qElements = new ChoiceQuestion('checkbox', 'Which of these elements would you like in your read me?', 'elements', ['Title', 'Repo', 'Installation', 'Usage', 'License', 'Contributors', 'TableOfContents', 'Tests','Questions'])

  //asks qElements question to user 
  inquirer.prompt([qElements]).then(function (data) {
    //take data array, add q to start insert into inquirer
    qArray = data.elements;

    //this for loop takes the elements the user selected to be in the readme and adds q infront of the name
    //to turn the items back into the question variables. Shut up, I know. 
    for (i = 0; i < qArray.length;) {
      qArray[i] = eval('q' + qArray[i]);
      i++
    }

    //questions are asked to the user based on previous response
    inquirer.prompt(qArray).then(function (data) {
      if (data.hasOwnProperty("projectTitle")) {
        markDownString += `## Title: ${data.projectTitle} \n`
      }
      if (data.hasOwnProperty("repos")) {
        markDownString += `## Repository: ${data.repos} \n`
      }
      if (data.hasOwnProperty("table")) {
        markDownString += `## Table of Contents: \n`
        for(const property in data){
          markDownString +=`* [${property}](#${property}) \n`
        }
      }
      if (data.hasOwnProperty("description")) {
        markDownString +=`## description: \n ${data.description} \n`
        
      }
      if (data.hasOwnProperty("installation")) {
        markDownString += `## installation:  ${data.installation} \n`
      }
      if (data.hasOwnProperty("usage")) {
        markDownString += `## Usage:\n * ${data.usage} \n`
      }
      if (data.hasOwnProperty("contributorList")) {
        markDownString += ` ## Contributors: ${data.contributorList} \n`
      }
      if (data.hasOwnProperty("license")) {
        markDownString += `## License: ${data.license} \n`
      }
      if (data.hasOwnProperty("tests")) {
        markDownString += `## Tests: ${data.tests} \n`
      }
      if (data.hasOwnProperty("questions")) {
        markDownString += `## Questions: ${data.questions} \n`
      }
      //adds github data to markupstring
      markDownString +=  `##${userName}'s read me![image of ${userName}](${avatar})`;
      //calls writeToFile function
      writeToFile('newreadme.md',markDownString);

    }).catch(function (err) {
      console.log(err);
    })
  }
  )
}
