<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Personal Notes

- The source code for the Pluralsight lectures is available at https://github.com/ecampidoglio/auto-release-draft

- @actions toolkit provides many javascript packages like @actions/core, @actions/github-script etc. Install @actions/github-script using npm:

- The info about a GitHub action is in a JSON object called event-payload,made available the GitHub Actions runtime and represents the event that triggered the workflow. The environment-variable $GITHUB_EVENT_PATH points to the json file that contains every information about the workflow.

- When using javascript, we can skip reading and parsing the $GITHUB_EVENT_PATH json file and instead use convinient functions in the github-script package that contains many useful scripts that can be used as APIs for GitHub. 

- @actions/github-script is not one of the dependencies of the action. See package.json. You'll see that @actions/core is listed as a dependency, but @actions/github-script is not. So let's add a reference to it using npm install --save @actions/github-script. (Edit: [July 2020] github-script is not registered in npm registry. Use the deprecated @actions/github package instead.) You can now see that package.json has two dependencies - @actions/core and @actions/github

**semantic versioning or semvar**
- To validate that the version tag is compliant with the semantic versioning standard, install semver package for typescript using npm install @types/semver.

- We would need to use CLI programs in the test machine for certain actions. For example, git describe is used to find the name of the latest version tag, and to get the list of commit messages from one version to another of the release, we would use git log. Appropriately calling CLI programs, setting the right arguments and capturing the outputs is done using the dedicated package called @actions/exec. The exec API is asynchronous.

- To actually publish the release notes draft, we would use the GitHub REST API aka octokit. In order to be able to call the GitHub REST API we need to authenticate ourselves. Easiest way to do that is by providing a repository token. 

- When you enable GitHub Actions, GitHub installs a GitHub App in your repository. This app runs the workflows. The app comes with a special token which you can use to authenticate for calling the GitHub API on behalf of the workflow. The token grants read/write access to all resources in the repo, apart from the metadata (action.yml) - here the token provides only Read access.

- The token itself is stored as a secret called secret.GITHUB_TOKEN. A GitHub action can't access the secret directly. Only the workflow can. To call GitHub API from the action, we need to pass the token from the workflow to the action. Two ways for an action to access the secret.GITHUB_TOKEN are by either reading the environment variable or by passing the secret as an input parameter. Passing as input parameter is advantageous because then we can make it a mandatory input.

**default notes from the template**

# Create a JavaScript Action using TypeScript

Use this template to bootstrap the creation of a JavaScript action.:rocket:

This template includes compilication support, tests, a validation workflow, publishing, and versioning guidance.  

If you are new, there's also a simpler introduction.  See the [Hello World JavaScript Action](https://github.com/actions/hello-world-javascript-action)

## Create an action from this template

Click the `Use this Template` and provide the new repo details for your action

## Code in Master

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run pack
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ npm run pack
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml)])

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/javascript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
