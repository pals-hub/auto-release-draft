//this file implements all the functionality dedicated to running the git CLI program
//specifically we want to run the git describe command to get the version number of the latest version tag, and
//git log to get commit messages to between latest version, and the previous version.
//executing CLI programs is done using { exec } function in the @actions/exec package. This is an anynchronous API.
//npm --save install @actions/exec

import { exec, ExecOptions } from '@actions/exec'
import * as core from '@actions/core'

export async function getChangesIntroducedByTag (tag: string): Promise<string> {
    const previousVersionTag = await getPreviousVersionTag(tag)
    return previousVersionTag ? getCommitMessagesBetween(previousVersionTag, tag) : getCommitMessagesFrom(tag)
}

//define an async function that takes a tag string arg and returns the list of \n separated changes introduced between this tag and the previous tag
export async function getCommitMessagesBetween (oldTag: string, newTag: string): Promise<string> {
    //get the previous tag, relative to the tag arg of this function using another async function, defined next, and store the result in a const    
    let commitMessages = ''
    //@actions.exec.exec() takes an options object as argument. 
    //The options object must have a listeners field, which in-turn references another object field called stdout. 
    //The object field stdout contains a function whose goal is to capture the output stream.
    //We could write stderr in the field if we wanted to capture the standard error stream instead.
    //The function has a single argument of type Buffer.
    //We would convert the Buffer to string and append it to a variable defined in the outer scope.
    //By default, the exec function would print the Buffer in the log also, which we don't need, so we turn that off by setting the silent field to true.
    //We would check the exit code of the CLI program ourselves 
    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessages += data.toString()
            }
        },
        silent: true, //ignoreReturnCode: true is not set because we don't expect git log to error out, so no need to do special error handling
    }

    //call the async exec funtion to call the CLI program git
    await exec(
        'git',                         //the CLI program to execute
        ['log',                        //args to git CLI; log tells git CLI to look for commit messages
         '${oldTag}..${newTag}',       //this notation tells git to look for the commits between first and second tags only
        ], 
        options                        //the ExecOptions object we defined earlier
    )

    //log the result of the getPreviousVersionTag() using the core.debug()
    core.debug('The commit messages between ${firstTag} and ${secondTag} are:\n${commitMessages}')
    
    //return the previousTag if exitCode is 0, else return null
    //triple equal to === compares both sides for type and value
    return commitMessages.trim()
}

//define an async function that takes a tag string arg and previous tag or returns null if there is no previous tag
export async function getPreviousVersionTag(tag: string): Promise<string | null> {
    let previousTag = ''
    //@actions.exec.exec() takes an options object as argument. 
    //The options object must have a listeners field, which in-turn references another object field called stdout. 
    //The object field stdout contains a function whose goal is to capture the output stream.
    //We could write stderr in the field if we wanted to capture the standard error stream instead.
    //The function has a single argument of type Buffer.
    //We would convert the Buffer to string and append it to a variable defined in the outer scope.
    //By default, the exec function would print the Buffer in the log also, which we don't need, so we turn that off by setting the silent field to true.
    //Set the ignoreReturnCode field to true so that the exec function does not throw an error if the called CLI program ends with a code != 0. 
    //We would check the exit code of the CLI program ourselves 
    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                previousTag += data.toString()
            }
        },
        silent: true,
        ignoreReturnCode: true
    }

    //call the async exec funtion to call the CLI program git
    const exitCode = await exec(
        'git',                  //the CLI program to execute
        ['describe',            //args to git CLI; describe tells git CLI to look for tags
         '--match', 'v[0-9]*',  //--match followed by v[0-9]* tells git CLI to look for the pattern v followed bt digits between 0-9
         'abbrev=0',            //instructs git to only pring the tag
         '--first-parent',      //look into the first branch only, in-case of a merge commit
         '${tag}^'              //start looking from the parent, denoted by ^, of the specified tag
        ], 
        options                 //the ExecOptions object we defined earlier
    )

    //log the result of the getPreviousVersionTag() using the core.debug()
    core.debug('The previous version tag is ${previousTag}')
    
    //return the previousTag if exitCode is 0, else return null
    //triple equal to === compares both sides for type and value
    return exitCode === 0 ? previousTag.trim() : null
}

//define an async function that takes a tag string arg and returns the list of \n separated changes between this tag and the beginning of time
export async function getCommitMessagesFrom (tag: string): Promise<string> {
    let commitMessages = ''
    //@actions.exec.exec() takes an options object as argument. 
    //The options object must have a listeners field, which in-turn references another object field called stdout. 
    //The object field stdout contains a function whose goal is to capture the output stream.
    //We could write stderr in the field if we wanted to capture the standard error stream instead.
    //The function has a single argument of type Buffer.
    //We would convert the Buffer to string and append it to a variable defined in the outer scope.
    //By default, the exec function would print the Buffer in the log also, which we don't need, so we turn that off by setting the silent field to true.
    //We would check the exit code of the CLI program ourselves 
    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                commitMessages += data.toString()
            }
        },
        silent: true, //ignoreReturnCode: true is not set because we don't expect git log to error out, so no need to do special error handling
    }

    //call the async exec funtion to call the CLI program git
    await exec(
        'git',      //the CLI program to execute
        ['log',     //args to git CLI; log tells git CLI to look for commit messages
          tag,      //this notation tells git to look for the commits between first and second tags only
        ], 
        options     //the ExecOptions object we defined earlier
    )

    //log the result of the getPreviousVersionTag() using the core.debug()
    core.debug('The commit messages from ${tag} are:\n${commitMessages}')
    
    //return the previousTag if exitCode is 0, else return null
    //triple equal to === compares both sides for type and value
    return commitMessages.trim()
}