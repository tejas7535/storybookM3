#!/usr/bin/env groovy
library 'shared-cluster-jenkins-library'

// Imports
import groovy.transform.Field
import java.text.SimpleDateFormat

/****************************************************************/

// Variables
def artifactoryBasePath = 'generic-local/schaeffler-frontend'

def customVersionDefault = 'No custom version (e.g. 1.0.0)'
@Field
def buildBase

@Field
def affectedApps

@Field
def affectedLibs

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
        script: "git tag --sort=taggerdate -l '${app}-v*' | tail -1",
        returnStdout: true
    ).trim()

    if (!tag) {
        println("Couldn't find a version tag for app ${app}")
        println('Using last workspace git tag instead ...')

        tag = sh (
            script: "git tag --sort=taggerdate -l 'v*' | tail -1",
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
    sh 'git config user.email adp-jenkins@schaeffler.com'
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

// returns codeowners e.g. [kauppfbi, herpisef] for helloworld-azure
def getCodeOwners(appName) {
    def codeOwnersFile = readFile(file: '.github/CODEOWNERS').trim().split('\n')

    def appString

    if (appName == 'workspace') { // search for workspace codeowners
        appString = '* '
    } else { // search for codeowners of given app
        appString = "apps/${appName} "
    }

    def codeOwners = []
    for (line in codeOwnersFile) {
        if (line.contains(appString)) {
            // example for codeOwner line -> "apps/helloworld-azure @kauppfbi @herpisef"
            def splitted = line.split(' ')
            for (int i = 0; i < splitted.size(); i++) {
                // dont push first element this would be the app name "apps/helloworld-azure" and we just want the codeowners
                if (i != 0) {
                    // currently codeowners are strings like "@userId_SGGIT" -> we want to remove the @ and the postfix SGGIT -> "userId"
                    codeOwners.push(splitted[i].replace('@', '').replace('_SGGIT', '').toLowerCase())
                }
            }
        }
    }

    return codeOwners
}

def getBuildTriggerUser() {
    def jenkinsUserId = "${currentBuild.getBuildCauses('hudson.model.Cause$UserIdCause').userId}".replace('[', '').replace(']', '').toLowerCase()

    if (jenkinsUserId.contains("schaeffler")) {
        return jenkinsUserId.split('@')[0]
    } else {
        // for non schaeffler users / external developers
        return jenkinsUserId.replace('.', '').replace('_', '').replace('-', '').replace('@', '')
    }
}

def getAgentLabel() {
    def label = '(docker && linux && extratools) || monorepo'

    if (isNightly()) {
        label = 'monorepo'
    }

    return label
}

def deployPackages(target, uploadFile, checksum) {
    withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_FRONTEND_USER', passwordVariable: 'API_KEY', usernameVariable: 'USERNAME')]) {
        sh "curl --insecure -v -H X-JFrog-Art-Api:${API_KEY} -H X-Checksum-Sha1:${checksum} -X PUT \"https://artifactory.schaeffler.com/artifactory/${target};build.number=${BUILD_NUMBER};build.name=${target}\" -T ${uploadFile}"
    }
}

// 1. Only delete files -> do not delete whole folders (e.g. dont delete the whole cdba folder)
// 2. Only delete files in the bugfix, feature, hotfix and renovate folders
// Do not delete files in the release folder and in the root (e.g. latest.zip & next.zip)
def artifactoryFileCanBeRemoved(artifactoryFile) {
    return !artifactoryFile.folder && (artifactoryFile.uri.contains('bugfix/') || artifactoryFile.uri.contains('feature/') || artifactoryFile.uri.contains('hotfix/') || artifactoryFile.uri.contains('renovate/'))
}

// remove @ because frontend deployment pipelines add docker tags with BRANCH_NAME as value and '@' is not allowed in docker tags
// example: depeendency update branch 'renovate/@nrwlnx' will get a docker tag of 'renovate-@nrwlnx' -> remove the @
def getFilteredBranchName() {
    return "${BRANCH_NAME}".replace('@', '')
}

def getNxRunnerConfig() {
    if (env.NODE_NAME == 'mono-repo-build-agent') {
        return '--runner=ci'
    } else {
        return ''
    }
}

/****************************************************************/
pipeline {
    agent {
        label getAgentLabel()
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        ansiColor('xterm')

        office365ConnectorWebhooks([[name: 'Jenkins', notifyAborted: true, notifyBackToNormal: true, notifyFailure: true, notifyNotBuilt: true, notifyRepeatedFailure: true, notifySuccess: true, notifyUnstable: true, url: 'https://worksite.webhook.office.com/webhookb2/a8039948-cbd2-4239-ba69-edbeefadeea2@67416604-6509-4014-9859-45e709f53d3f/IncomingWebhook/f20462c8f2bd4a4292cb28af1f2b08a9/4d574df3-1fa0-4252-86e6-784d5e165a8b']])
    }

    triggers {
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
        nodejs 'NodeJS 14.17'
    }

    stages {
        stage('Install') {
            steps {
                echo 'Install NPM Dependencies'

                sh 'npm ci'
            }
        }

        stage('Preparation') {
            steps {
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

                            def appCodeOwners = getCodeOwners("${env.RELEASE_SCOPE}")
                            def userWhoTriggeredBuild = getBuildTriggerUser()

                            // first check if user is the app code owner
                            if (!appCodeOwners.contains(userWhoTriggeredBuild)) {
                                // if not check if user is workspace owner
                                def workSpaceOwners = getCodeOwners('workspace')
                                if (!workSpaceOwners.contains(userWhoTriggeredBuild)) {
                                    error("Build was aborted. User ${userWhoTriggeredBuild} is not allowed to release ${env.RELEASE_SCOPE}")
                                }
                            }
                            println("User ${userWhoTriggeredBuild} passed codeowner check for ${env.RELEASE_SCOPE}")

                        } catch (org.jenkinsci.plugins.workflow.steps.FlowInterruptedException e) {
                            aborted = true
                        }

                        if (aborted) {
                            currentBuild.result = 'ABORTED'
                            skipBuild = true
                        }
                    } else if (isLibsRelease()) {
                        def userWhoTriggeredBuild = getBuildTriggerUser()
                        def workSpaceOwners = getCodeOwners('workspace')
                        if (!workSpaceOwners.contains(userWhoTriggeredBuild)) {
                            error("Build was aborted. Only workspace owners are allowed to release libs. User ${userWhoTriggeredBuild} is not allowed to release libs")
                        }
                    }
                }

                defineBuildBase()
                defineAffectedAppsAndLibs()
                setGitUser()
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
                        echo 'Run OWASP Dependency Check'
                    }
                }

                // TODO migrate for github
                stage('Renovate') {
                    when {
                        expression {
                            return false
                        }
                    }
                    steps {
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

                stage('Audit') {
                    steps {
                        echo 'Run NPM Audit'

                        script {
                            sh 'npm audit --json | npx npm-audit-html --output "./reports/npm-audit.html"'
                            sh 'npm audit --json | node ./tools/npm-scripts/transform-audit.js > ./reports/npm-audit.json'
                        }
                    }

                    post {
                        always {
                            publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: './reports', reportFiles: 'npm-audit.html', reportName: 'npm vulnerability report', reportTitles: 'vulnerability report'])
                            recordIssues(tool: issues(name: 'NPM Audit', pattern:'**/reports/npm-audit.json'))
                        }
                    }
                }

                stage('Cleanup Artifactory') {
                    steps {
                        script {
                            withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_FRONTEND_USER', passwordVariable: 'API_KEY', usernameVariable: 'USERNAME')]) {
                                def jsonString = sh (
                                    script: "curl --insecure --silent -H X-JFrog-Art-Api:${API_KEY} -X GET \"https://artifactory.schaeffler.com/artifactory/api/storage/${artifactoryBasePath}?list&deep=1&depth=10&listFolders=1&mdTimestamps=1&includeRootPath=1\"",
                                    returnStdout: true
                                )
                                def artifactoryResponse = readJSON text: jsonString

                                def dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX")
                                def currentDate = new Date()

                                for (artifactoryFile in artifactoryResponse.files) {
                                    if (artifactoryFileCanBeRemoved(artifactoryFile)) {
                                        def lastModifiedDate = dateFormat.parse(artifactoryFile.lastModified)
                                        def daysBetween = currentDate - lastModifiedDate
                                        if (daysBetween > 60) {
                                            echo "${artifactoryFile}"
                                            echo 'IS GOING TO GET DELETED'
                                            sh "curl --insecure --silent -H X-JFrog-Art-Api:${API_KEY} -X DELETE \"https://artifactory.schaeffler.com/artifactory/${artifactoryBasePath}${artifactoryFile.uri}\""
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Cleanup Nx-Cache') {
                    steps {
                        script {
                            // get disk space used
                            def diskUsagePercentString = sh (
                                script: """df -h --output=pcent /dev/sdb1  | awk 'NR>1 {print \$1 | "sort -r -k3 -n"}' | awk '{print substr(\$1, 1, length(\$1)-1)}'""",
                                returnStdout: true
                            )

                            // delete nx-cache only when disk usage is over 80%
                            if (diskUsagePercentString.toInteger() > 80) {
                                sh "rm -rf /home/adp-jenkins/temp/nx-cache"
                                sh "mkdir /home/adp-jenkins/temp/nx-cache"
                            }
                        }
                    }
                }
            }
        }

        stage('Quality') {
            when {
                expression {
                    return !skipBuild && !isNightly() && !isLibsRelease() && !isAppRelease()
                }
            }
            failFast true
            parallel {
                stage('Format:Check') {
                    steps {
                        echo 'Run Format Check with prettier'

                        script {
                            sh "npm run format:check -- --base=${buildBase}"
                        }
                    }
                }

                stage('Lint:TS') {
                    steps {
                        echo 'Run TS Lint'

                        script {
                            sh "npm run affected:lint -- --base=${buildBase} --parallel --configuration=ci ${getNxRunnerConfig()}"
                        }
                    }
                    post {
                        always {
                            recordIssues(tools: [checkStyle(pattern: 'checkstyle/**/checkstyle.xml')])
                        }
                    }
                }

                stage('Lint:HTML') {
                    steps {
                        echo 'Run HTML Lint'

                        // no checkstyle output
                        script { 
                            sh 'npm run lint:html'
                        }
                    }
                }

                stage('Lint:SCSS') {
                    steps {
                        echo 'Run SCSS Lint'

                        // no checkstyle output
                        script {
                            sh 'npm run lint:scss'
                        }
                    }
                }

                stage('Test:Unit') {
                    steps {
                        echo 'Run Unit Tests'

                        script {
                            sh "npm run affected:test -- --base=${buildBase} --parallel --max-parallel=2 ${getNxRunnerConfig()}"
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
                    when {
                        expression {
                            return false
                        }
                    }
                    steps {
                        // quantity 1 means that only one pipeline can execute cypress tests on an agent, other pipelines have to wait until the lock is released
                        lock(resource: "lock-cypress-${env.NODE_NAME}", quantity: 1) {
                            echo 'Run E2E Tests'

                            script {
                                sh "npm run affected:e2e:headless -- --base=${buildBase} ${getNxRunnerConfig()}"
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
        }

        stage('Pre-Release') {
            when {
                expression {
                    return !skipBuild && (isAppRelease() || isLibsRelease())
                }
            }
            steps {
                echo 'Preparing Release'

                script {
                    def targetBranch = 'master'

                    // Generate Changelog, update Readme
                    executeAsGithubUser('github-jenkins-access-token','git fetch --all')
                    sh "git checkout ${targetBranch}"

                    // generate project specific changelog
                    if (isAppRelease()) {
                        def exists = fileExists "apps/${env.RELEASE_SCOPE}/CHANGELOG.md"
                        def standardVersionCommand = "npx nx run ${env.RELEASE_SCOPE}:standard-version"

                        if (!exists) {
                            //first version
                            standardVersionCommand += " --params='--first-release'"
                        } else if (params.CUSTOM_VERSION != "${customVersionDefault}") {
                            standardVersionCommand += " --params='--release-as ${params.CUSTOM_VERSION}'"
                        }

                        sh standardVersionCommand
                    } else if (isLibsRelease()) {
                        sh "npx nx run-many --target=standard-version --projects=${affectedLibs.join(',')}"
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
                        echo 'Build Projects'

                        script {
                            lock(resource: "lock-build-${env.NODE_NAME}", quantity: 2) {
                                if (isAppRelease()) {
                                    sh "npx nx build ${env.RELEASE_SCOPE} --configuration=production"
                                    try {
                                        sh "npm run transloco:optimize -- dist/apps/${env.RELEASE_SCOPE}/assets/i18n"
                                    } catch (error) {
                                        echo "No translations found to optimize in app ${env.RELEASE_SCOPE}"
                                    }
                                } else if (isLibsRelease()) {
                                    sh "npx nx run-many --target=build --projects=${affectedLibs.join(',')} --prod"
                                } else {
                                    if (isMaster()) {
                                        sh "npx nx affected --base=${buildBase} --target=build --configuration=qa ${getNxRunnerConfig()} --parallel"
                                    } else {
                                        sh "npx nx affected --base=${buildBase} --target=build --configuration=dev ${getNxRunnerConfig()} --parallel"
                                    }

                                    for (app in affectedApps) {
                                        sh "npx webpack-bundle-analyzer dist/apps/${app}/stats.json --mode static --report dist/webpack/${app}-bundle-report.html --no-open || true"
                                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'dist/webpack', reportFiles: "${app}-bundle-report.html", reportName: "${app} bundle-report", reportTitles: "${app} bundle-report"])
                                    }
                                }
                            }
                        }
                    }
                }

                stage('Build:Storybook') {
                    when {
                        expression {
                            return false
                        }
                    }
                    steps {
                        echo 'Build Storybooks for Shared Libraries'

                        script {
                            sh "npx nx affected --base=${buildBase} --target=build-storybook ${getNxRunnerConfig()}"

                            publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'dist/storybook/shared-ui-storybook', reportFiles: 'index.html', reportName: 'Storybook Components', reportTitles: ''])
                        }
                    }
                }
            }
        }

        stage('Deliver') {
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            failFast true
            parallel {
                stage('Deliver:Apps') {
                    when {
                        expression {
                            return !isLibsRelease()
                        }
                    }
                    steps {
                        echo 'Deliver Apps to Artifactory'

                        script {
                            sh 'mkdir -p dist/zips'
                            def appsToDeploy = isAppRelease() ? [env.RELEASE_SCOPE] : affectedApps

                            // loop over apps and publish them
                            for (app in appsToDeploy) {
                                echo "publish ${app} to Artifactory"

                                zip dir: "dist/apps/${app}",  glob: '', zipFile: "dist/zips/${app}/next.zip"
                                uploadFile = "dist/zips/${app}/next.zip"
                                checksum = sh (
                                    script: "sha1sum ${uploadFile} | awk '{ print \$1 }'",
                                    returnStdout: true
                                ).trim()

                                if (isAppRelease()) {
                                    def version = getPackageVersion()
                                    target1 = "${artifactoryBasePath}/${app}/latest.zip"

                                    deployPackages(target1, uploadFile, checksum)

                                    target2 = "${artifactoryBasePath}/${app}/release/${version}.zip"

                                    deployPackages(target2, uploadFile, checksum)
                                } else if (isMaster()) {
                                    target = "${artifactoryBasePath}/${app}/next.zip"

                                    deployPackages(target, uploadFile, checksum)
                                } else if (!isNightly()) {
                                    def fileName = getFilteredBranchName()
                                    target = "${artifactoryBasePath}/${app}/${fileName}.zip"

                                    deployPackages(target, uploadFile, checksum)
                                }
                            }
                        }
                    }
                }

                stage('Deliver:Packages') {
                    when {
                        expression {
                            return isLibsRelease()
                        }
                    }
                    steps {
                        echo 'Deliver Libraries as npm packages to Artifactory'

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

            post {
                success {
                    script {
                        def version = getPackageVersion()
                        currentBuild.description = "Version: ${version}"
                    }
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
                echo 'Release new version'

                script {
                    executeAsGithubUser('github-jenkins-access-token','git push --follow-tags')
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
                script {
                    def deployments = readJSON file: 'deployments.json'
                    def appsToBuild = isAppRelease() ? [env.RELEASE_SCOPE] : affectedApps

                    for (app in appsToBuild) {
                        def url = deployments[app]

                        def version = getPackageVersion()
                        def configuration = isAppRelease() ? 'PROD' : (isMaster() ? 'QA' : 'DEV')

                        // prod/release = latest, master = next, feature build = branch name
                        def fileName = isAppRelease() ? 'latest' : isMaster() ? 'next' : getFilteredBranchName()
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

    post {
        always {
            script {
                sh 'chmod -R 777 .' // set rights so that the cleanup job can do its work
                cleanWs(disableDeferredWipeout: true)
            }
        }
    }
}
