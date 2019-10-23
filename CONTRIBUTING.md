# Contributing to frontend@schaeffler

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How can I Contribute?](#how-can-i-contribute)
- [How to get started](#how-to-get-started)
- [Git flow](#git-flow)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Requesting / Proposing Features](#requesting--proposing-features)
- [Code Quality / Code Coverage](#code-quality--code-coverage)

## Code of Conduct

Check out our [Code of Conduct](CODE_OF_CONDUCT.md)

## How can I Contribute?

We work with merge requests exclusively and set up code owners. Use Gitlab MR-Templates when opening a Merge Request.

## How to get started

Check out our [README](readme.md). If you want to know more about how the implementation of an application may look or how to work with NX within a project you are welcomed to take a look at our [kitchen sink app](apps/kitchen-sink).

### Visual Studio Code

We recommend to work with [Visual Studio Code](https://code.visualstudio.com/).  
You will be prompted to install the following extensions upon the first opening of this project in VSCode:

- [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [HTMLHint - Static Code Analyzer](https://marketplace.visualstudio.com/items?itemName=mkaufman.HTMLHint)
- [Stylelint - SCSS/CSS/Less Linter](https://marketplace.visualstudio.com/items?itemName=shinnn.stylelint)

## Git Flow

We decided to go with the so-called _Release Flow_ which is used and introduced by the [Microsoft VSTS Team](https://devblogs.microsoft.com/devops/release-flow-how-we-do-branching-on-the-vsts-team/). It is a trunk-based development approach:

- At the end of a sprint a release branch (naming convention: _release/name-of-sprint_) and a release tag are created and pushed to production
- Features are directly merged into the master branch by an approved merge request (naming convention: _feature/jira-id_))
- Hotfixes (naming convention: _hotfix/description_) are branched from master and merged into the current release branch as well as back into master by using cherry picks
  - Exception: hotfixes on the release branch that do not affect current master anymore are not merged backed to master
- Features can be hidden on production with feature flags

![Git Flow](https://devblogs.microsoft.com/devops/wp-content/uploads/sites/6/2018/04/branchstrategy-releaseflow.png)

## Commit Message Guidelines

For commit messages [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) need to be used. This ensures our automatic release process is working flawlessly. During a release convential commits are used in order to generate a changelog including all performed changes and fixes.

As a scope, please use your project name.

> Example: `feat(kitchen-sink): add ui-component scroll-to-top (JIRA-1234)`

This is where [commitlint](https://github.com/conventional-changelog/commitlint) comes in handy. It is executed before a commit is applied to verify the correct syntax has been used. If you have problems finding the right type for a commit or with the format in general do not hesitate to run

```bash
npm run cm
```

on your local machine.  
This script starts the CLI tool [commitizen](https://github.com/commitizen/cz-cli) which supports you in creating perfect commit messages by asking the right questions in your shell.

## Reporting Bugs

Before creating a bug report [check](https://jira.schaeffler.com/secure/RapidBoard.jspa?rapidView=866&projectKey=FRON&view=planning.nodetail) if a similar issue already exists.

## Requesting / Proposing Features

Provide information why the proposed feature benefits multiple projects within the workspace or potenitally will do so in the future. Otherwise it might make sense to implement the feature within you project scope. We are happy to provide consultancy within our [Teams Channel](https://teams.microsoft.com/l/team/19%3a2967d889ec6546729254b14c7f06c2b8%40thread.skype/conversations?groupId=a8039948-cbd2-4239-ba69-edbeefadeea2&tenantId=67416604-6509-4014-9859-45e709f53d3f)

## Code Quality / Code Coverage

The repository contains software that affects the core business of Schaeffler. Therefore, it is necessary to require a high level of code quality. Some reference to write maintainable code:

- [Clean Code Typescript](https://github.com/labs42io/clean-code-typescript)

In order to keep up a well formatted and consistent code all over the repository you should use following tools locally as they are also part of our CI / CD pipeline:

- stylelint
- htmlhint
- prettier
- tslint

A more detailed description about their usage can be found in our kitchen sink app's [README](apps/kitchen-sink/README.md).

Another aspect of code quality is strongly associated with code coverage. Please make sure to meet our threshold from at least **80 %** coverage for newly added or changed code.
