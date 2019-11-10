# Contributing
We love pull requests from everyone :-). Please make sure you follow below mentioned points while contributing to the services.

## Get ownership of the github repo
 - Take approval of PO
 - Send an email to squad.atlas.core@monotype.com

## How to Contribute to project
In order to contribute to this project:
- Create Epic/Story/Issue for the requirement in your squad jira board.
- Discuss all the requirements with respective stakeholders and capture details under the issue created in step 1.
- Create design documents and sequence diagrams using [plantuml](http://plantuml.com/).

## What are the key points while writing the code

- Class/Construtor function name to be in upperCamelCase and methods names should be in lowerCamelCase.
- Local variables, instance variables, and class variables must also written in lowerCamelCase.
- Please Avoid names starting with _ and $.
- Constants should be written in uppercase characters separated by underscores.
- All the design documents should be uploaded in github.

## Branching Strategy
We follow GitFlow as branching strategy. Please follow below mentioned branch naming convention:

- Feature: feature/{user story Id}/{your feature name}
- Bug: bug-fix/{bug id}/{bug name}

## Test Cases
Add unit test for the bugfix or feature for which you are contributing. This will help us in reviewing the change faster.

- Unit tests should be meaningful and code coverage should be greater than or equal to 95%.
- All test cases should pass.
