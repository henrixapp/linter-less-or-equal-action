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
                console.log(myOutput.length);
            },
            stderr: (data) => {
                myError += data.toString();
            }
        };
        options.cwd = core.getInput("cwd");
        let compareBranch = core.getInput("compare_branch");
        await exec.exec(`git fetch origin  ${compareBranch}`);
        let checkedFiles = '.';
        let addedFiles = '';
        if(core.getInput("mode")!="all"){
            await exec.exec(`git diff --name-only --diff-filter=M origin/${compareBranch}`,null, options);
            let include = new RegExp(core.getInput("include"));
            checkedFiles = myOutput.split(/\n/g).map(function(s){
                if(include.includes(s)){
                    return s;
                }
                return '';
            }).join( ' ');
            checkedFiles = myOutput.replace(/\n/g, " ");
            myOutput = '';
            await exec.exec(`git diff --name-only --diff-filter=A origin/${compareBranch}`,null, options);
            addedFiles =  myOutput.split(/\n/g).map(function(s){
                if(include.includes(s)){
                    return s;
                }
                return '';
            }).join( ' ');
            myOutput = '';
        }
        if(checkedFiles == "") {
            checkedFiles = ".";
        }
        try {
            let number = await exec.exec(`${command} ${checkedFiles} ${addedFiles}`, null, options);
        } catch (error) {

        }
        let total = parseInt(myOutput.match(totalRegExp)[0].match(/\d+/));
        let errors = parseInt(myOutput.match(errorsRegExp)[0].match(/\d+/));
        let warnings = parseInt(myOutput.match(warningsRegExp)[0].match(/\d+/));
        console.log(`${total} ${errors} ${warnings}`);
        core.setOutput("errors", errors);
        core.setOutput("warnings", warnings);
        //reset --hard HEAD~1
        
        await exec.exec(`git stash; git checkout origin/${compareBranch}`, null,options);
        myOutput = "";
        myError = "";
        try {
            let number = await exec.exec(`${command} ${checkedFiles}`, null, options);
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
    } catch (error) {
        core.setFailed(error.message);
    }
})();