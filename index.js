const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
(async function () {
    try {
        // `who-to-greet` input defined in action metadata file
        const linter = core.getInput('name');
        const command = core.getInput('command');
        const totalRegExp = RegExp(core.getInput('total_regexp'));
        const errorsRegExp = RegExp(core.getInput('errors_regexp'));
        const warningsRegExp = RegExp(core.getInput('warnings_regexp'));

        console.log(`${linter} : ${command} ${totalRegExp} ${errorsRegExp} ${warningsRegExp}`);


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
        try {
            let number = await exec.exec(command, null, options);
        } catch (error) {

        }
        let total = parseInt(myOutput.match(totalRegExp)[0].match(/\d+/));
        let errors = parseInt(myOutput.match(errorsRegExp)[0].match(/\d+/));
        let warnings = parseInt(myOutput.match(warningsRegExp)[0].match(/\d+/));
        console.log(`${total} ${errors} ${warnings}`);
        core.setOutput("errors", errors);
        core.setOutput("warnings", warnings);
        //reset --hard HEAD~1
        let compareBranch = core.getInput("compare_branch");
        await exec.exec(`git fetch origin  ${compareBranch}`);
        await exec.exec(`git checkout origin/${compareBranch}`, null,options);
        myOutput = "";
        myError = "";
        try {
            let number = await exec.exec(command, null, options);
        } catch (error) {

        }
        let totalB = parseInt(myOutput.match(totalRegExp)[0].match(/\d+/));
        let errorsB = parseInt(myOutput.match(errorsRegExp)[0].match(/\d+/));
        let warningsB = parseInt(myOutput.match(warningsRegExp)[0].match(/\d+/));
        if(totalB<total){
            core.setFailed("There are now more errors and warnings in total!");
        }
        if(errorsB<errors){
            core.setFailed("There are now more errors in total!");
        }
        if(warningsB<warnings){
            core.setFailed("There are now more warnings in total!");
        }
        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event payload: ${payload}`)
    } catch (error) {
        core.setFailed(error.message);
    }
})();