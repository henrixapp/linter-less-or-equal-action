const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
try {
  // `who-to-greet` input defined in action metadata file
  const linter = core.getInput('name');
  const command = core.getInput('command');
  const totalRegExp = RegExp(core.getInput('total_regexp'));
  const errorsRegExp = RegExp(core.getInput('errors_regexp'));
  const problemsRegExp = RegExp(core.getInput('problems_regexp'));

  console.log(`${linter} : ${command} ${totalRegExp} ${errorsRegExp} ${problemsRegExp}`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}