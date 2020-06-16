import { strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
} from '@angular-devkit/schematics';

import {
  NxJson,
  projectRootDir,
  ProjectType,
  toFileName,
  updateJsonInTree,
  updateWorkspace,
} from '@nrwl/workspace';

import {
  getBuildConfigurations,
  getCypressReportConfiguration,
  getE2eConfigurations,
  getServeConfigurations,
  getStandardVersionConfigurations,
  getTsLintRules,
} from './config';
import { NewAppSchematicSchema } from './schema';

interface NormalizedSchema extends NewAppSchematicSchema {
  dasherizedName: string;
  projectName: string;
  projectRoot: string;
  pathToRoot: string;
}

function updateTsLintConfiguration(options: NormalizedSchema): Rule {
  return updateJsonInTree(
    `${options.projectRoot}/tslint.json`,
    (json, context) => {
      context.logger.info('Updating the TSLint Configuration for you...');

      const rules = getTsLintRules(options.dasherizedName);

      return { ...json, rules };
    }
  );
}

function updateIndexHtml(options: NormalizedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Updating the index.html for you...');

    const content: Buffer | null = tree.read(
      `${options.projectRoot}/src/index.html`
    );
    let strContent = '';
    if (content) {
      strContent = content.toString();
    }

    const updatedContent = strContent.replace(
      '<schaeffler-root></schaeffler-root>',
      `<${options.dasherizedName}-root></${options.dasherizedName}-root>`
    );

    tree.overwrite(`${options.projectRoot}/src/index.html`, updatedContent);

    return tree;
  };
}

function updateCodeowners(options: NormalizedSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Updating the CODEOWNERS for you...');

    const content: Buffer | null = tree.read('CODEOWNERS');
    let strContent: string = '';
    if (content) {
      strContent = content.toString();
    }

    const appendIndex = strContent.indexOf(
      '############\n### Libs ###\n############'
    );
    const contentToAppend = `# ${options.dasherizedName.toUpperCase()}\n${
      options.projectRoot
    } ${options.codeOwners} \n${options.projectRoot}-e2e ${
      options.codeOwners
    } \n\n`;

    const updatedContent =
      strContent.slice(0, appendIndex) +
      contentToAppend +
      strContent.slice(appendIndex);

    tree.overwrite('CODEOWNERS', updatedContent);

    return tree;
  };
}

function updateNxJson(options: NormalizedSchema): Rule {
  return updateJsonInTree(`/nx.json`, (json: NxJson, context: any) => {
    context.logger.info('Updating the dependency graph for you...');

    const project = json.projects[options.projectName];
    project.implicitDependencies = ['shared-styles'];

    const resultJson = {
      ...json,
      projects: {
        ...json.projects,
        [options.projectName]: project,
      },
    };

    return resultJson;
  });
}

function updateDeploymentJson(options: NormalizedSchema): Rule {
  return updateJsonInTree(`/deployments.json`, (json: any, context: any) => {
    context.logger.info('Updating the deployment.json file for you...');

    const resultJson = {
      ...json,
      [options.projectName]: options.deploymentJob,
    };

    return resultJson;
  });
}

function updateWorkspaceFile(options: NormalizedSchema): Rule {
  return (_host: Tree, context: SchematicContext) => {
    context.logger.info('Updating Application Settings for you...');

    return updateWorkspace((workspace) => {
      const appConfiguration = workspace.projects.get(options.projectName);
      // Add icons to styles array
      const styles = appConfiguration.targets.get('build').options[
        'styles'
      ] as string[];

      styles.push('node_modules/schaeffler-icons/style.css');

      // Add style preprocessor options
      appConfiguration.targets.get('build').options[
        'stylePreprocessorOptions'
      ] = {
        includePaths: ['libs/shared/styles/src'],
      };

      // adjust build configurations
      appConfiguration.targets.get(
        'build'
      ).configurations = getBuildConfigurations(`${options.projectRoot}`);

      // adjust serve configurations
      appConfiguration.targets.get(
        'serve'
      ).configurations = getServeConfigurations(options.projectName);

      // adjust e2e configurations
      const e2eConfiguration = workspace.projects.get(
        `${options.projectName}-e2e`
      );

      // add standard-version configuration
      appConfiguration.targets.set(
        'standard-version',
        getStandardVersionConfigurations(`${options.projectRoot}`)
      );

      e2eConfiguration.targets.get('e2e').configurations = getE2eConfigurations(
        options.projectName
      );
    });
  };
}

function updateCypressConfiguration(options: NormalizedSchema): Rule {
  return updateJsonInTree(
    `${options.projectRoot}-e2e/cypress.json`,
    (json: any, context: SchematicContext) => {
      context.logger.info('Updating the cypress configuration for you...');

      return { ...json, ...getCypressReportConfiguration(options.projectName) };
    }
  );
}

function addFiles(options: NormalizedSchema): Rule {
  return (_host: Tree, context: SchematicContext) => {
    context.logger.log('info', 'Preparing some additional files for you ...');

    const sourceTemplatesForApp = mergeWith(
      apply(url(`./files/app`), [
        applyTemplates({
          ...strings,
          ...options,
          capsify,
        }),
        move(`${options.projectRoot}/src`),
      ]),
      MergeStrategy.Overwrite
    );

    const sourceTemplateForE2eApp = mergeWith(
      apply(url(`./files/e2e-app`), [
        applyTemplates({
          ...strings,
          ...options,
          capsify,
        }),
        move(`${options.projectRoot}-e2e/src`),
      ]),
      MergeStrategy.Overwrite
    );

    return chain([sourceTemplatesForApp, sourceTemplateForE2eApp]);
  };
}

function addStandardVersion(options: NormalizedSchema): Rule {
  return (_host: Tree, context: SchematicContext) => {
    context.logger.log(
      'info',
      'Preparing configuration for standard version...'
    );

    const sourceTemplate = mergeWith(
      apply(url(`./files/standard-version`), [
        applyTemplates({
          ...strings,
          ...options,
        }),
        move(`${options.projectRoot}`),
      ]),
      MergeStrategy.Overwrite
    );

    return sourceTemplate;
  };
}

function capsify(value: string): string {
  return value.toUpperCase();
}

function normalizeOptions(options: NewAppSchematicSchema): NormalizedSchema {
  const projectType = ProjectType.Application;

  const dasherizedName = strings.dasherize(options.name);
  const projectDirectory = toFileName(options.name);
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
  const pathToRoot = projectRoot.replace(
    new RegExp('.+(?=/)|(?<=/).+', 'g'),
    '..'
  );

  return {
    ...options,
    dasherizedName,
    projectName,
    projectRoot,
    pathToRoot,
  };
}

export default function (options: NewAppSchematicSchema): Rule {
  return (_host: Tree, context: SchematicContext): Rule => {
    context.logger.info(`Generating your new app ${options.name}`);

    const normalizedOptions = normalizeOptions(options);

    return chain([
      externalSchematic('@nrwl/angular', 'application', {
        name: options.name,
        routing: false,
        style: 'scss',
      }),
      updateCodeowners(normalizedOptions),
      updateDeploymentJson(normalizedOptions),
      updateNxJson(normalizedOptions),
      updateWorkspaceFile(normalizedOptions),
      updateCypressConfiguration(normalizedOptions),
      updateTsLintConfiguration(normalizedOptions),
      updateIndexHtml(normalizedOptions),
      addFiles(normalizedOptions),
      addStandardVersion(normalizedOptions),
    ]);
  };
}
