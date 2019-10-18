#!/usr/bin/env groovy

// Imports
import groovy.transform.Field

/****************************************************************/

// Variables
def rtServer = Artifactory.server('artifactory.schaeffler.com')
def gitEnv

def builds 
def featureBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Apps', 'Build:Packages', 'Build:Docs']
def hotfixBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Apps', 'Build:Packages', 'Build:Docs']
def masterBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Apps', 'Build:Packages', 'Build:Docs', 'Deploy', 'Deploy:Apps', 'Deploy:Packages', 'Deploy:Docs']
def releaseBuilds = ['Preparation', 'Install', 'Quality', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Build', 'Build:Apps', 'Build:Packages', 'Build:Docs', 'Deploy', 'Deploy:Apps', 'Deploy:Packages', 'Deploy:Docs']
def nightlyBuilds = ['Preparation', 'Install', 'Nightly', 'OWASP', 'Audit']

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
}

def ciSkip() {
  ciSkip = sh([script: "git log -1 | grep '.*\\[ci skip\\].*'", returnStatus: true])

  if (ciSkip == 0) {
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
}

/****************************************************************/
pipeline {
    agent {
        label 'linux && docker && extratools'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
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
        cron(isMaster() ? 'H H(0-3) * * 1-5' : '')
    }

    parameters {
        booleanParam(
            name: 'RELEASE',
            defaultValue: false,
            description: 'Set "true" to trigger a production release.')
    }

    tools {
        nodejs 'NodeJS LTS 10.15.0'
    }

    stages {
        stage('Install') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Install NPM Dependencies"
                    // Install newest npm version since standard is 6.4.1 where npm audit returns a 400 Bad request error...
                    sh 'npm install -g npm'
                    sh 'npm install -g cross-env npm-audit-html'
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

                stage('Audit'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run NPM Audit"
                            
                            script {
                                try {
                                    sh 'npm audit'
                                } catch (error) {
                                    sshagent(['GITLAB_USER_SSH_KEY']) {
                                        // check if there is already a hotfix/security-patch branch
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
                                        sh 'git add -u'
                                        sh 'git commit -m "chore(workspace): fix security vulnerabilities"'

                                        // create merge request
                                        sh """
                                            git push -u origin hotfix/security-patch \
                                            -o merge_request.create \
                                            -o merge_request.target=master \
                                            -o merge_request.title='WIP: chore(workspace): fix security vulnerabilities' \
                                            -o merge_request.description='You had vulnerabilities in your project. It was a pleasure to fix them. For more information, see <a href="${JOB_URL}NPM_20Vulnerabilities/">NPM Audit Report</a>' \
                                            -o merge_request.label='priority::hotfix' \
                                            -o merge_request.remove_source_branch=true""".stripIndent()
                                    }
                                } finally {
                                    sh 'npm audit --json | npm-audit-html'
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
                                for(app in affectedApps) { 
                                    sh "ng lint ${app} --force --format checkstyle > ${app}-checkstyle-result.xml"
                                    sh "ng lint ${app}-e2e --force --format checkstyle > ${app}-e2e-checkstyle-result.xml"
                                }

                                for(lib in affectedLibs) { 
                                    sh "ng lint ${lib} --force --format checkstyle > ${lib}-checkstyle-result.xml"
                                }
                            }
                        }
                    }
                    post {
                        success {
                            // TSLint checkstyle results
                            recordIssues(tools: [checkStyle(id: 'ts-lint', pattern: '*checkstyle-result.xml')], aggregatingResults: true)
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

                            sh "npm run affected:test -- --base=${buildBase}"                      
                        }
                    }
                    post {
                        success {
                            // Unit tests results
                            cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/**/*cobertura-coverage.xml', conditionalCoverageTargets: '80, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false, failNoReports: false
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
                    return params.RELEASE && !skipBuild && isMaster()
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Preparing Release"
                    
                    script {
                        // Generate Changelog, update Readme
                        sh 'git checkout master'
                        sh 'npm run release'
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

        stage('Build') {
            when {
                expression {
                    return !skipBuild && !isNightly()
                }
            }
            failFast true
            parallel {
                stage('Build:Apps'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Build Apps"
                            
                            script {
                                if(isMaster() ||  isRelease()) {
                                    sh "npm run affected:build -- --configuration=production --base=${buildBase}"
                                } else {
                                    sh "npm run affected:build -- --configuration=dev --base=${buildBase}"
                                }  
                            }
                        }
                    }
                }

                stage('Build:Packages'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Build Libraries as npm packages"
                            
                        }
                    }
                }

                stage('Build:Docs'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Build Static Content for Documentation"
                            
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
                    return !skipBuild && (isMaster() || isRelease()) && !isNightly()
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
                                                    "target": "generic-local/schaeffler-frontend/${app}/next.zip"
                                                }
                                            ]
                                        }"""
                                    } else {
                                         uploadSpec = """{
                                            "files": [
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "generic-local/schaeffler-frontend/${app}/latest.zip"
                                                },
                                                {
                                                    "pattern": "dist/zips/${app}/next.zip",
                                                    "target": "generic-local/schaeffler-frontend/${app}/${BRANCH_NAME}.zip"
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
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Deploy Libraries as npm packages to Artifactory"
                            
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
                    return params.RELEASE && !skipBuild && isMaster()
                }
            }
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Release new version"
                    
                    sshagent(['GITLAB_USER_SSH_KEY']) {                        
                        sh 'git push --follow-tags origin master'                           
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
                    return
                }
            }
        }
    }
}