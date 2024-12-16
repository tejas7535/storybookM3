#!/usr/bin/env groovy
@Library('adp-shared-library@1.43.0')

// Imports
import groovy.transform.Field
import java.text.SimpleDateFormat

// Imports from shared library above
import adp.github.Github
import adp.util.Util

// Variables
@Field
Github github = new Github(this)
Util util = new Util(this)

boolean isMain = util.isMain()
boolean isNightly = util.isStartedByTimer() && isMain
String sanitizedBranchName = util.getSanitizedBranchName(env.BRANCH_NAME)

env.PROJECT_NAME = 'frontend-schaeffler'

def artifactoryBasePath = 'private-frontend-schaeffler-generic-local/schaeffler-frontend'
def customVersionDefault = 'No custom version'

@Field
def buildBase
@Field
def affectedApps
@Field
def affectedLibs
@Field
boolean isRelease = false
@Field
boolean isPreReleaseTrigger = false
@Field
boolean isPreRelease = false
@Field
boolean isHotfixTrigger = false
@Field
boolean isHotfixRelease = false
@Field
boolean isHotfixBaseWithoutChanges = false
@Field
boolean isAppRelease = false
@Field
boolean isLibsRelease = false
@Field
boolean runQualityStage = true
@Field
boolean isRenovate = false
@Field
boolean buildStorybook = false
@Field
boolean publishStorybook = false
@Field
boolean triggerAppDeployments = false
@Field
boolean storybookAffected = false
@Field
boolean skipBuild = false
@Field
def buildTypes = [ NORMAL: 'normal', PRE_RELEASE : 'pre-release', RELEASE : 'release', RENOVATE : 'renovate', HOTFIX: 'hotfix' ]
@Field
def releasableApps = ['cdba', 'sedo', 'ia', 'mac', 'mm', 'ga', 'ea', 'lsa', 'hc', 'd360']
@Field
def preReleasableApps = ['gq']
@Field
def preReleaseBranchPrefix = 'pre-release/'
@Field
def hotfixBaseBranchPrefix = "hotfix-base/"
@Field
def hotfixBranchPrefix = "hotfix/"

boolean isPreReleaseBranch = env.BRANCH_NAME.startsWith(preReleaseBranchPrefix)
boolean isHotfixBaseBranch = env.BRANCH_NAME.startsWith(hotfixBaseBranchPrefix)

baselineBranch = 'master'

projectPath = env.JOB_NAME.split(env.JOB_BASE_NAME)[0]
// build should be unstable if any issues are found in master branch. In feature/bugfix branch, it should be red if new issues are introduced.
qualityGate = !isMain ? [threshold: 1, type: 'NEW', unstable: false] : [threshold: 1, type: 'TOTAL', unstable: true]

// Functions
boolean isDepUpdate() {
    return "${BRANCH_NAME}".startsWith('dependabot/') || "${BRANCH_NAME}".startsWith('renovate/')
}

def isValidHotfixBranchRun() {
  return env.BRANCH_NAME.startsWith(hotfixBranchPrefix)
}

void defineIsPreRelease(isPreReleaseBranch) {
    if (isPreReleaseBranch && params.BUILD_TYPE != buildTypes.RELEASE) {
        isPreRelease = preReleasableApps.any { app -> app.contains(params.RELEASE_SCOPE) }
    }
}

void defineIsAppRelease(isMain, isPreReleaseBranch) {
    if (isMain && params.BUILD_TYPE == buildTypes.RELEASE) {
        isAppRelease = releasableApps.any { app -> app.contains(params.RELEASE_SCOPE) }
    }

    if (isPreReleaseBranch && params.BUILD_TYPE == buildTypes.RELEASE) {
        isAppRelease = preReleasableApps.any { app -> app.contains(env.RELEASE_SCOPE) }
    }
}

void defineIsHotfixRelease(isHotfixBaseBranch) {
  // hotfix release = merging the related hotfix branch into the hotfix-base branch 
  setupGitCredentials()
  def lastCommitMessage = sh(
    script: "git log -1 --pretty=format:%s",
    returnStdout: true
  ).trim()

  isHotfixRelease = isHotfixBaseBranch && currentBuild.changeSets.size() > 0 && lastCommitMessage.startsWith("fix(${env.RELEASE_SCOPE}): ⚡hotfix")
  isHotfixBaseWithoutChanges = !isHotfixRelease && isHotfixBaseBranch
}

void defineReleaseScope(isPreReleaseBranch, isHotfixBaseBranch) {
    // in case of a pre-release or hotfix process we can't get the release scope from the parameter but from the branch name
    // (e.g. pre-release/<app>, hotfix-base/<app>, hotfix/<app>)
    if (isHotfixBaseBranch) {
        env.RELEASE_SCOPE = env.BRANCH_NAME.substring(hotfixBaseBranchPrefix.length())
    } else if (env.BRANCH_NAME.startsWith(hotfixBranchPrefix)) {
        env.RELEASE_SCOPE = env.BRANCH_NAME.substring(hotfixBranchPrefix.length())
    } else {
        env.RELEASE_SCOPE = isPreReleaseBranch ? env.BRANCH_NAME.substring(preReleaseBranchPrefix.length()) : params.RELEASE_SCOPE
    }
}

void defineIsPreReleaseTrigger(isMain) {
    // pre-releases only allowed on master
    if (isMain && params.BUILD_TYPE == buildTypes.PRE_RELEASE) {
        isPreReleaseTrigger = preReleasableApps.any { app -> app.contains(params.RELEASE_SCOPE) }

        if (isPreReleaseTrigger) {
            // throw error if pre-release branch already exists
            def branchName = preReleaseBranchPrefix + params.RELEASE_SCOPE
            verifyNonExistingBranch("${branchName}", "Pre release already in progress for ${params.RELEASE_SCOPE}")
        }
    }
}

def defineIsHotfixTrigger() {
    if (params.BUILD_TYPE == buildTypes.HOTFIX) {
        // hotfix process is only available for the apps which has pre-release environment
        isHotfixTrigger = preReleasableApps.any { app -> app.contains(env.RELEASE_SCOPE) }

        if (isHotfixTrigger) {
            echo 'Verify hotfix and pre-release branches...'
            // throw error if hotfix-base branch or pre-release already exists
            
            def preReleaseBranchName = preReleaseBranchPrefix + params.RELEASE_SCOPE
            verifyNonExistingBranch("${preReleaseBranchName}", "Pre release already in progress for ${params.RELEASE_SCOPE}")

            def hotfixBaseBranchName = hotfixBaseBranchPrefix + env.RELEASE_SCOPE
            verifyNonExistingBranch("${hotfixBaseBranchName}", "Hotfix base already exists for ${params.RELEASE_SCOPE}")
        }
    }
}

def setupGitCredentials() {
    withCredentials([usernamePassword(credentialsId: 'SVC_MONO_FRONTEND_USER', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
        sh(script: """
        #!/bin/sh
        git config --global credential.helper '!f() { sleep 1; echo "username=${env.GIT_USERNAME}"; echo "password=${env.GIT_PASSWORD}"; }; f'
        """)
    }
}

def verifyNonExistingBranch(branchName, errorMsg) {
  setupGitCredentials()
  def branchExistsCommand = "git ls-remote --heads origin ${branchName}"
  def branchExists = sh(script: branchExistsCommand, returnStdout: true)
  if (branchExists) {
      currentBuild.result = 'ABORTED'
      error(errorMsg)
  }
}

def createGitHubPullRequest(base, head, title, body) {
  withCredentials([string(credentialsId: 'SVC_FRONTEND_MONO_GH_TOKEN', variable: 'GITHUB_TOKEN')]) {
    sh "gh pr create --base ${base} --head ${head} --title \"${title}\" --body \"${body}\""
  }
}

void defineIsLibsRelease(isMain) {
    isLibsRelease = params.RELEASE_SCOPE == 'LIBS' && isMain
}

void defineBuildStorybook(isRelease) {
    buildStorybook = !skipBuild && !isRelease && !isPreReleaseTrigger && !isHotfixTrigger && !isHotfixBaseWithoutChanges
}

void definePublishStorybook(isMain) {
    // should only run if
    // pipeline runs on master branch
    // storybook project is affected
    // buildStorybook returns true

    publishStorybook = isMain && storybookAffected && buildStorybook
}

void defineRunQualityStage(isRelease) {
    // should always run except in these scenarios:
    // skipBuild flag is set
    // nightly pipeline run
    // libs or app release
    // app pre-release trigger
    // app hotfix trigger
    // hotfix-base run without changes

    runQualityStage = !skipBuild && !isRelease && !isPreReleaseTrigger && !isHotfixTrigger && !isHotfixBaseWithoutChanges
}

boolean runDeliverAppsStage(isMain) {
    return !isLibsRelease && !isDepUpdate() && !isPreReleaseTrigger && !isHotfixTrigger && !isHotfixBaseWithoutChanges
}

void defineRunTriggerAppDeploymentsStage(isNightly) {
    // the stage trigger app deployments should only run if the following conditions are met
    // skipBuild flag is not present
    // it is not a nightly pipeline run
    // it is not a libs release
    // it is not a dep update branch
    // it is not a pre-release/hotfix trigger
    // it is not a hotfix base run without any change

    triggerAppDeployments = !skipBuild && !isNightly && !isLibsRelease && !isDepUpdate() && !isPreReleaseTrigger && !isHotfixTrigger && !isHotfixBaseWithoutChanges
}

void defineIsRenovate() {
    if (params.BUILD_TYPE == buildTypes.RENOVATE) {
        isRenovate = true
        runQualityStage = false
        buildStorybook = false
        publishStorybook = false
        triggerAppDeployments = false
    }
}

void defineBuildBase(isMain) {
    if (isRelease || isHotfixRelease || isValidHotfixBranchRun()) {
        latestTag = getLatestGitTag("${env.RELEASE_SCOPE}")

        buildBase = sh(
            script: "git rev-list -n 1 ${latestTag}",
            returnStdout: true
        ).trim()
    } else {
        buildBase = sh(
            script: 'git merge-base origin/master HEAD^',
            returnStdout: true
        ).trim()
    }

    println("The build base for the 'nx affected' scripts is commit ${buildBase}")
}

def getLatestGitTag(app) {
    def tag

    tag = sh(
        script: "git tag --sort=taggerdate -l '${app}-v*' | tail -1",
        returnStdout: true
    ).trim()

    if (!tag) {
        println("Couldn't find a version tag for app ${app}")
        println('Using last workspace git tag instead ...')

        tag = sh(
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
    apps = sh(
        script: "pnpm --silent nx show projects --affected --base=${buildBase} --exclude '*-e2e,shared-*,eslint-rules'",
        returnStdout: true
    )

    libs = sh(
        script: "pnpm --silent nx show projects --affected --base=${buildBase} --projects 'shared-*' --exclude '*-e2e'",
        returnStdout: true
    )

    affectedApps = mapAffectedStringToArray(apps)

    affectedLibs = mapAffectedStringToArray(libs)

    if (affectedLibs.contains('shared-ui-storybook')) {
        storybookAffected = true
    }

    affectedLibs -= 'shared-ui-storybook'
}

boolean ciSkip(isMain, isRelease) {
    Integer ciSkip = sh([script: "git log -1 | grep '.*\\[(ci skip|CI SKIP)\\].*'", returnStatus: true])

    if ((ciSkip == 0 && ((isMain && !isRelease) || isValidHotfixBranchRun() || isHotfixRelease)) || "${BRANCH_NAME}" == 'gh-pages') {
        currentBuild.description = 'CI SKIP'
        currentBuild.result = 'SUCCESS'
        skipBuild = true
    }
}

void setGitUser() {
    // Set Config for Sir Henry
    sh 'git config user.email svc_frontend_mono@schaeffler.com'
    sh 'git config user.name "Sir Henry"'
}

def getPackageVersion(app = null) {
    def file = app ? "apps/${app}/package.json" : 'package.json'
    def packageJSON = readJSON file: file

    return packageJSON.version
}

def getReleaseTypeForPreRelease(releaseScope){
    // get the release type by comparing latest pre release and release tags
    def latestReleaseTag = sh (returnStdout:true, script: """
        git tag --sort=-v:refname --list '${releaseScope}*' | grep -v 'rc' | head -1 | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+'
    """).split(/\D+/)
    def latestPreReleaseTag = sh (returnStdout:true, script: """
        git tag --sort=-v:refname --list '${releaseScope}*' | grep 'rc'| head -1 | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+'
    """).split(/\D+/)

    def releaseType
    if (Integer.parseInt(latestPreReleaseTag[0]) > Integer.parseInt(latestReleaseTag[0])) {
        releaseType = 'major'
    } else if (Integer.parseInt(latestPreReleaseTag[1]) > Integer.parseInt(latestReleaseTag[1])) {
        releaseType = 'minor'
    } else {
        releaseType = 'patch'
    }

    return releaseType
}

void deployArtifact(target, uploadFile, checksum) {
    withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_FRONTEND_MONO_DEPLOYMENTS', passwordVariable: 'TOKEN', usernameVariable: 'USERNAME')]) {
        sh "curl --http1.1 -H \"Authorization: Bearer ${TOKEN}\" -H X-Checksum-Sha1:${checksum} -X PUT \"https://artifactory.schaeffler.com/artifactory/${target};build.number=${BUILD_NUMBER};build.name=${target};build.commit=${GIT_COMMIT}\" -T ${uploadFile}"
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

/****************************************************************/
pipeline {
    agent {
        docker {
            image 'artifactory.schaeffler.com/docker/adp/jenkinsbaseimage:2'
            label 'monorepo-docker'
            alwaysPull true
            args '-u root:root -v cache:/tmp/.cache -v $PROJECT_NAME:/tmp/.project-cache  -v $PROJECT_NAME-angular:$WORKSPACE/.angular/cache -v /var/run/docker.sock:/var/run/docker.sock -e https_proxy -e http_proxy -e no_proxy'
        }
    }

    environment {
        CYPRESS_CACHE_FOLDER = '/tmp/.cache/Cypress'
        NX_CACHE_DIRECTORY = '/tmp/.project-cache/nx-cache'
        PNPM_HOME = '/tmp/.cache/pnpm'
        // Sometimes the cache is rejected. Can also be fixed by `npx nx reset` https://nx.dev/recipes/troubleshooting/unknown-local-cache#you-share-cache-with-another-machine-using-a-network-drive
        NX_REJECT_UNKNOWN_LOCAL_CACHE = 0
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds(abortPrevious: !isMain && !isPreReleaseBranch && !isHotfixBaseBranch)
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        ansiColor('xterm')
        office365ConnectorWebhooks([[name: 'Jenkins', notifyAborted: true, notifyBackToNormal: true, notifyFailure: true, notifyNotBuilt: true, notifyRepeatedFailure: true, notifySuccess: true, notifyUnstable: true, url: 'https://worksite.webhook.office.com/webhookb2/a8039948-cbd2-4239-ba69-edbeefadeea2@67416604-6509-4014-9859-45e709f53d3f/IncomingWebhook/f20462c8f2bd4a4292cb28af1f2b08a9/4d574df3-1fa0-4252-86e6-784d5e165a8b']])
    }

    triggers {
        cron(isMain ? '@midnight' : '')
    }

    parameters {
        // environment variables are not accessible in the first run but available within the second run
        activeChoiceHtml(
            choiceType: 'ET_FORMATTED_HIDDEN_HTML',
            name: 'BRANCH',
            omitValueField: true,
            script: [
                $class: 'GroovyScript',
                fallbackScript: [
                    classpath: [],
                    sandbox: true,
                    script: '''
                        return '<p>error</p>'
                    '''
                ],
                script: [
                    classpath: [],
                    sandbox: true,
                    script: """
                        return '<input name="value" value="${env.BRANCH_NAME}" type="text">'
                    """
                ]
            ]
        )
        reactiveChoice(
            choiceType: 'PT_SINGLE_SELECT',
            description: 'What kind of build do you want to perform?',
            filterLength: 1, filterable: false,
            name: 'BUILD_TYPE',
            referencedParameters: 'BRANCH',
            script: [
                $class: 'GroovyScript',
                script: [
                    sandbox: true,
                    script: """
                        def types = ["${buildTypes.NORMAL}"]

                        if(BRANCH.startsWith("${buildTypes.PRE_RELEASE}")) {
                            types = types + ["${buildTypes.RELEASE}"]
                        } else if (BRANCH.startsWith('master')) {
                            types = types + ["${buildTypes.PRE_RELEASE}","${buildTypes.RELEASE}", "${buildTypes.RENOVATE}","${buildTypes.HOTFIX}"]
                        }

                        return types
                    """
                ]
            ]
        )
        reactiveChoice(
            choiceType: 'PT_SINGLE_SELECT',
            description: 'Select the (Pre-) Release scope',
            filterLength: 1, filterable: false,
            name: 'RELEASE_SCOPE',
            referencedParameters: 'BUILD_TYPE,BRANCH',
            script: [
                $class: 'GroovyScript',
                script: [
                    sandbox: true,
                    script: """
                        if(BUILD_TYPE == "${buildTypes.PRE_RELEASE}" || BUILD_TYPE == "${buildTypes.HOTFIX}") {
                            return ["${preReleasableApps.join('","')}"]
                        }
                        if(BUILD_TYPE == "${buildTypes.RELEASE}") {
                            if(BRANCH.startsWith("${preReleaseBranchPrefix}")) {
                                return [BRANCH.substring("${preReleaseBranchPrefix.length()}".toInteger())]
                            }
                            return ['LIBS'] + ["${releasableApps.join('","')}"]
                        }
                        return ['NO RELEASE NOR PRE RELEASE']
                    """
                ]
            ]
        )
        reactiveChoice(
            choiceType: 'PT_SINGLE_SELECT',
            description: 'Select the Version or let semantic versioning do its job.',
            filterLength: 1, filterable: false,
            name: 'CUSTOM_VERSION',
            referencedParameters: 'BUILD_TYPE,BRANCH',
            script: [
                $class: 'GroovyScript',
                script: [
                    sandbox: true,
                    script: """
                        if(BUILD_TYPE == "${buildTypes.RELEASE}" && BRANCH.startsWith("${preReleaseBranchPrefix}")) {
                            return ['VERSION ALREADY DEFINED WHEN CREATING PRE-RELEASE']
                        }

                        if(BUILD_TYPE == "${buildTypes.PRE_RELEASE}" || BUILD_TYPE == "${buildTypes.RELEASE}") {
                            return ["${customVersionDefault}", 'major', 'minor', 'patch']
                        }

                        return ['NO RELEASE NOR PRE RELEASE']
                    """
                ]
            ]
        )
    }

    stages {
        stage('Preparation') {
            steps {
                echo 'Preparation of some variables'

                script {
                    util.addWorkspaceToGitGlobalSafeDirectory()
                    defineReleaseScope(isPreReleaseBranch, isHotfixBaseBranch)
                    defineIsHotfixRelease(isHotfixBaseBranch)
                    /* NOTE: During hotfix process as a reference branch created from the latest production tag should be taken.
                    Otherwise master branch should be a reference */
                    // 'slash' in the 'hotfix-base/<app> needs to be encoded to '%252F' to avoid Jenkins error
                    def hotfixBaseBranch = "hotfix-base%252F" + env.RELEASE_SCOPE
                    def referenceJob = isValidHotfixBranchRun() || isHotfixRelease ? projectPath + hotfixBaseBranch : projectPath + baselineBranch
                    discoverGitReferenceBuild referenceJob: referenceJob
                    defineIsPreRelease(isPreReleaseBranch)
                    defineIsAppRelease(isMain, isPreReleaseBranch)
                    defineIsPreReleaseTrigger(isMain)
                    defineIsHotfixTrigger()
                    defineIsLibsRelease(isMain)
                    isRelease = isAppRelease || isLibsRelease || isHotfixRelease
                    ciSkip(isMain, isRelease)
                    defineRunQualityStage(isRelease)
                    defineBuildStorybook(isRelease)
                    definePublishStorybook(isMain)
                    defineRunTriggerAppDeploymentsStage(isNightly)
                    defineIsRenovate()

                    sh "pnpm config set store-dir $PNPM_HOME/.pnpm-store"
                    sh 'pnpm install'

                    defineBuildBase(isMain)
                    defineAffectedAppsAndLibs()
                    setGitUser()
                }
            }
        }

        stage('Renovate') {
            when {
                expression {
                    return isNightly || isRenovate
                }
            }
            environment {
                RENOVATE_CONFIG_FILE = 'renovate-config.js'
            }
            steps {
                echo 'Renovate'
                withCredentials([string(credentialsId: 'SVC_FRONTEND_MONO_GH_TOKEN', variable: 'RENOVATE_TOKEN')]) {
                    sh """
                        pnpm run renovate --token=${RENOVATE_TOKEN}
                    """
                }
            }
        }

        stage('Audit') {
            when {
                expression {
                    return runQualityStage
                }
            }
            steps {
                echo 'Run PNPM Audit'
                script {
                    sh returnStatus: true, script:'''
                        mkdir -p reports
                        pnpm audit --json > reports/pnpm-audit.json
                    '''
                    recordIssues(ignoreQualityGate: !isMain, qualityGates: [qualityGate], tool: analysisParser(pattern: 'reports/pnpm-audit.json', analysisModelId: 'pnpm-audit'))
                }
            }
        }

        stage('Format:Check') {
            when {
                expression {
                    return runQualityStage
                }
            }
            steps {
                echo 'Run Format Check with prettier'

                script {
                    sh "pnpm nx format:check --base=${buildBase}"
                }
            }
        }

        stage('Lint:HTML') {
            when {
                expression {
                    return runQualityStage
                }
            }
            steps {
                echo 'Run HTML Lint'

                script {
                    sh 'pnpm run lint:html'
                }
            }
        }

        stage('Lint:TS') {
            when {
                expression {
                    return runQualityStage
                }
            }
            steps {
                echo 'Run TS Lint'

                script {
                    sh "pnpm nx affected:lint --base=${buildBase} --configuration=ci --parallel=3"
                }
            }
        }

        stage('Test:Unit') {
            when {
                expression {
                    return runQualityStage
                }
            }
            steps {
                echo 'Run Unit Tests'

                script {
                    sh "pnpm nx affected:test --base=${buildBase} --parallel=2"
                    sh 'mkdir -p coverage'
                    // merge reports
                    sh "pnpm cobertura-merge-globby -o coverage/cobertura-coverage.xml --files='coverage/**/cobertura-coverage.xml'"
                }
            }
            post {
                always {
                    recordCoverage sourceCodeRetention: 'NEVER', tools: [[parser: 'COBERTURA', pattern: 'coverage/cobertura-coverage.xml']], ignoreParsingErrors: true
                    junit allowEmptyResults: true, testResults: 'coverage/junit/test-*.xml'
                }
            }
        }

        stage('Test:E2E') {
            when {
                expression {
                    return runQualityStage && isNightly
                }
            }
            environment {
                NO_PROXY = 'localhost,127.0.0.1,::1,schaeffler.com,caeonlinecalculation-d.schaeffler.com,caeonlinecalculation.schaeffler.com,.schaeffler'
            }
            steps {
                echo 'Run E2E Tests'

                script {
                    def result = sh(returnStatus: true, script: "pnpm run affected:e2e --base=${buildBase}")

                    if (result != 0) {
                        unstable 'E2E tests failed'
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

        stage('Sonar:Scan') {
            when {
                expression {
                    return runQualityStage
                }
            }
            steps {
                echo 'Run Sonar Scan'
                script {
                    withCredentials([string(credentialsId: 'SONARQUBE_TOKEN', variable: 'SONAR_TOKEN')]) {  
                        sh "NX_SONAR_TOKEN=${SONAR_TOKEN} pnpm nx affected --base=${buildBase} --target sonar  --parallel=3"
                    }
                }
            }
        }

        stage('Hotfix') {
            when {
                expression {
                    /* NOTE: Stage should run only when hotfix is triggered manually */
                    return isHotfixTrigger
                }
            }
            steps {
                script {
                    def scope = env.RELEASE_SCOPE // -> gq
                    def latestTag = getLatestGitTag("${scope}")
                    def hotfixBaseBranch = hotfixBaseBranchPrefix + scope // -> ex. /hotfix-base/gq
                    def hotfixBranch = hotfixBranchPrefix + scope // -> ex. hotfix/gq

                    echo 'Creating and pushing new hotfix-base branch...'
                    sh "git checkout tags/${latestTag} -b ${hotfixBaseBranch}"
                    sh "git push origin ${hotfixBaseBranch}"

                    echo 'Creating new hotfix branch...'
                    sh "git checkout -b ${hotfixBranch}"

                    echo 'Creating empty commit on the hotfix branch to be able to create a PR...'
                    sh "git commit --allow-empty -m \"chore: empty commit to create a PR [CI SKIP]\""

                    echo 'Pushing hotfix branch to remote...'
                    sh "git push origin ${hotfixBranch}"

                    echo 'Creating a PR...'
                    createGitHubPullRequest(hotfixBaseBranch, hotfixBranch, "fix(${scope}): ⚡hotfix <placeholder>", "Please describe your hotfix here and update the PR's title using the conventional commit format. *MAKE SURE TO NOT CHANGE THE BEGINNING OF THE PR TITLE: fix(${scope}): ⚡hotfix *. Otherwise the hotfix won't work.")
                    // skip the rest of the pipeline
                    skipBuild = true
                }
            }
        }

        stage('PreRelease') {
            when {
                expression {
                    // define isPreRelease
                    return (isPreReleaseTrigger || isPreRelease) && !isRelease
                }
            }
            steps {
                script {
                    if (isPreReleaseTrigger) {
                        def preReleaseBranch = preReleaseBranchPrefix + env.RELEASE_SCOPE

                        echo 'Creating new pre-release branch...'
                        sh "git checkout -b ${preReleaseBranch}"
                    }else {
                        sh "git checkout ${env.BRANCH_NAME}"
                    }

                    // create a release candidate for any normal pipeline run
                    if (!preReleasableApps.any { app -> app.contains(env.RELEASE_SCOPE) }) {
                        currentBuild.result = 'ABORTED'
                        error('Did not find valid application for the pre-release branch')
                    }
                    // generate tags and changelog on project level
                    def baseBranch = isPreReleaseTrigger ? preReleaseBranchPrefix + env.RELEASE_SCOPE : env.BRANCH_NAME
                    def standardVersionCommand = "pnpm nx run ${env.RELEASE_SCOPE}:version --preid=rc --baseBranch=${baseBranch} --skipProjectChangelog"

                    if(isPreReleaseTrigger && params.CUSTOM_VERSION != "${customVersionDefault}") {
                        standardVersionCommand +=" --releaseAs=pre" + params.CUSTOM_VERSION
                    } else {
                        standardVersionCommand +=" --releaseAs=prerelease"
                    }

                    withCredentials([string(credentialsId: 'SVC_FRONTEND_MONO_GH_TOKEN', variable: 'GITHUB_TOKEN')]) {
                        github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', standardVersionCommand)
                    }

                    // if pre release is triggered, rest of the pipeline can be skipped and will be done on pre-release branch
                    if(isPreReleaseTrigger) {
                        // skip the rest of the pipeline
                        skipBuild = true 
                    }
                }
            }
        }

        stage('Prepare-Release') {
            when {
                expression {
                    return !skipBuild && isRelease
                }
            }
            steps {
                echo 'Preparing Release'

                script {
                    def targetBranch = (isAppRelease && isPreReleaseBranch) || isPreRelease || isHotfixRelease ? env.BRANCH_NAME : 'master'

                    try {
                        sh "git branch -D ${targetBranch}"
                    } catch (error) {
                        echo "${targetBranch} does not exist"
                    }

                    // Generate Changelog, update Readme
                    github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', 'git fetch --all')
                    sh "git checkout ${targetBranch}"

                    def releaseFailed = 0
                    def standardVersionCommand = ''

                    // generate project specific changelog
                    if (isAppRelease) {
                        standardVersionCommand = "pnpm nx run ${env.RELEASE_SCOPE}:version"
                        if (params.CUSTOM_VERSION != "${customVersionDefault}" && !isPreReleaseBranch) {
                            standardVersionCommand += " --releaseAs=${params.CUSTOM_VERSION}"
                        }
                        if (isPreReleaseBranch) {
                            standardVersionCommand += " --baseBranch=${env.BRANCH_NAME} --postTargets=${env.RELEASE_SCOPE}:github"

                            def releaseType = getReleaseTypeForPreRelease(env.RELEASE_SCOPE)
                            standardVersionCommand += " --releaseAs=${releaseType}"

                            // delete all rc tags for the project so that the CHANGELOG generation takes the last release tag as a reference to generate the changelog
                            sh "git tag -l '${env.RELEASE_SCOPE}-v*.*.*-rc*' | xargs git tag -d"
                        }
                    } else if (isLibsRelease) {
                        standardVersionCommand = "pnpm nx run-many --target=version --projects=${affectedLibs.join(',')}"
                    } else if (isHotfixRelease) {
                        // hotfix is always a patch
                        standardVersionCommand = "pnpm nx run ${env.RELEASE_SCOPE}:version --releaseAs=patch --baseBranch=${env.BRANCH_NAME} --postTargets=${env.RELEASE_SCOPE}:github"
                    }

                    withCredentials([string(credentialsId: 'SVC_FRONTEND_MONO_GH_TOKEN', variable: 'GITHUB_TOKEN')]) {
                        releaseFailed = github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', standardVersionCommand)
                    }

                    if (releaseFailed) {
                        currentBuild.result = 'ABORTED'
                        error('Creating the release failed')
                    }

                    sh 'pnpm run generate-readme'

                    // generate root changelog
                    if (isAppRelease || isHotfixRelease) {
                        sh "pnpm run generate-changelog --app ${env.RELEASE_SCOPE}"
                    } else if (isLibsRelease) {
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
                    return buildStorybook
                }
            }
            steps {
                echo 'Build Storybooks for Shared Libraries'

                script {
                    sh "pnpm nx affected --base=${buildBase} --target=build-storybook"

                    publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'dist/storybook/shared-ui-storybook', reportFiles: 'index.html', reportName: 'Storybook Components', reportTitles: ''])
                }
            }
        }

        stage('Build:Apps') {
            when {
                expression {
                    return !skipBuild && !isLibsRelease && !isRenovate && !isHotfixBaseWithoutChanges
                }
            }
            steps {
                echo 'Build Apps'

                script {
                    if (isAppRelease || isHotfixRelease) { /* NOTE: Build with Prod config when hotfix branch is merged to hotfix-base branch */
                        sh "pnpm nx build ${env.RELEASE_SCOPE} --configuration=production"
                    } else if (isPreRelease || isValidHotfixBranchRun()) { /* NOTE: Build with Pre Prod config each time commit is pushed to hotfix PR branch */
                        sh "pnpm nx build ${env.RELEASE_SCOPE} --configuration=${buildTypes.PRE_RELEASE}"
                    } else {
                        if (isMain) {
                            sh "pnpm nx affected --base=${buildBase} --target=build --configuration=qa  --parallel=3"
                        } else {
                            sh "pnpm nx affected --base=${buildBase} --target=build --configuration=dev  --parallel=3"
                        }
                        sh "pnpm nx affected --base=${buildBase} --target=transloco-optimize --parallel=3"

                        sh "pnpm nx affected --base=${buildBase} --target=analyze-bundle --parallel=3"
                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'dist/webpack', reportFiles: '**/bundle-report.html', reportName: 'bundle-reports', reportTitles: 'bundle-report'])
                    }

                    if (isAppRelease || isPreRelease || isHotfixRelease || isValidHotfixBranchRun()) {
                        sh "pnpm nx run ${env.RELEASE_SCOPE}:transloco-optimize"
                    }
                }
            }
        }
        stage('Build:Packages') {
            when {
                expression {
                    return isLibsRelease
                }
            }
            steps {
                echo 'Build Libraries as npm packages'

                script {
                    sh "pnpm nx run-many --target=build --projects=${affectedLibs.join(',')} --prod"
                }
            }
        }

        stage('Deliver') {
            when {
                expression {
                    return !skipBuild && !isNightly && !isRenovate
                }
            }
            failFast true
            parallel {
                stage('Deliver:Apps') {
                    when {
                        expression {
                            return runDeliverAppsStage(isMain)
                        }
                    }
                    steps {
                        echo 'Deliver Apps to Artifactory'

                        script {
                            sh 'mkdir -p dist/zips'
                            def appsToDeploy = isAppRelease || isPreRelease || isHotfixRelease ? [env.RELEASE_SCOPE] : affectedApps

                            // loop over apps and publish them
                            for (app in appsToDeploy) {
                                echo "publish ${app} to Artifactory"

                                sh "pnpm nx run ${app}:zip"
                                uploadFile = "dist/zips/${app}/next.zip"
                                checksum = sh(
                                    script: "sha1sum ${uploadFile} | awk '{ print \$1 }'",
                                    returnStdout: true
                                ).trim()

                                if (isAppRelease || isPreRelease || isValidHotfixBranchRun() || isHotfixRelease) {
                                    def version = getPackageVersion(app)
                                    def path = isPreRelease || isValidHotfixBranchRun() ? "/${buildTypes.PRE_RELEASE}" : ''
                                    target1 = "${artifactoryBasePath}/${app}${path}/latest.zip"
                                    deployArtifact(target1, uploadFile, checksum)

                                    def releasePath = isPreRelease || isValidHotfixBranchRun() ? "${buildTypes.PRE_RELEASE}" : "${buildTypes.RELEASE}"

                                    target2 = "${artifactoryBasePath}/${app}/${releasePath}/${version}.zip"
                                    deployArtifact(target2, uploadFile, checksum)
                                } else if (isMain) {
                                    target = "${artifactoryBasePath}/${app}/next.zip"

                                    deployArtifact(target, uploadFile, checksum)
                                } else if (!isNightly) {
                                    target = "${artifactoryBasePath}/${app}/${sanitizedBranchName}.zip"

                                    deployArtifact(target, uploadFile, checksum)
                                }
                            }
                        }
                    }
                }

                stage('Deliver:Packages') {
                    when {
                        expression {
                            return isLibsRelease
                        }
                    }
                    steps {
                        echo 'Deliver Libraries as npm packages to Artifactory'

                        script {
                            withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_SVC_FRONTEND_MONO', passwordVariable: 'ENCODED_AUTH', usernameVariable: 'USERNAME')]) {
                                sh "npm config set //artifactory.schaeffler.com/artifactory/api/npm/public-frontend-schaeffler-npm-local/:_authToken '${ENCODED_AUTH}'"
                                sh "npm config set email=${USERNAME}@schaeffler.com"
                                sh "pnpm nx affected --base=${buildBase} --target=publish --registry=https://artifactory.schaeffler.com/artifactory/api/npm/public-frontend-schaeffler-npm-local/ --parallel=1" 
                            }
                        }
                    }
                }

                stage('Deliver:Storybook') {
                    when {
                        expression {
                            return publishStorybook
                        }
                    }
                    steps {
                        echo 'Deliver Storybook to Artifactory'

                        script {
                            zip dir: 'dist/storybook/shared-ui-storybook',  glob: '', zipFile: 'dist/zips/storybook/next.zip'
                            uploadFile = 'dist/zips/storybook/next.zip'
                            checksum = sh(
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
                        def version = isAppRelease || isPreRelease || isHotfixRelease ? getPackageVersion(env.RELEASE_SCOPE) : getPackageVersion()
                        currentBuild.description = "Version: ${version}"
                    }
                }
            }
        }

        stage('Release') {
            when {
                expression {
                    return !skipBuild && isRelease
                }
            }
            steps {
                echo 'Release new version'

                script {
                    github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', 'git push --follow-tags')

                    if (isAppRelease && (isPreReleaseBranch || isHotfixRelease)) {
                        github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', 'git fetch')
                        sh 'git checkout master'
                        try {
                            sh "git merge ${env.BRANCH_NAME}"
                            github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', 'git push')
                            github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', "git push -d origin ${env.BRANCH_NAME}")
                        } catch(error) {
                            sh "git reset --hard HEAD"
                            sh "git checkout ${env.BRANCH_NAME}"
                            withCredentials([string(credentialsId: 'SVC_FRONTEND_MONO_GH_TOKEN', variable: 'GITHUB_TOKEN')]) {
                                def version = getPackageVersion(env.RELEASE_SCOPE)
                                createGitHubPullRequest('master', env.BRANCH_NAME, "chore(${env.RELEASE_SCOPE}): ⚡release ${version} -> master", "Automated merge failed due to conflicts. Please resolve them manually and merge this branch. IMPORTANT: DO NOT SQUASH MERGE, AS THIS WILL CAUSE ISSUES WITH SEMANTIC VERSIONING (SEMVER)!")
                            }
                        }
                    }

                }
            }
        }

        stage('Trigger App Deployments') {
            when {
                expression {
                    return triggerAppDeployments
                }
            }
            steps {
                script {
                    def deployments = readJSON file: 'deployments.json'
                    def appsToBuild = isAppRelease || isPreRelease || isHotfixRelease ? [env.RELEASE_SCOPE] : affectedApps

                    for (app in appsToBuild) {
                        def url = deployments[app]

                        def version = getPackageVersion(app)
                        def configuration = isAppRelease || isHotfixRelease ? 'PROD' : isPreRelease || isValidHotfixBranchRun() ? 'PRE-RELEASE' : (isMain ? 'QA' : 'DEV')

                        // prod/release/pre-release = latest, master = next, feature build = branch name
                        def path = isPreRelease || isValidHotfixBranchRun() ? "/${buildTypes.PRE_RELEASE}" : ''
                        def fileName = isAppRelease || isPreRelease || isHotfixRelease || isValidHotfixBranchRun() ? 'latest' : isMain ? 'next' : sanitizedBranchName
                        def artifactoryTargetPath = "${artifactoryBasePath}/${app}${path}/${fileName}.zip"

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

        stage('Storybook Deployment') {
            when {
                expression {
                    return publishStorybook
                }
            }
            steps {
                echo 'Deploy Storybook to GH-Pages'

                script {
                    // Checkout gh-pages branch and clean folder
                    github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', 'git fetch --all')
                    sh 'git checkout -- .'
                    sh 'git checkout gh-pages'
                    sh 'git reset --hard origin/gh-pages'
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
                        github.executeAsGithubUser('SVC_MONO_FRONTEND_USER', 'git push')
                    } catch (error) {
                        echo 'No changes to commit for storybook deployment'
                        println(error)
                    }
                }
            }
        }

        stage('Cleanup Artifactory') {
            when {
                expression {
                    return isNightly
                }
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'ARTIFACTORY_FRONTEND_MONO_DEPLOYMENTS', passwordVariable: 'TOKEN', usernameVariable: 'USERNAME')]) {
                        def jsonString = sh(
                            script: "curl --silent -H \"Authorization: Bearer ${TOKEN}\" -X GET \"https://artifactory.schaeffler.com/artifactory/api/storage/${artifactoryBasePath}?list&deep=1&depth=10&listFolders=1&mdTimestamps=1&includeRootPath=1\"",
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
                                    sh "curl --silent -H \"Authorization: Bearer ${TOKEN}\" -X DELETE \"https://artifactory.schaeffler.com/artifactory/${artifactoryBasePath}${artifactoryFile.uri}\""
                                }
                            }
                        }
                    }
                }
            }
        }
}

    post {
        always {
            // perform general clean up
            sh 'chmod -R 777 .' // set rights so that the cleanup job can do its work
            cleanWs(deleteDirs: true, disableDeferredWipeout: true)
        }
    }
}
