<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Personal Notes

- The source code for the Pluralsight lectures is available at https://github.com/ecampidoglio/auto-release-draft

- Workflow is written in YAML. 

- A general tutorial and reference for the subset of YAML used for workflows can be found at [Common Workflow Language](https://www.commonwl.org/user_guide/)

- For a faster introduction, see [Learn YAML In 5 Minutes](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes).

    * Summarizing the YAML tutorial by `DataBytzAI`

    * Nomenclature is half the battle. Here's a snapshot depicting some parts of the YAML syntax viz. 
        * scalars
        * collections
        * multi-line collections
        * lists/dictionaries
        * multi-line formatting

      ![YAML Example Syntax](https://www.codeproject.com/KB/codegen/1214409/YamlExample1.png)

    * YAML is very strict with indentation rules. Use 2 spaces for indentation. No Tabs.

    * Comments begin by #
        ```yaml
        # this is a comment
        Field: Value    # this is another comment
        ```
    * You must have atleast 1 space character or more between colon `:` and Value.

    * YAML elements are either strict key-value pairs or key and compound-value pairs.
        * simple KV pair looks like
            ```yaml
            Field: Value
            ```

        * More examples of scalar key value pairs
            ```yaml
            someNumber: 23
            string: "YAML Ain't Markup Language"
            stringNoQuotes: YAML Ain't Markup Language doesn't need quotes but you can use them if you prefer
            field can have spaces: and so can values obviously
            field set to null: null
            another way to say null: ~
            a boolean field set to true: true
            ```

    * A value can be a sequence/array as well. This is also known as a collection. Elements of a sequence begin with 2 spaces for indentaion, and a dash followed by atleast one space character and an entry for the array value. Arrays do not have a key for each indvidual value of the array. Syntax is:
        ```yaml
        Field:
          - Array Value 1
          - Array Value 2
          - Array Value 3
        ```
    * YAML is a superset of JSON and accepts JSON sequences as well. The same collection in JSON and acceptable in YAML is
        ```yaml
        JsonField: [Array Value 1, Array Value 2, Array Value 3]
        ```

    * A value can be a bunch of KV pairs as well. This constitutes a map/dictionary.
        ```yaml
        m1:      #map
          f1: v1 #entry one, indented by 2 extra spaces
          f2: v2 #entry two
        ```

        ```yaml
        m1: {f1: v1, f2: v2}
        ```

    * An array element can be a map
        ```yaml
        Field:
          - Array Value 1 #two spaces, dash, space: total 4 characters befor Array Value 1 starts
          -               #array value is a map, described in the next two lines
              F1: V1      #Exactly two more spaces compared to Array Value 1 before F1: V1 starts
              F2: V2
          - Array Value 3
        ```

    * Shorthand for creating an array where some elements of the array are themselves compound is as follows. This is exactly equivalent to    the previous YAML snippet.
        ```yaml
        Field:
          - Array Value 1 #two spaces, dash, space: total 4 characters befor Array Value 1 starts
          - F1: V1        #same indentation as Array Value 1
            F2: V2
          - Array Value 3
        ```

    * A more complex example
        ```yaml
        Map1:
          Field1: Value1
          Field2: Value2
          Map2:
            Field3: Value3
            Field4: Value4
            Field5:             #This is an array
              - Arr1            #This array value is a  scalar
              -                 #This array value is a map. No name for the array entry if the array value is compound.
                  F1: V1
                  F2: V2
                  F3:           #This is array value is another nested array
                    - A1
                    - A2
              - Arr3
        ```

    * Optionally, you can indicate start of document using `---` and end of document using `...`

    * Multiline Key can be created by placing a question mark followed by a pipe symbol to flag the start of the key. 
        ```yaml
        ? |
          start a multiline
          key with
          many lines
        : and this is the value
        ```

    * Check your syntax for correctness at http://www.yamllint.com/ 

- Markdown and GitHub Flavoured Markdown are used for creating rich-text documents on GitHub. See the cheatsheet [here](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf).

- @actions toolkit provides many javascript packages like @actions/core, @actions/github-script etc. 

- Install dependencies as "npm install @actions/core @actions/github @types/semver @actions/exec"

- The info about a GitHub action is in a JSON object called event-payload,made available the GitHub Actions runtime and represents the event that triggered the workflow. The environment-variable $GITHUB_EVENT_PATH points to the json file that contains every information about the workflow.

- When using javascript, we can skip reading and parsing the $GITHUB_EVENT_PATH json file and instead use convinient functions in the github-script package that contains many useful scripts that can be used as APIs for GitHub. 

- @actions/github-script is not one of the dependencies of the action. See package.json. You'll see that @actions/core is listed as a dependency, but @actions/github-script is not. So let's add a reference to it using npm install --save @actions/github-script. (Edit: [July 2020] github-script is not registered in npm registry. Use the deprecated @actions/github package instead.) You can now see that package.json has two dependencies - @actions/core and @actions/github

**semantic versioning or semvar**
- To validate that the version tag is compliant with the semantic versioning standard, install semver package for typescript using npm install @types/semver.

- We would need to use CLI programs in the test machine for certain actions. For example, git describe is used to find the name of the latest version tag, and to get the list of commit messages from one version to another of the release, we would use git log. Appropriately calling CLI programs, setting the right arguments and capturing the outputs is done using the dedicated package called @actions/exec. The exec API is asynchronous.

- To actually publish the release notes draft, we would use the GitHub REST API aka octokit. In order to be able to call the GitHub REST API we need to authenticate ourselves. Easiest way to do that is by providing a repository token. 

- When you enable GitHub Actions, GitHub installs a GitHub App in your repository. This app runs the workflows. The app comes with a special token which you can use to authenticate for calling the GitHub API on behalf of the workflow. The token grants read/write access to all resources in the repo, apart from the metadata (action.yml) - here the token provides only Read access.

- The token itself is stored as a secret called secret.GITHUB_TOKEN. A GitHub action can't access the secret directly. Only the workflow can. To call GitHub API from the action, we need to pass the token from the workflow to the action. Two ways for an action to access the secret.GITHUB_TOKEN are by either reading the environment variable or by passing the secret as an input parameter. Passing as input parameter is advantageous because then we can make it a mandatory input.

- Two types of debugging for GitHub Actions are Step Debugging and Runner Diagnostics

- Step Debugging is used for debugging job failures caused by failed steps. Step debug logs increase the verbosity of a job's logs during and after a job's execution to assist with troubleshooting. Additional log events with the prefix `::debug::` will now also appear in the job's logs, these log events are provided by the Action's author and the runner process.

- Step Debugging can be performed by sprinkling the following debug logging statements in the code:

```ts
core.debug(`Your debug message and ${yourExpressionOrVariable}`)
```
- To enable Step Debugging, you would need to create and set a Secret named `ACTIONS_STEP_DEBUG` to `true` in the repository

- The second type of debugging tool for GitHub Actions are the Runner Diagnostic Logs. Runner Diagnostic Logs provide additional log files detailing how the Runner is executing an action. You need the runner diagnostic logs only if you think there is an infrastructure problem with GitHub Actions and you want the product team to check the logs. Each file with prefix `Runner_` or `Worker_` contains different logging information that corresponds to that process:
    * The Runner process coordinates setting up workers to execute jobs.
    * The Worker process executes the job.

- The Runner Diagnostic Logs are enabled by setting the secret `ACTIONS_RUNNER_DEBUG` to `true`.

- You can find the runner diagnostic logs in the folder `runner-diagnostic-logs` inside the `log archive` you can download for every executed workflow.

# DEFAULT NOTES FROM TEMPLATE

**Create a JavaScript Action using TypeScript**

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
