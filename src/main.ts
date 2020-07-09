//main.ts is the primary entry point of the action when viewed from the source code POV, before the TypeScript file is transpiled to JavaScript by the tsc script of the npm package
//main.ts executes the run() function

//@actions is the GitHub toolkit that contains many packages. Import the core package from the @actions toolkit. 
//core allows things like reading user inputs and writing to build log. This means that logger-commands can also be written using the core package.
//unit test for this file is main.test.ts.
import * as core from '@actions/core'

//exporting to import run() in main.test.js
export async function run(): Promise<void> {
  try {
  // implementation of the run function goes here 
  //one of the outputs we defined in the actions.yml metadata for the action is release-url. We set that here.
  core.setOutput('release-url','https://someurl.com')
  } catch (error) {
    //catch any error code neq 0. Write the error message to the build log using the setFailed function of the core pakage imported from the @actions toolkit of GitHub
    core.setFailed(error.message)
  }
}

// entrypoint for the GitHub action
run()
