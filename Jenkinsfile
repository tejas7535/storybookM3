#!/usr/bin/env groovy

// Imports
import groovy.transform.Field

/****************************************************************/

// Variables
def rtServer = Artifactory.server('artifactory.schaeffler.com')
def gitEnv

def builds 
def featureBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def hotfixBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def bugfixBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def cherryPickBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def masterBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Docs', 'Trigger Deployments']
def releaseBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Projects', 'Build:Storybook', 'Deploy', 'Deploy:Apps', 'Deploy:Packages', 'Deploy:Docs', 'Trigger Deployments']
def nightlyBuilds = ['Preparation', 'Install', 'Nightly', 'OWASP', 'Renovate', 'Audit']

def artifactoryBasePath = 'generic-local/schaeffler-frontend'

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
def isHotfix() {
    return "${BRANCH_NAME}".startsWith('hotfix/') 
}

def isBugfix() {
    return "${BRANCH_NAME}".startsWith('bugfix/') 
}

// originates from hotfix branch that was merged into master
def isCherryPick() {
    return "${BRANCH_NAME}".startsWith('cherry-pick-')
}

def isMaster() {
    return "${BRANCH_NAME}" == 'master'
} 

def isRelease() {
    return "${BRANCH_NAME}".startsWith('release/')
}

def isNightly() {
    def buildCauses = "${currentBuild.buildCauses}"
    boolean isStartedByTimer = false
    if (buildCauses != null && buildCauses.contains("Started by timer")) {
        isStartedByTimer = true
    }

    return isStartedByTimer && isMaster()
}

def defineBuildBase() {
    buildBase = sh (
        script: "git merge-base origin/master HEAD^",
        returnStdout: true
    ).trim()

    println("The build base for the 'nx affected' scripts is commit ${buildBase}")
}

def mapAffectedStringToArray(String input) {
    input = input.trim()

    return input == "" ? [] : input.split(' ')
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
    affectedLibs -= "shared-ui-storybook"
}

def ciSkip() {
  ciSkip = sh([script: "git log -1 | grep '.*\\[ci skip\\].*'", returnStatus: true])

  if (ciSkip == 0 && (isMaster() || isCherryPick())) {
    currentBuild.description = "CI SKIP"
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
    packageJSON = readJSON file: 'package.json'
    return packageJSON.version
}

// define builds (stages), which are reported back to GitLab
builds = featureBuilds

if (isHotfix()) {
    builds = hotfixBuilds
} else if (isMaster()) {
    builds = masterBuilds

    if(isNightly()){
        builds = nightlyBuilds
    } else if (params.RELEASE){
        builds.add('Pre-Release')
        builds.add('Release')
    }
} else if (isRelease()) {
    builds = releaseBuilds
} else if (isCherryPick()) {
    builds = cherryPickBuilds
} else if (isBugfix()){
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
            name: 'RELEASE',
            defaultValue: false,
            description: 'Set "true" to trigger a production release.')
    }

    tools {
        nodejs 'NodeJS 12.18'
    }

    stages {
        stage('Install') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Install NPM Dependencies"
                    
                    sh 'npm ci'            
                }
            }
        }

        stage('Preparation') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Preparation of some variables"
                    
                    ciSkip()
                    defineBuildBase()
                    defineAffectedAppsAndLibs()
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
                stage('OWASP'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run OWASP Dependency Check"
                            
                        }
                    }
                }

                stage('Renovate'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run Renovate for dependency updates"

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

                stage('Audit'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run NPM Audit"
                            
                            script {
                                try {
                                    sh 'npm audit'
                                } catch (error) {
                                    // Get jq binary --> temporary workaround until we have an image with jq preinstalled
                                    sh 'mkdir ~/jq-bin'
                                    sh 'curl -L https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 --output ~/jq-bin/jq'
                                    sh 'chmod +x ~/jq-bin/jq'
                                    env.PATH = "${PATH}:/home/jnkp1usr/jq-bin"
                                    sshagent(['SSH_JUMPER']) {
                                        doggoUrl = sh (
                                            script: 'ssh -o StrictHostKeyChecking=no -l ltpuser 10.115.66.4  curl -L -s https://dog.ceo/api/breeds/image/random | jq .message',
                                            returnStdout: true
                                        ).trim()
                                    }
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
                                            sh "git commit -m 'chore(workspace): fix security vulnerabilities'"
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
                                                script: "cat ./gitlab-templates/security-patch-description-template.md | sed 's#@@DOGGO@@#${doggoUrl}#g'",
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
                                            -o merge_request.title='WIP: chore(workspace): fix security vulnerabilities' \
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
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: '', reportFiles: 'npm-audit.html', reportName: 'NPM Vulnerabilities', reportTitles: ''])
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
                stage('Format:Check'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run Format Check with prettier"
                            
                            script {
                                sh "npm run format:check -- --base=${buildBase}"
                            }
                        }
                    }
                }

                stage('Lint:TSLint'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run TSLint"

                            script {
                                sh "npm run affected:lint -- --base=${buildBase}  --parallel"
                            }
                        }
                    }
                }

                stage('Lint:HTML'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run HTML Lint"

                            // no checkstyle output
                            sh 'npm run lint:html'
                        }
                    }
                }

                stage('Lint:SCSS'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run SCSS Lint"
                
                            // no checkstyle output
                            sh 'npm run lint:scss'
                        }
                    }
                }
                
                stage('Test:Unit'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run Unit Tests"

                            sh "npm run affected:test -- --base=${buildBase}  --parallel"                      
                        }
                    }
                    post {
                        success {
                            // Unit tests results
                            publishCoverage adapters: [coberturaAdapter(mergeToOneReport: true, path: 'coverage/**/*cobertura-coverage.xml')], sourceFileResolver: sourceFiles('STORE_ALL_BUILD')
                            junit allowEmptyResults: true, testResults: 'coverage/junit/test-*.xml'
                        }
                    }
                }
                
                stage('Test:E2E'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run E2E Tests"
                            
                            script {
                                sh "npm run affected:e2e:headless -- --base=${buildBase}"
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
                    return !skipBuild && ((isMaster() && params.RELEASE) || isCherryPick() || (isHotfix() && params.RELEASE)) 
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Preparing Release"
                    
                    sshagent(['GITLAB_USER_SSH_KEY']) { 
                        script {

                            def targetBranch = isCherryPick() || isHotfix() ? "${BRANCH_NAME}" : 'master'

                            // Generate Changelog, update Readme
                            sh 'git fetch --all'
                            sh "git checkout ${targetBranch}"

                            // run standard version in root to generate general changelog
                            sh 'npm run release'

                            // generate project specific changelogs
                            sh "npx nx affected --base=${buildBase} --target=standard-version --parallel"
                            
                            sh 'npm run generate-readme'
                            sh 'git add .'
                            sh 'git commit --amend --no-edit'

                            // Add new Release Tag
                            def version = getPackageVersion()
                            sh "git tag -a v${version} -m 'Release of Version ${version}'"                  
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
                stage('Build:Projects'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Build Projects"
                            
                            script {
                                if(isRelease()) {
                                    sh "npx nx affected --base=${buildBase} --target=build --with-deps --configuration=prod"
                                    for (app in affectedApps) {
                                        try {
                                            sh "npm run transloco:optimize -- dist/apps/${app}/assets/i18n"
                                        } catch (error) {
                                            echo "No translations found to optimize in app ${app}"
                                        }
                                    }
                                } else {
                                    if (isMaster()) {
                                        sh "npx nx affected --base=${buildBase} --target=build --with-deps --configuration=qa"
                                    } else {
                                        sh "npx nx affected --base=${buildBase} --target=build --with-deps --configuration=dev"
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

                stage('Build:Storybook'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Build Storybooks for Shared Libraries"
                            
                            script {
                                sh "npx nx affected --base=${buildBase} --target=build-storybook"
                                publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: "dist/storybook/shared-ui-storybook", reportFiles: 'index.html', reportName: "Storybook Components", reportTitles: ''])
                                publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: "dist/storybook/shared-empty-states", reportFiles: 'index.html', reportName: "Storybook Empty States", reportTitles: ''])
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
                stage('Deploy:Apps'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Deploy Apps to Artifactory"
                            
                            script {                             
                                sh 'mkdir dist/zips'

                                // loop over apps and publish them
                                for (app in affectedApps) {
                                    echo "publish ${app} to Artifactory"

                                    zip dir: "dist/apps/${app}",  glob: "", zipFile: "dist/zips/${app}/next.zip"
                                    
                                    def uploadSpec 
                                    
                                    if(isMaster()){
                                        uploadSpec = """{
                                            "files": [
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/next.zip"
                                                }
                                            ]
                                        }"""
                                    } else if (isRelease()) {
                                        uploadSpec = """{
                                            "files": [
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/latest.zip"
                                                },
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "${artifactoryBasePath}/${app}/${BRANCH_NAME}.zip"
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

                stage('Deploy:Packages'){
                    when {
                        expression {
                            return isRelease()
                        }
                    }
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Deploy Libraries as npm packages to Artifactory"

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

                stage('Deploy:Docs'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Deploy Static Content for Documentation"
                            
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
                    return !skipBuild && ((isMaster() && params.RELEASE) || isCherryPick() || (isHotfix() && params.RELEASE))
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Release new version"
                    
                    sshagent(['GITLAB_USER_SSH_KEY']) {  
                        script {
                            sh 'git push --follow-tags'            

                            // get current release branch
                            currentReleaseBranch = sh(script: "git branch -r | grep 'origin/release/' || echo 'origin/release/0'",  returnStdout: true)
                            currentReleaseBranch = currentReleaseBranch.replace('origin/', '')
                            
                            if(isMaster()) {
                                 // increase release number for next release branch
                                nextReleaseNumber = currentReleaseBranch.replace('release/', '').toInteger() + 1
                                nextReleaseBranch = "release/${nextReleaseNumber}"

                                echo "Creating new release branch release/${nextReleaseNumber}"
                                sh "git checkout -b ${nextReleaseBranch}"

                                echo "Triggering release by pushing new branch"
                                sh "git push -u origin ${nextReleaseBranch}" 
                            } else if(isCherryPick()) {
                                // Default Hotfix
                                echo "Checking out current release branch ${currentReleaseBranch}..."
                                sh "git checkout ${currentReleaseBranch}"

                                echo "Merging ${BRANCH_NAME} into current release branch ${currentReleaseBranch}..."
                                sh "git merge ${BRANCH_NAME}"
                                
                                echo "Release branch updatet. Pushing changes to origin..."
                                sh "git push origin ${currentReleaseBranch}"

                                echo "Updating master with new version and changelog..."
                                sh "git checkout master"
                                sh "git merge ${currentReleaseBranch}"
                                sh "git push origin master"
                            }                                       
                        }                      
                    }                    
                }
            }
        }     

        stage('Trigger Deployments'){
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    script {
                        def deployments = readJSON file: 'deployments.json'

                        for (app in affectedApps) {
                            def url = deployments[app]
                            def version = getPackageVersion()

                            try {
                                build job: "${url}",
                                    parameters: [
                                            string(name: 'BRANCH', value: "${BRANCH_NAME}"),
                                            string(name: 'VERSION', value: "${version}"),
                                            string(name: 'ARTIFACTORY_PATH', value: "${artifactoryBasePath}/${app}")
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
                cleanWs()

                if (skipBuild) {
                    masterBuilds.each {
                        build -> updateGitlabCommitStatus name: build, state: 'success'
                    }
                }
            }
        }
    }
}
