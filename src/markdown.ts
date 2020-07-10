export function toUnorderedList(multiLineInput: string): string {
    //credit: https://github.com/ecampidoglio/auto-release-draft/blob/master/src/markdown.ts
    //the function converts a multiline text input to an unordered list in markdown
    return multiLineInput
        .split('\n')                                //split the line wise along every newline character
        .map(line => (line ? '- ${line}' : ''))     //map every non empty line to the same line preceded by "- "
        .join('\n')                                 //join the mapped lines
}