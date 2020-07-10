//main.ts is the primary entry point of the action when viewed from the source code POV, before the TypeScript file is transpiled to JavaScript by the tsc script of the npm package
//main.ts executes the run() function

//@actions is the GitHub toolkit that contains many packages. Import the core package from the @actions toolkit. 
//core allows things like reading user inputs and writing to build log. This means that logger-commands can also be written using the core package.
//unit test for this file is main.test.ts.
import * as core from '@actions/core'
import * as event from './event'
import * as version from './version'
import * as git from './git'
import * as github from './github'

//exporting to import run() in main.test.js
export async function run(): Promise<void> {
  try {
    
    const token = core.getInput('repo-token')                               //read the mandatory input-token and pass it to createReleaseDraft() in ./src/github
    const tag = event.getCreatedTag()                                       //retireve the tag using ./event.getCreatedTag()
    var releaseUrl = ''                                                     //variable to store the releaseUrl
    
    if (tag && version.isSemVer(tag)) {                                     //since ./version.isSemVer() returns a boolean, we must handle the null case separately
      const changelog = await git.getChangesIntroducedByTag(tag)            //get changes between this tag and previous tag
      releaseUrl = await github.createReleaseDraft(tag, token, changelog)   //createReleaseDraft for a versionTag, authentication Token and changelog
    }
    
    core.setOutput('release-url', releaseUrl)                               //one of the outputs we defined in the actions.yml metadata for the action is release-url. We set that here.
  }
  catch (error) {
   core.setFailed(error.message)                                            //catch any error code neq 0. Write the error message to the build log using the setFailed function of the core pakage imported from the @actions toolkit of GitHub
  }
}

// entrypoint for the GitHub action
run()
