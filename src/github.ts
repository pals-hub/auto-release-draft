//GitHub API is a REST API and we can create and send requests like any normal http request, and can parse the response similarly
//However, for convinience, GitHub provides a Javascript API where URLs are exposed functions
//These functions are contained in the package @actions/github (deprecated); new version is @actions/github-script

import * as github      from '@actions/github'
import * as version     from './version'
import * as markdown    from './markdown'
import * as core        from '@actions/core'

export async function createReleaseDraft(
    versionTag      : string,
    repoToken       : string,
    changeLog       : string
): Promise<string> {
    //create an object of type github, passing the repoToken as a parameter to the constructer function
    const octokit = github.getOctokit(repoToken)

    //authenticated octokit provides a function unsurprisingly named createRelease
    //this function takes an object ( within a pair of {} ) with a bunch of fields
    //some fields would end up in request headers, some would be part of URL and others in the request body
    const response = await octokit.repos.createRelease({
        owner           : github.context.repo.owner,            //first two fields define the repo. repo names are of format owner/repo e.g. pals-hub/auto-release-draft
        repo            : github.context.repo.repo,             //github.context.repo provides the repo owner and repo properties
        tag_name        : versionTag,                           //release for which version?
        name            : version.removePrefix(versionTag),     //remove the v from the version tag and call this the name of the release
        body            : markdown.toUnorderedList(changeLog),  //put the actual changes for this release here; GitHub Releases allow markdown to format the content. we would transform the changeLog to an unordered list using a helper function we define in ./src/markdown.ts
        prerelease      : version.isPrerelease(versionTag),     //Release notes can mark the release as prerelease if you set the boolean to true. Do that using this helper function.
        draft           : true                                  //harcode the draft field to true. marks the output release as a draft
    })

    //the GitHub API client doesn't mask away the fact that this call to createRelease({}) is going to be an HTTP request
    //therefore, the response object has the same structure as a HTTP response
    //being that we are creating a new resource, the HTTP Status for a successful operation is '201: created'
    //so if response status is != 201, throw an error along with the actual Status code

    if (response.status !== 201) {
        throw new Error('Failed to create release draft; HTTP request status: ${response.status}')
    }

    core.info('created release draft ${response.data.name}')    //if draft is created, log this

    return response.data.html_url                               //return the URL
}
