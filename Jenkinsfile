#!/usr/bin/env groovy

// Imports
import groovy.transform.Field

/****************************************************************/

// Variables
def rtServer = Artifactory.server('artifactory.schaeffler.com')

def builds
def featureBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def bugfixBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def masterBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def nightlyBuilds = ['Preparation', 'Install', 'Nightly', 'OWASP', 'Renovate', 'Audit']

def artifactoryBasePath = 'generic-local/schaeffler-frontend'

def customVersionDefault = 'No custom version (e.g. 1.0.0)'
@Field
def buildBase

@Field
def affectedApps

@Field
def affectedLibs

@Field
def excludedProjects = []

@Field
def excludedAppsAndLibsPaths = []

@Field
def skipBuild = false

/****************************************************************/

// Functions
def isBugfix() {
    return "${BRANCH_NAME}".startsWith('bugfix/')
}

def isMaster() {
    return "${BRANCH_NAME}" == 'master'
}

def isAppRelease() {
    return params.APP_RELEASE && "${BRANCH_NAME}" == 'master'
}

def isLibsRelease() {
    return params.LIBS_RELEASE && "${BRANCH_NAME}" == 'master'
}

def isNightly() {
    def buildCauses = "${currentBuild.buildCauses}"
    boolean isStartedByTimer = false
    if (buildCauses != null && buildCauses.contains('Started by timer')) {
        isStartedByTimer = true
    }

    return isStartedByTimer && isMaster()
}

def defineBuildBase() {
    if (isAppRelease() || isLibsRelease()) {
        latestTag = getLatestGitTag("${env.RELEASE_SCOPE}")

        buildBase = sh (
            script: "git rev-list -n 1 ${latestTag}",
            returnStdout: true
        ).trim()
    } else {
        buildBase = sh (
            script: 'git merge-base origin/master HEAD^',
            returnStdout: true
        ).trim()
    }

    println("The build base for the 'nx affected' scripts is commit ${buildBase}")
}

def getLatestGitTag(app) {
    def tag

    tag = sh (
        script: "git tag --sort=committerdate -l '${app}-v*' | tail -1",
        returnStdout: true
    ).trim()

    if (!tag) {
        println("Couldn't find a version tag for app ${app}")
        println('Using last workspace git tag instead ...')

        tag = sh (
            script: "git tag --sort=committerdate -l 'v*' | tail -1",
            returnStdout: true
        ).trim()
    }

    println("Using git tag ${tag} for defining the nx build base.")

    return tag
}

def mapAffectedStringToArray(String input) {
    input = input.trim()

    return input == '' ? [] : input.split(' ')
}

def defineAffectedAppsAndLibs() {
    apps = sh (
        script: "npm run --silent affected:apps -- --base=${buildBase} --plain",
        returnStdout: true
    )

    libs = sh (
        script: "npm run --silent affected:libs -- --base=${buildBase} --plain",
        returnStdout: true
    )

    affectedApps = mapAffectedStringToArray(apps)
    affectedLibs = mapAffectedStringToArray(libs)
    affectedLibs -= 'shared-ui-storybook'

    if (isAppRelease()) {
        // save all affected apps that should not be released
        def affectedE2EApps = []
        for (app in affectedApps) {
            affectedE2EApps.add(app + '-e2e')
        }

        affectedProjects = affectedApps.clone() + affectedE2EApps + affectedLibs.clone()

        excludedProjects = affectedProjects
        excludedProjects -= env.RELEASE_SCOPE
    } else if (isLibsRelease()) {
        excludedProjects = affectedApps.clone()
    }
}

def ciSkip() {
    ciSkip = sh([script: "git log -1 | grep '.*\\[ci skip\\].*'", returnStatus: true])

    if (ciSkip == 0 && isMaster()) {
        currentBuild.description = 'CI SKIP'
        currentBuild.result = 'SUCCESS'
        skipBuild = true
    }
}

def setGitUser() {
    // Set Config for Sir Henry
    sh 'git config user.email a1173595@schaeffler.com'
    sh 'git config user.name "Sir Henry"'
}

def getPackageVersion() {
    def packageJSON

    if (isAppRelease()) {
        packageJSON = readJSON file: "apps/${env.RELEASE_SCOPE}/package.json"
    } else {
        packageJSON = readJSON file: 'package.json'
    }

    return packageJSON.version
}

def setExcludedAppsAndLibsPaths() {
    excludedAppsAndLibsPaths = []

    for (project in excludedProjects) {
        excludedAppsAndLibsPaths.add('**/' + project + '/**')
    }
}

// define builds (stages), which are reported back to GitLab
builds = featureBuilds

if (isMaster()) {
    builds = masterBuilds

    if (isNightly()) {
        builds = nightlyBuilds
    } else if (params.APP_RELEASE || params.LIBS_RELEASE) {
        builds.add('Pre-Release')
        builds.add('Release')
    }
} else if (isBugfix()) {
    builds = bugfixBuilds
}

/****************************************************************/
pipeline {
    agent {
        label 'linux && docker && extratools'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS')
        gitLabConnection('GitLab HZA')
        gitlabBuilds(builds: builds)
        timestamps()
        ansiColor('xterm')

        office365ConnectorWebhooks([[name: 'Jenkins', notifyAborted: true, notifyBackToNormal: true, notifyFailure: true, notifyNotBuilt: true, notifyRepeatedFailure: true, notifySuccess: true, notifyUnstable: true, url: 'https://outlook.office.com/webhook/a8039948-cbd2-4239-ba69-edbeefadeea2@67416604-6509-4014-9859-45e709f53d3f/IncomingWebhook/f20462c8f2bd4a4292cb28af1f2b08a9/4d574df3-1fa0-4252-86e6-784d5e165a8b']])
    }

    triggers {
        gitlab(
            triggerOnPush: true
        )
        cron(isMaster() ? '@midnight' : '')
    }

    parameters {
        booleanParam(
            name: 'APP_RELEASE',
            defaultValue: false,
            description: 'Set "true" to trigger a production release for an app.')
        booleanParam(
            name: 'LIBS_RELEASE',
            defaultValue: false,
            description: 'Set "true" to trigger a production release for all libs.')
        string(
            name: 'CUSTOM_VERSION',
            defaultValue: "${customVersionDefault}",
            description: 'Set custom version for app release'
        )
    }

    tools {
        nodejs 'NodeJS 14.15'
    }

    stages {
        stage('Install') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo 'Install NPM Dependencies'

                    sh 'npm ci'
                }
            }
        }

        stage('Preparation') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo 'Preparation of some variables'

                    ciSkip()

                    script {
                        if (params.APP_RELEASE && params.LIBS_RELEASE) {
                            // simultanous releases of apps and libs should not be possible
                            currentBuild.result = 'ABORTED'
                            error('Build failed because APP_RELEASE and LIBS_RELEASE have both been checked -> not allowed')
                        }

                        if (isAppRelease()) {
                            def aborted = false
                            def deployments = readJSON file: 'deployments.json'
                            def apps = deployments.keySet()

                            try {
                                timeout(time: 5, unit: 'MINUTES') {
                                    env.RELEASE_SCOPE = input message: 'User input required', ok: 'Release!',
                                        parameters: [choice(name: 'RELEASE_SCOPE', choices: apps.join('\n'), description: 'What is the release scope?')]
                                }
                            } catch (org.jenkinsci.plugins.workflow.steps.FlowInterruptedException e) {
                                aborted = true
                            }

                            if (aborted) {
                                currentBuild.result = 'ABORTED'
                                skipBuild = true
                            }
                        }
                    }

                    defineBuildBase()
                    defineAffectedAppsAndLibs()
                    setExcludedAppsAndLibsPaths()
                    setGitUser()
                }
            }
        }

        stage('Nightly') {
            when {
                expression {
                    isNightly()
                }
            }
            failFast true
            parallel {
                stage('OWASP') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run OWASP Dependency Check'
                        }
                    }
                }

                stage('Renovate') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run Renovate for dependency updates'

                            script {
                                withCredentials([string(credentialsId: 'GITLAB_API_TOKEN', variable: 'ACCESS_TOKEN')]) {
                                    withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_COM_TOKEN')]) {
                                        sh "npx renovate --token=${ACCESS_TOKEN} --platform=gitlab --endpoint=https://gitlab.schaeffler.com/api/v4 frontend-schaeffler/schaeffler-frontend"
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Audit') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run NPM Audit'

                            script {
                                try {
                                    sh 'npm audit'
                                } catch (error) {
                                    // Get jq binary --> temporary workaround until we have an image with jq preinstalled
                                    sh 'mkdir ~/jq-bin'
                                    sh 'curl -L https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 --output ~/jq-bin/jq'
                                    sh 'chmod +x ~/jq-bin/jq'
                                    env.PATH = "${PATH}:/home/jnkp1usr/jq-bin"

                                    sshagent(['GITLAB_USER_SSH_KEY']) {
                                        // check if there is already a hotfix/security-patch branch
                                        // wc (word count) returns the number of words of an input. The -l flag lets it return the number of lines.
                                        branchExists = sh (
                                            script: "git ls-remote --heads ${GIT_URL} hotfix/security-patch | wc -l",
                                            returnStdout: true
                                        )

                                        if (branchExists.toInteger() > 0) {
                                            sh 'git push origin --delete hotfix/security-patch'
                                        }

                                        // create hotfix branch
                                        sh 'git checkout -b hotfix/security-patch'

                                        // try to fix vulnerabilities
                                        sh 'npm audit fix'

                                        // check if something was auto fixed and commit
                                        changesDone = sh (
                                            script: "git status --porcelain --untracked-files='no' | wc -l",
                                            returnStdout: true
                                        )
                                        if (changesDone.toInteger() > 0) {
                                            sh 'git add -u'
                                            sh "git commit -m 'chore(deps): fix security vulnerabilities'"
                                        }

                                        // find vulnerabilities which could not be auto fixed
                                        openFixesStr = sh (
                                            script: "npm audit --json | jq '.advisories' | jq '.[].findings' | jq '.[].paths' | jq '.[]'",
                                            returnStdout: true
                                        )
                                        def description
                                        if (openFixesStr) {
                                            openFixes = "${openFixesStr}".replaceAll('"\n', '\n').replaceAll('"', '* ').replaceAll('>', ' -- ')

                                            for (line in openFixes.split('\n')) {
                                                sh "sed -i '/@@FIXES@@/i ${line}' ./gitlab-templates/security-patch-description-template.md"
                                            }

                                            sh 'sed -i s#@@FIXES@@##g ./gitlab-templates/security-patch-description-template.md'
                                            description = sh (
                                                script: 'cat ./gitlab-templates/security-patch-description-template.md',
                                                returnStdout: true
                                            )
                                            description = "${description}".replaceAll('\n', '<br>')
                                        } else {
                                            description = 'You had vulnerabilities in your project. It was a pleasure to fix them. For more information, see <a href="${JOB_URL}NPM_20Vulnerabilities/">NPM Audit Report</a>'
                                        }

                                        // create merge request
                                        sh """
                                            git push -u origin hotfix/security-patch \
                                            -o merge_request.create \
                                            -o merge_request.target=master \
                                            -o merge_request.title='WIP: chore(deps): fix security vulnerabilities' \
                                            -o merge_request.description="${description}" \
                                            -o merge_request.label='hotfix' \
                                            -o merge_request.remove_source_branch=true""".stripIndent()
                                    }
                                } finally {
                                    sh 'npm audit --json | npx npm-audit-html'
                                }
                            }
                        }
                    }

                    post {
                        always {
                            publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, includes: 'npm-audit.html', keepAll: true, reportDir: '', reportFiles: 'npm-audit.html', reportName: 'npm vulnerability report', reportTitles: 'vulnerability report'])
                        }
                    }
                }
            }

            post {
                success {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
                }

                failure {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'failed'
                }
            }
        }

        stage('Quality') {
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            failFast true
            parallel {
                stage('Format:Check') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run Format Check with prettier'

                            script {
                                if (isAppRelease() || isLibsRelease()) {
                                    sh "npm run format:check -- --base=${buildBase} --exclude=${excludedProjects.join(',')}"
                                } else {
                                    sh "npm run format:check -- --base=${buildBase}"
                                }
                            }
                        }
                    }
                }

                stage('Lint:TSLint') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run TSLint'

                            script {
                                if (isAppRelease() || isLibsRelease()) {
                                    sh "npm run affected:lint -- --base=${buildBase} --exclude=${excludedProjects.join(',')}"
                                } else {
                                    sh "npm run affected:lint -- --base=${buildBase} --parallel"
                                }
                            }
                        }
                    }
                }

                stage('Lint:HTML') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run HTML Lint'

                            // no checkstyle output
                            script {
                                if (isAppRelease() || isLibsRelease()) {
                                    sh "npm run lint:html-apps -- --ignore ${excludedAppsAndLibsPaths.join(',')}"
                                    sh "npm run lint:html-libs -- --ignore ${excludedAppsAndLibsPaths.join(',')}"
                                } else {
                                    sh 'npm run lint:html'
                                }
                            }
                        }
                    }
                }

                stage('Lint:SCSS') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run SCSS Lint'

                            // no checkstyle output
                            script {
                                if (isAppRelease() || isLibsRelease()) {
                                    def ignorePattern = '"-- '
                                    for (project in excludedAppsAndLibsPaths) {
                                        ignorePattern += "--ip '${project}' "
                                    }
                                    ignorePattern +='"'

                                    sh "npm run lint:scss-apps ${ignorePattern}"
                                    sh "npm run lint:scss-libs ${ignorePattern}"
                                } else {
                                    sh 'npm run lint:scss'
                                }
                            }
                        }
                    }
                }

                stage('Test:Unit') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run Unit Tests'

                            script {
                                if (isAppRelease() || isLibsRelease()) {
                                    sh "npm run affected:test -- --base=${buildBase} --exclude=${excludedProjects.join(',')}"
                                } else {
                                    sh "npm run affected:test -- --base=${buildBase} --parallel"
                                }
                            }
                        }
                    }
                    post {
                        success {
                            // Unit tests results
                            publishCoverage adapters: [coberturaAdapter(mergeToOneReport: true, path: 'coverage/**/*cobertura-coverage.xml')], sourceFileResolver: sourceFiles('NEVER_STORE')
                            junit allowEmptyResults: true, testResults: 'coverage/junit/test-*.xml'
                        }
                    }
                }

                stage('Test:E2E') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Run E2E Tests'

                            script {
                                if (isAppRelease() || isLibsRelease()) {
                                    sh "npm run affected:e2e:headless -- --base=${buildBase} --exclude=${excludedProjects.join(',')}"
                                } else {
                                    sh "npm run affected:e2e:headless -- --base=${buildBase}"
                                }
                            }
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'dist/cypress/apps/**/junit/cypress-report.xml'
                            archiveArtifacts artifacts: 'dist/cypress/apps/**/videos/**/*.mp4', onlyIfSuccessful: false, allowEmptyArchive: true
                        }
                        failure {
                            archiveArtifacts artifacts: 'dist/cypress/apps/**/screenshots/**/*.png', onlyIfSuccessful: false
                        }
                    }
                }
            }

            post {
                success {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
                }

                failure {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'failed'
                }
            }
        }

        stage('Pre-Release') {
            when {
                expression {
                    return !skipBuild && (isAppRelease() || isLibsRelease())
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo 'Preparing Release'

                    sshagent(['GITLAB_USER_SSH_KEY']) {
                        script {
                            def targetBranch = 'master'

                            // Generate Changelog, update Readme
                            sh 'git fetch --all'
                            sh "git checkout ${targetBranch}"

                            // generate project specific changelog
                            if (isAppRelease()) {
                                def exists = fileExists "apps/${env.RELEASE_SCOPE}/CHANGELOG.md"
                                def standardVersionCommand = "npx nx run ${env.RELEASE_SCOPE}:standard-version";
                                
                                if (!exists) {
                                    //first version
                                    standardVersionCommand += " --params='--first-release"
                                } else if(params.CUSTOM_VERSION != "${customVersionDefault}"){
                                    standardVersionCommand += " --params='--release-as ${params.CUSTOM_VERSION}'"
                                }

                                sh standardVersionCommand

                            } else if (isLibsRelease()) {
                                sh "npx nx affected --base=${buildBase} --target=standard-version --exclude=${excludedProjects.join(',')}"
                            }

                            sh 'npm run release' // only bump the workspace version
                            sh 'npm run generate-readme'

                            // generate root changelog
                            if (isAppRelease()) {
                                sh "npm run generate-changelog -- --app ${env.RELEASE_SCOPE}"
                            } else if (isLibsRelease()) {
                                sh 'npm run generate-changelog -- --libs'
                            }

                            sh 'git add .'
                            sh 'git commit -m "chore(docs): update docs [ci skip]"'

                            if (isLibsRelease()) {
                                // add new Workspace Release Tag
                                def version = getPackageVersion()

                                sh "git tag -a ${version} -m 'Release of Version ${version}'"
                            }
                        }
                    }
                }
            }
        }

        stage('Build') {
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            failFast true
            parallel {
                stage('Build:Projects') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Build Projects'

                            script {
                                if (isAppRelease()) {
                                    sh "npx nx run ${env.RELEASE_SCOPE}:build:prod --with-deps"
                                    try {
                                        sh "npm run transloco:optimize -- dist/apps/${env.RELEASE_SCOPE}/assets/i18n"
                                    } catch (error) {
                                        echo "No translations found to optimize in app ${env.RELEASE_SCOPE}"
                                    }
                                } else if (isLibsRelease()) {
                                    sh "npx nx run-many --target=build --projects=${affectedLibs.join(',')} --with-deps"
                                }
                                else {
                                    if (isMaster()) {
                                        sh "npx nx affected --base=${buildBase} --target=build --with-deps --configuration=qa --parallel"
                                    } else {
                                        sh "npx nx affected --base=${buildBase} --target=build --with-deps --configuration=dev --parallel"
                                    }

                                    for (app in affectedApps) {
                                        sh "npx webpack-bundle-analyzer dist/apps/${app}/stats.json --mode static --report dist/webpack/${app}-bundle-report.html --no-open"
                                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'dist/webpack', reportFiles: "${app}-bundle-report.html", reportName: "${app} bundle-report", reportTitles: "${app} bundle-report"])
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Build:Storybook') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Build Storybooks for Shared Libraries'

                            script {
                                sh "npx nx affected --base=${buildBase} --target=build-storybook"

                                publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'dist/storybook/shared-ui-storybook', reportFiles: 'index.html', reportName: 'Storybook Components', reportTitles: ''])
                                publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'dist/storybook/shared-empty-states', reportFiles: 'index.html', reportName: 'Storybook Empty States', reportTitles: ''])
                            }
                        }
                    }
                }
            }

            post {
                success {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'success'
                }

                failure {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'failed'
                }
            }
        }

        stage('Deploy') {
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            failFast true
            parallel {
                stage('Deploy:Apps') {
                    when {
                        expression {
                            return !isLibsRelease()
                        }
                    }
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Deploy Apps to Artifactory'

                            script {
                                sh 'mkdir -p dist/zips'
                                def uploadSpec
                                def appsToDeploy = isAppRelease() ? [env.RELEASE_SCOPE] : affectedApps

                                // loop over apps and publish them
                                for (app in appsToDeploy) {
                                    echo "publish ${app} to Artifactory"

                                    zip dir: "dist/apps/${app}",  glob: '', zipFile: "dist/zips/${app}/next.zip"

                                    if (isAppRelease()) {
                                        def version = getPackageVersion()
                                        uploadSpec = """{
                                            "files": [
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/latest.zip"
                                                },
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/release/${version}.zip"
                                                }
                                            ]
                                        }"""
                                    } else if (isMaster()) {
                                        uploadSpec = """{
                                            "files": [
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/next.zip"
                                                }
                                            ]
                                        }"""
                                    } else {
                                        uploadSpec = """{
                                            "files": [
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/${BRANCH_NAME}.zip"
                                                }
                                            ]
                                        }"""
                                    }

                                    def buildInfo = rtServer.upload(uploadSpec)
                                    buildInfo.retention maxDays: 60, deleteBuildArtifacts: true
                                    rtServer.publishBuildInfo(buildInfo)
                                }
                            }
                        }
                    }
                }

                stage('Deploy:Packages') {
                    when {
                        expression {
                            return isLibsRelease()
                        }
                    }
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Deploy Libraries as npm packages to Artifactory'

                            script {
                                withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_USER', passwordVariable: 'API_KEY', usernameVariable: 'USERNAME')]) {
                                    sh "echo 'email=${USERNAME}' > ~/.npmrc"
                                    sh "echo '//artifactory.schaeffler.com/artifactory/api/npm/npm/:_authToken=${API_KEY}' > ~/.npmrc"

                                    sh "npx nx affected --base=${buildBase} --target=publish"
                                }
                            }
                        }
                    }
                }

                stage('Deploy:Docs') {
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo 'Deploy Static Content for Documentation'
                        }
                    }
                }
            }

            post {
                success {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'success'

                    script {
                        def version = getPackageVersion()
                        currentBuild.description = "Version: ${version}"
                    }
                }

                failure {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'failed'
                }
            }
        }

        stage('Release') {
            when {
                expression {
                    return !skipBuild && (isAppRelease() || isLibsRelease())
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo 'Release new version'

                    sshagent(['GITLAB_USER_SSH_KEY']) {
                        script {
                            sh 'git push --follow-tags'
                        }
                    }
                }
            }
        }

        stage('Trigger Deployments') {
            when {
                expression {
                    return !skipBuild && !isNightly() && !isLibsRelease()
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    script {
                        def deployments = readJSON file: 'deployments.json'
                        def appsToBuild = isAppRelease() ? [env.RELEASE_SCOPE] : affectedApps

                        for (app in appsToBuild) {
                            def url = deployments[app]

                            def version = getPackageVersion()
                            def configuration = isAppRelease() ? 'PROD' : (isMaster() ? 'QA' : 'DEV')

                            // prod/release = latest, master = next, feature build = branch name
                            def fileName = isAppRelease() ? 'latest' : isMaster() ? 'next' : "${BRANCH_NAME}"
                            def artifactoryTargetPath = "${artifactoryBasePath}/${app}/${fileName}.zip"

                            try {
                                build job: "${url}",
                                    parameters: [
                                            string(name: 'VERSION', value: "${version}"),
                                            string(name: 'CONFIGURATION', value: "${configuration}"),
                                            string(name: 'ARTIFACTORY_TARGET_PATH', value: "${artifactoryTargetPath}")
                                    ], wait: false
                            } catch (error) {
                                println("WARNING: Some error occured while triggering deployment for ${app}, see stacktrace below:")
                                println(error)
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (skipBuild) {
                    masterBuilds.each {
                        build -> updateGitlabCommitStatus name: build, state: 'success'
                    }
                }
                sh 'chmod -R 777 .' // set rights so that the cleanup job can do its work
                cleanWs(disableDeferredWipeout: true)
            }
        }
    }
}
