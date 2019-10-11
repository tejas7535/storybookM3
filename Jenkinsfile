#!/usr/bin/env groovy
import groovy.transform.Field

/****************************************************************/

// Variables
def gitEnv
def rtServer = Artifactory.server('artifactory.schaeffler.com')

def builds = ['Preparation', 'Install', 'Quality', 'OWASP', 'Audit', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Release', 'Build', 'Build:Apps', 'Build:Packages', 'Build:Docs', 'Deploy', 'Deploy:Apps', 'Deploy:Packages', 'Deploy:Docs']

@Field
def buildBase 

@Field
def affectedApps

@Field
def affectedLibs

/****************************************************************/

// Functions
def isMaster() {
    return "${BRANCH_NAME}" == 'master'
} 

def defineBuildBase() {
    buildBase = sh (
        script: "git merge-base origin/master HEAD^",
        returnStdout: true
    ).trim()
}

def defineAffectedAppsAndLibs() {
    apps = sh (
        script: "npm run --silent affected:apps -- --base=${buildBase} --plain",
        returnStdout: true
    ).trim().split(' ')
    
    libs = sh (
        script: "npm run --silent affected:libs -- --base=${buildBase} --plain",
        returnStdout: true
    ).trim().split(' ')

    affectedApps = apps == "" ? [] : apps
    affectedLibs = libs == "" ? [] : apps
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
        // cron(env.BRANCH_NAME == 'develop' ? '@midnight' : '')
    }


    tools {
        nodejs 'NodeJS LTS 10.15.0'
    }

    stages {
        stage('Install') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Install NPM Dependencies"
                    sh 'npm install -g cross-env npm-audit-html'
                    sh 'npm ci'                    
                }
            }
        }

        stage('Preparation') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Preparation of some variables"
                    
                    defineBuildBase()
                    defineAffectedAppsAndLibs()
                }
            }
        }

        stage('Quality') {
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
                            
                            /* script {
                                sh 'npm audit --json | npm-audit-html'
                            } */
                        }
                    }

                    /* post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: '', reportFiles: 'npm-audit.html', reportName: 'NPM Vulnerabilities', reportTitles: ''])
                        }
                    } */
                }

                stage('Format:Check'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run Format Check with prettier"
                            
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
                                if(isMaster()){
                                    sh "npm run master:e2e -- --base=${buildBase}"
                                } else {
                                    sh 'npm run affected:e2e:headless'
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

        stage('Release') {
            steps {
                gitlabCommitStatus(name: STAGE_NAME) {
                    echo "Preparing Release"
                    
                }
            }
        }

        stage('Build') {
            failFast true
            parallel {
                stage('Build:Apps'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Build Apps"
                            
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
            failFast true
            parallel {
                stage('Deploy:Apps'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Deploy Apps to Artifactory"
                            
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
                }

                failure {
                    updateGitlabCommitStatus name: STAGE_NAME, state: 'failed'
                }
            }
        }
    }
}
