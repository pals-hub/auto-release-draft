//this file defines isSemVer() to validate that the version tag complies with the definition of a semver aka semantic version
//defines removePrefix() to remove the letter v from versions in GitHub
//defined isPrerelease()
//install the semver package for typescript using npm install @types/semver

import * as semver from 'semver'

export function isSemVer(version: string): boolean {
    return semver.valid(version) !== null;
}

export function removePrefix(version: string): string {
    const parsedVersion = semver.valid(version);
    return parsedVersion ? parsedVersion:version;
}

export function isPrerelease(version: string): boolean {
    return semver.valid(version) !== null
}