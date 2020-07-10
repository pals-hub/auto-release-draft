//this file defines getCreatedTag() to get the type of tag when a new event is created.
//@actions/github.context.eventName is a readonly variable that tells the type of event. If the eventName != 'create', return tag type as null.
//For debug purposes, write the eventName to the log using @actions/core.info() function.
//If the 'create' event was triggered for a 'tag', we need to return the name of the tag.
//WebhookPayload type exports properties for fields that are always part of the payload, regardless of which event it is.
//However, being this a JSON object, we can reference any event-specifc fields using the dot notation. 
//In this case, we are referencing ref_type which contains the kind of reference that was created (we want it to be 'tag')

import * as github from '@actions/github'
import * as core from '@actions/core'

export function getCreatedTag(): string | null {
    //if triggered eventName is not 'create', record the event name in the log and return null
    if (github.context.eventName !== 'create'){
        core.info(`The @actions/github.context.eventName was ${github.context.eventName}`)
        return null
    }

    //if the triggered eventName is 'create', then check the ref_type to see if it is 'tag'
    if (github.context.payload.ref_type !== 'tag'){
        core.info('The created reference @ctions/github.context.payload.ref_type was a branch, not a tag')
        return null
    }

    //return the name of the tag
    return github.context.payload.ref
}