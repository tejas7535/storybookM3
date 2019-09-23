# Contributing to frontend@schaeffler

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How can I Contribute?](#how-can-i-contribute)
- [How to get started](#how-to-get-started)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Requesting / Proposing Features](#requesting-/-proposing-features)
- [Code Quality](#code-quality)

## Code of Conduct

Check out our [Code of Conduct](CODE_OF_CONDUCT.md)

## How can I Contribute?

We work with merge-requests exclusively and set up code owners. Use Gitlab MR-Templates when opening a Pull-Request.

[Download Visual Studio Code](https://code.visualstudio.com/)

## How to get started

Check out our [readme](readme.md)

### Required VSCode Plugins

you will be prompted to install these upon the first opening of this project in VSCode

- [TSLint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Git Flow

We decided to go with the so-called _Release Flow_ which is used and introduced by the [Microsoft VSTS Team](https://devblogs.microsoft.com/devops/release-flow-how-we-do-branching-on-the-vsts-team/). It is a trunk-based development approach:

- At the end of a sprint a release branch (naming convention: _release/name-of-sprint_) and a release tag are created and pushed to production
- Features are directly merged into the master branch by an approved merge request (naming convention: _feature/jira-id_))
- Hotfixes (naming convention: _hotfix/description_) are branched from master and merged into the current release branch as well as back into master by using cherry picks
  - Exception: hotfixes on the release branch that do not affect current master anymore are not merged backed to master
- Features can be hidden on production with feature flags

## Commit Message Guidelines

[_coming soon_](https://jira.schaeffler.com/browse/FRON-26)

## Reporting Bugs

Before creating a bug report [check](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/issues) if a similar issue already exists.

## Requesting / Proposing Features

Provide information why the proposed feature benefits multiple projects within the workspace or potenitally will do so in the future. Otherwise it might make sense to implement the feature within you project scope. We are happy to provide consultancy within our [Link to Communication Channel]()

## Code Quality

The repository contains software that affects the core business of Schaeffler. Therefor it is necessary to require a high level of code quality. Some reference to write maintainable code:

- [Clean Code Typescript](https://github.com/labs42io/clean-code-typescript)

_Information about required test coverage_
