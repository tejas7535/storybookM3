#!/usr/bin/env groovy
def gitEnv
def rtServer = Artifactory.server('artifactory.schaeffler.com')

def builds = ['Install', 'Quality', 'OWASP', 'Audit', 'Format:Check', 'Lint:TSLint', 'Lint:HTML', 'Lint:SCSS', 'Test:Unit', 'Test:E2E', 'Release', 'Build', 'Build:Apps', 'Build:Packages', 'Build:Docs', 'Deploy', 'Deploy:Apps', 'Deploy:Packages', 'Deploy:Docs']


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
                            
                        }
                    }
                }

                stage('Lint:HTML'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run HTML Lint"
                            
                        }
                    }
                }

                stage('Lint:SCSS'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run SCSS Lint"
                            
                        }
                    }
                }
                
                stage('Test:Unit'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run Unit Tests"
                            
                        }
                    }
                }
                
                stage('Test:E2E'){
                    steps {
                        gitlabCommitStatus(name: STAGE_NAME) {
                            echo "Run E2E Tests"
                            
                            script {
                                sh 'npm run affected:e2e:headless'
                            }
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'dist/cypress/apps/**/junit/cypress-report.xml'
                            archiveArtifacts artifacts: 'dist/cypress/apps/**/videos/**/*.mp4', onlyIfSuccessful: false
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
