#!/usr/bin/env groovy
@Library('adp-shared-library@1.5.0')

// Imports from shared library above
import adp.github.Github

// Imports
import groovy.transform.Field
import java.text.SimpleDateFormat

/****************************************************************/

// Variables
def github = new Github(this)
def artifactoryBasePath = 'generic-local/schaeffler-frontend'

def customVersionDefault = 'No custom version'
@Field
def buildBase

@Field
def affectedApps

@Field
def affectedLibs

@Field
boolean storybookAffected = false

@Field
boolean skipBuild = false

@Field
def releasableApps = ['cdba', 'sedo', 'gq', 'ia', 'mac', 'mm', 'ga', 'ea']

/****************************************************************/

// Functions
boolean isBugfix() {
    return "${BRANCH_NAME}".startsWith('bugfix/')
}

boolean isDepUpdate() {
    return "${BRANCH_NAME}".startsWith('dependabot/') || "${BRANCH_NAME}".startsWith('renovate/')
}

boolean isMaster() {
    return "${BRANCH_NAME}" == 'master'
}

boolean isAppRelease() {
    // releases only allowed on master
    if(!isMaster()) {
        return false;
    }

    return releasableApps.any { app -> app.contains(params.RELEASE_SCOPE)}
}

boolean isLibsRelease() {
    return params.RELEASE_SCOPE == 'LIBS' && isMaster()
}

boolean isNightly() {
    def buildCauses = "${currentBuild.buildCauses}"
    boolean isStartedByTimer = false
    if (buildCauses != null && buildCauses.contains('Started by timer')) {
        isStartedByTimer = true
    }

    return isStartedByTimer && isMaster()
}

boolean buildStorybook() {
    return !skipBuild && !isNightly() && !isLibsRelease() && !isAppRelease()
}

boolean publishStorybook() {
    // should only run if
    // pipeline runs on master branch
    // storybook project is affected
    // buildStorybook returns true

    return isMaster () && buildStorybook() && storybookAffected
}

boolean runQualityStage() {
    // should always run except in these scenarios:
    // skipBuild flag is set
    // nightly pipeline run
    // libs or app release

    return !skipBuild && !isNightly() && !isLibsRelease() && !isAppRelease()
}

boolean runDeliverAppsStage() {
    return !isLibsRelease() && !isDepUpdate()
}

boolean runTriggerAppDeploymentsStage() {
    // the stage trigger app deployments should only run if the following conditions are met
    // skipBuild flag is not present
    // it is not a nightly pipeline run
    // it is not a libs release
    // it is not a dep update branch

    return !skipBuild && !isNightly() && !isLibsRelease() && !isDepUpdate()
}

void defineBuildBase() {
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

    return input == '' ? [] : input.split('\n')
}

def defineAffectedAppsAndLibs() {
    apps = sh (
        script: "npx nx show projects --affected --base=${buildBase} --exclude *-e2e,shared-*,eslint-rules", 
        returnStdout: true
    )

    libs = sh (
        script: "npx nx show projects --affected --base=${buildBase} --projects shared-*",
        returnStdout: true
    )

    affectedApps = mapAffectedStringToArray(apps)

    affectedLibs = mapAffectedStringToArray(libs)

    if (affectedLibs.contains('shared-ui-storybook')) {
        storybookAffected = true
    }

    affectedLibs -= 'shared-ui-storybook'
}

boolean ciSkip() {
    Integer ciSkip = sh([script: "git log -1 | grep '.*\\[ci skip\\].*'", returnStatus: true])

    if ((ciSkip == 0 && isMaster() && !(isAppRelease() || isLibsRelease())) || "${BRANCH_NAME}" == 'gh-pages') {
        currentBuild.description = 'CI SKIP'
        currentBuild.result = 'SUCCESS'
        skipBuild = true
    }
}

void setGitUser() {
    // Set Config for Sir Henry
    sh 'git config user.email adp-jenkins@schaeffler.com'
    sh 'git config user.name "Sir Henry"'
}

def getPackageVersion(app = null) {
    def file = app ? "apps/${app}/package.json" : 'package.json'
    def packageJSON = readJSON file: file

    return packageJSON.version
}

def getAgentLabel() {
    return 'monorepo'
}

void deployArtifact(target, uploadFile, checksum) {
    withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_FRONTEND_USER', passwordVariable: 'API_KEY', usernameVariable: 'USERNAME')]) {
        sh "curl --http1.1 -H X-JFrog-Art-Api:${API_KEY} -H X-Checksum-Sha1:${checksum} -X PUT \"https://artifactory.schaeffler.com/artifactory/${target};build.number=${BUILD_NUMBER};build.name=${target};build.commit=${GIT_COMMIT}\" -T ${uploadFile}"
    }
}

void downloadArtifact(target, output) {
    sh "curl --http1.1 -X GET \"https://artifactory.schaeffler.com:443/artifactory/${target}\" --output ${output}"
}

// 1. Only delete files -> do not delete whole folders (e.g. dont delete the whole cdba folder)
// 2. Only delete files which are not are release, latest or next
boolean artifactoryFileCanBeRemoved(artifactoryFile) {
    return !artifactoryFile.folder && !artifactoryFile.uri.contains('release/') && !artifactoryFile.uri.contains('latest.zip') && !artifactoryFile.uri.contains('next.zip')
}

// remove @ because frontend deployment pipelines add docker tags with BRANCH_NAME as value and '@' is not allowed in docker tags
// example: depeendency update branch 'renovate/@nrwlnx' will get a docker tag of 'renovate-@nrwlnx' -> remove the @
def getFilteredBranchName() {
    return "${BRANCH_NAME}".replace('@', '')
}

def getNxRunnerConfig() {
    return '--runner=ci'
}

void cleanWorkspace() {
    sh 'rm -rf checkstyle coverage dist node_modules reports apps/**/node_modules'
}

/****************************************************************/
pipeline {
    agent {
        label getAgentLabel()
    }

    environment {
        NPM_CONFIG_REGISTRY = 'https://registry.npmjs.org/'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds (abortPrevious: !isMaster())
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        ansiColor('xterm')
        office365ConnectorWebhooks([[name: 'Jenkins', notifyAborted: true, notifyBackToNormal: true, notifyFailure: true, notifyNotBuilt: true, notifyRepeatedFailure: true, notifySuccess: true, notifyUnstable: true, url: 'https://worksite.webhook.office.com/webhookb2/a8039948-cbd2-4239-ba69-edbeefadeea2@67416604-6509-4014-9859-45e709f53d3f/IncomingWebhook/f20462c8f2bd4a4292cb28af1f2b08a9/4d574df3-1fa0-4252-86e6-784d5e165a8b']])
    }

    triggers {
        cron(isMaster() ? '@midnight' : '')
    }

    parameters {
        choice(
          name: 'RELEASE_SCOPE',
          choices: ['NOTHING', 'LIBS', 'cdba', 'sedo', 'gq', 'ia', 'mac', 'mm', 'ga', 'ea'],
          description: 'Use to trigger a production release of either an single app or for all libs.'
        )
        choice(
          name: 'CUSTOM_VERSION',
          choices: ["${customVersionDefault}", 'major', 'minor', 'patch'],
          description: 'Define type of version (major = 1.X.X, minor = X.1.X, patch = X.X.1).'
        )
    }

    stages {
         stage('Install') {
            steps {
                script {
                    echo 'Install NPM Dependencies'
                    
                    sh 'pnpm install'
                }
            }
        }

        stage('Preparation') {
            steps {
                echo 'Preparation of some variables'

                ciSkip()

                script {
                    if (isAppRelease()) {
                        def deployments = readJSON file: 'deployments.json'
                        def apps = deployments.keySet()
                        env.RELEASE_SCOPE = params.RELEASE_SCOPE  
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
                                    sh "pnpm renovate --token=${ACCESS_TOKEN} --platform=gitlab --endpoint=https://gitlab.schaeffler.com/api/v4 frontend-schaeffler/schaeffler-frontend"
                                }
                            }
                        }
                    }
                }

                stage('Audit') {
                    steps {
                        echo 'Run PNPM Audit'
						script {
                            def result = sh (returnStatus: true, script: '''
                                mkdir -p reports
                                pnpm audit --json > reports/pnpm-audit.json
                            ''') as int

                            recordIssues tool: analysisParser(pattern: 'reports/pnpm-audit.json', analysisModelId: 'pnpm-audit')

                            if (result != 0) {
                                unstable 'PNPM audit failed'
                            }
                        }
                    }
                }

                stage('Cleanup Artifactory') {
                    steps {
                        script {
                            withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_FRONTEND_USER', passwordVariable: 'API_KEY', usernameVariable: 'USERNAME')]) {
                                def jsonString = sh (
                                    script: "curl --silent -H X-JFrog-Art-Api:${API_KEY} -X GET \"https://artifactory.schaeffler.com/artifactory/api/storage/${artifactoryBasePath}?list&deep=1&depth=10&listFolders=1&mdTimestamps=1&includeRootPath=1\"",
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
                                            sh "curl --silent -H X-JFrog-Art-Api:${API_KEY} -X DELETE \"https://artifactory.schaeffler.com/artifactory/${artifactoryBasePath}${artifactoryFile.uri}\""
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

                            // delete nx-cache only when disk usage is over 75%
                            if (diskUsagePercentString.toInteger() > 75) {
                                sh 'rm -rf /home/adp-jenkins/temp/angular-cache'
                                sh 'mkdir /home/adp-jenkins/temp/angular-cache'

                                sh 'rm -rf /home/adp-jenkins/temp/nx-cache'
                                sh 'mkdir /home/adp-jenkins/temp/nx-cache'

                                sh 'rm -rf /home/adp-jenkins/temp/jest-cache'
                                sh 'mkdir /home/adp-jenkins/temp/jest-cache'
                            }
                        }
                    }
                }

                stage('Test:E2E') {
                    environment {
                        NO_PROXY="localhost,127.0.0.1,::1,schaeffler.com,caeonlinecalculation-d.schaeffler.com,caeonlinecalculation.schaeffler.com"
                    }
                    steps {
                        // quantity 1 means that only one pipeline can execute cypress tests on an agent, other pipelines have to wait until the lock is released
                        lock(resource: "lock-cypress-${env.NODE_NAME}", quantity: 1) {
                            echo 'Run E2E Tests'

                            script {
                                sh "printenv"
                                def result = sh "pnpm install && pnpm cypress install && pnpm run affected:e2e --base=${buildBase} ${getNxRunnerConfig()}"

                                if (result != 0) {
                                    unstable 'E2E tests failed'
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
        }

        stage('Quality') {
            when {
                expression {
                    return runQualityStage()
                }
            }
            failFast true
            parallel {
                stage('Format:Check') {
                    steps {
                        echo 'Run Format Check with prettier'

                        script {
                            sh "pnpm run format:check --base=${buildBase}"
                        }
                    }
                }

                stage('Lint:TS') {
                    steps {
                        echo 'Run TS Lint'

                        script {
                            sh "pnpm run affected:lint --base=${buildBase} --configuration=ci --parallel=2 ${getNxRunnerConfig()}"
                        }
                    }
                    post {
                        always {
                            recordIssues(tools: [checkStyle(pattern: 'checkstyle/**/checkstyle.xml')], enabledForFailure: true)
                        }
                    }
                }

                stage('Lint:HTML') {
                    steps {
                        echo 'Run HTML Lint'

                        // no checkstyle output
                        script {
                            sh 'pnpm run lint:html'
                        }
                    }
                }

                stage('Test:Unit') {
                    steps {
                        echo 'Run Unit Tests'

                        script {
                            sh "pnpm run affected:test --base=${buildBase} --parallel=2 ${getNxRunnerConfig()}"
                        }
                    }
                    post {
                        success {
                            // Unit tests results
                            publishCoverage adapters: [istanbulCoberturaAdapter(mergeToOneReport: true, path: 'coverage/**/*cobertura-coverage.xml')], sourceFileResolver: sourceFiles('NEVER_STORE')
                        }
                        always {
                            junit allowEmptyResults: true, testResults: 'coverage/junit/test-*.xml'
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
                    try {
                        sh "git branch -D ${targetBranch}"
                    } catch (error) {
                        echo "${targetBranch} does not exist"
                    }

                    // Generate Changelog, update Readme
                    github.executeAsGithubUser('github-jenkins-access-token', 'git fetch --all')
                    sh "git checkout ${targetBranch}"

                    def releaseFailed = 0
                    def standardVersionCommand = ""

                    // generate project specific changelog
                    if (isAppRelease()) {
                        standardVersionCommand = "pnpm nx run ${env.RELEASE_SCOPE}:version"

                        if (params.CUSTOM_VERSION != "${customVersionDefault}") {
                            standardVersionCommand += " --releaseAs=${params.CUSTOM_VERSION}"
                        }
                    } else if (isLibsRelease()) {
                        standardVersionCommand = "pnpm nx run-many --target=version --projects=${affectedLibs.join(',')}"
                    }

                    withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'GITHUB_TOKEN')]) {
                        releaseFailed = github.executeAsGithubUser('github-jenkins-access-token', standardVersionCommand)
                    }

                    if (releaseFailed) {
                        currentBuild.result = 'ABORTED'
                        error('Creating the release failed')
                    }

                    sh 'pnpm run generate-readme'

                    // generate root changelog
                    if (isAppRelease()) {
                        sh "pnpm run generate-changelog --app ${env.RELEASE_SCOPE}"
                    } else if (isLibsRelease()) {
                        sh 'pnpm run generate-changelog --libs'
                    }

                    sh 'git add .'
                    sh 'git commit -m "chore(docs): update docs [ci skip]"'
                }
            }
        }

        stage('Build:Storybook') {
            when {
                expression {
                    return buildStorybook()
                }
            }
            steps {
                echo 'Build Storybooks for Shared Libraries'

                script {
                    sh "pnpm nx affected --base=${buildBase} --target=build-storybook ${getNxRunnerConfig()}"

                    publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'dist/storybook/shared-ui-storybook', reportFiles: 'index.html', reportName: 'Storybook Components', reportTitles: ''])
                }
            }
        }

        stage('Build Projects') {
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            steps {
                echo 'Build Projects'

                script {
                    lock(resource: "lock-build-${env.NODE_NAME}", quantity: 2) {
                        if (isAppRelease()) {
                            sh "pnpm nx build ${env.RELEASE_SCOPE} --configuration=production"
                            try {
                                sh "pnpm run transloco:optimize dist/apps/${env.RELEASE_SCOPE}/assets/i18n"
                            } catch (error) {
                                echo "No translations found to optimize in app ${env.RELEASE_SCOPE}"
                            }
                        } else if (isLibsRelease()) {
                            sh "pnpm nx run-many --target=build --projects=${affectedLibs.join(',')} --prod"
                        } else {
                            if (isMaster()) {
                                sh "pnpm nx affected --base=${buildBase} --target=build --configuration=qa ${getNxRunnerConfig()} --parallel=3"
                            } else {
                                sh "pnpm nx affected --base=${buildBase} --target=build --configuration=dev ${getNxRunnerConfig()} --parallel=3"
                            }

                            for (app in affectedApps) {
                                try {
                                    sh "pnpm run transloco:optimize dist/apps/${app}/assets/i18n"
                               } catch (error) {
                                    echo "No translations found to optimize in app ${app}"
                                }

                                sh "pnpm webpack-bundle-analyzer dist/apps/${app}/stats.json --mode static --report dist/webpack/${app}-bundle-report.html --no-open || true"
                                publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'dist/webpack', reportFiles: "${app}-bundle-report.html", reportName: "${app} bundle-report", reportTitles: "${app} bundle-report"])
                            }
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
                            return runDeliverAppsStage()
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
                                    def version = getPackageVersion(app)

                                    target1 = "${artifactoryBasePath}/${app}/latest.zip"
                                    deployArtifact(target1, uploadFile, checksum)

                                    target2 = "${artifactoryBasePath}/${app}/release/${version}.zip"
                                    deployArtifact(target2, uploadFile, checksum)
                                } else if (isMaster()) {
                                    target = "${artifactoryBasePath}/${app}/next.zip"

                                    deployArtifact(target, uploadFile, checksum)
                                } else if (!isNightly()) {
                                    def fileName = getFilteredBranchName()
                                    target = "${artifactoryBasePath}/${app}/${fileName}.zip"

                                    deployArtifact(target, uploadFile, checksum)
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
                                sh '''
                                    username=svc_frontend_mono
                                    authToken=$(echo -n "${username}:${API_KEY}" | base64 -w 0)
                                    
                                    npm config set _auth "${authToken}"
                                    npm config set email "${username}@schaeffler.com"

                                    npm config list
                                '''

                                sh "pnpm nx affected --base=${buildBase} --target=publish --registry=https://artifactory.schaeffler.com/artifactory/api/npm/npm/"
                            }
                        }
                    }
                }

                stage('Deliver:Storybook') {
                    when {
                        expression {
                            return publishStorybook()
                        }
                    }
                    steps {
                        echo 'Deliver Storybook to Artifactory'

                        script {
                            zip dir: 'dist/storybook/shared-ui-storybook',  glob: '', zipFile: 'dist/zips/storybook/next.zip'
                            uploadFile = 'dist/zips/storybook/next.zip'
                            checksum = sh (
                                script: "sha1sum ${uploadFile} | awk '{ print \$1 }'",
                                returnStdout: true
                            ).trim()

                            target = "${artifactoryBasePath}/storybook/next.zip"
                            deployArtifact(target, uploadFile, checksum)
                        }
                    }
                }
            }

            post {
                success {
                    script {
                        def version = isAppRelease() ? getPackageVersion(env.RELEASE_SCOPE) : getPackageVersion()
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
                    github.executeAsGithubUser('github-jenkins-access-token', 'git push --follow-tags')
                }
            }
        }

        stage('Trigger App Deployments') {
            when {
                expression {
                    return runTriggerAppDeploymentsStage()
                }
            }
            steps {
                script {
                    def deployments = readJSON file: 'deployments.json'
                    def appsToBuild = isAppRelease() ? [env.RELEASE_SCOPE] : affectedApps

                    for (app in appsToBuild) {
                        def url = deployments[app]

                        def version = getPackageVersion(app)
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

        stage ('Storybook Deployment') {
            when {
                expression {
                    return publishStorybook()
                }
            }
            steps {
                echo 'Deploy Storybook to GH-Pages'

                script {
                    // Checkout gh-pages branch and clean folder
                    github.executeAsGithubUser('github-jenkins-access-token', 'git fetch --all')
                    sh 'git checkout -- .'
                    sh 'git checkout gh-pages'
                    sh "git reset --hard origin/gh-pages"
                    sh 'rm -rf *'

                    // download latest storybook bundle
                    String target = "${artifactoryBasePath}/storybook/next.zip"
                    String output = 'storybook.zip'
                    downloadArtifact(target, output)

                    // unzip bundle
                    sh 'mkdir docs'
                    fileOperations([fileUnZipOperation(filePath: 'storybook.zip', targetLocation: './docs')])
                    writeFile(file: 'docs/CNAME', text: 'storybook.pages.dp.schaeffler')
                    sh 'rm storybook.zip'

                    try {
                        // commit and push back to remote
                        sh 'git add -A'
                        sh "git commit -m 'chore(storybook): update storybook [$BUILD_NUMBER]' --no-verify"
                        github.executeAsGithubUser('github-jenkins-access-token', 'git push')
                    } catch (error) {
                        echo 'No changes to commit for storybook deployment'
                        println(error)
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                cleanWorkspace()
            }
        }
    }
}
