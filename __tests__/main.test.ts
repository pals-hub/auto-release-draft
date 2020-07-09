//we want to test if the run function is calling the @actions/core.setOutput() correctly or not
//this is a unit test for just the run() function, therefore we should create a fake context in which a fake version of the @actions/core.setOutput() is created in the testbench where run() is tested in isolation
//to do that, we can use the jest comes with it's own built-in mocking library

//start by importing '@actions/core' so that we know what we want to mock
import * as core from '@actions/core'
import { run } from '../src/main'

//mock the core package
jest.mock('@actions/core')

describe('When running the action', ()=>{
  //create a fakeSetOutput function as the mocked version of the core.setOutput() from the mocked @actions/core
  //do that by casting the required function to the mocked function of t-type as follows
  const fakeSetOutput = core.setOutput as jest.MockedFunction<typeof core.setOutput>

  test('it should set the release-url output parameter', async()=>{
    await run()
    //expect to have fakeSetOutput being aclled with release-url parameter, and any other parameter (because we have hardcoded that to dummy url) 
    expect(fakeSetOutput).toHaveBeenCalledWith('release-url',expect.anything())
  })

})