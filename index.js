const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
(async function(){try {
  // `who-to-greet` input defined in action metadata file
  const linter = core.getInput('name');
  const command = core.getInput('command');
  const totalRegExp = RegExp(core.getInput('total_regexp'));
  const errorsRegExp = RegExp(core.getInput('errors_regexp'));
  const problemsRegExp = RegExp(core.getInput('problems_regexp'));

  console.log(`${linter} : ${command} ${totalRegExp} ${errorsRegExp} ${problemsRegExp}`);


let myOutput = '';
let myError = '';

const options = {};
options.listeners = {
  stdout: (data) => {
    myOutput += data.toString();
  },
  stderr: (data) => {
    myError += data.toString();
  }
};
    options.cwd = core.getInput("cwd");
    try{
  number = await exec.exec(command,null,options);
    } catch (error){
        
    }
  total = parseInt(myOutput.match(totalRegExp)[0].match(/\d+/));
  errors = parseInt(myOutput.match(errorsRegExp)[0].match(/\d+/));
  problems = parseInt(myOutput.match(problemsRegExp)[0].match(/\d+/));
  console.log(`${total} ${errors} ${problems}`);
  core.setOutput("errors",errors);
  core.setOutput("problems",problems);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
})();