/**
 * This file sets you up with with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */
// NOTE: The rule will be available in ESLint configs as "@nrwl/nx/workspace/gq-scoped-import"

import { ESLintUtils } from '@typescript-eslint/utils';
import { readdirSync, statSync } from 'fs';
export const RULE_NAME = 'gq-scoped-import';

function getDirectories(path: string) {
  return readdirSync(path).filter(function (file) {
    return statSync(path + '/' + file).isDirectory();
  });
}

var scopedPaths = getDirectories('./apps/gq/src/app').map((e) => '../' + e);
const scopedPathsRegex = new RegExp(`(${scopedPaths.join('|')})`, 'g');

export const rule = ESLintUtils.RuleCreator(() => __filename)({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: `Use scoped imports`,
      recommended: 'error',
    },
    schema: [],
    messages: {
      errorScopedImports: 'Use scoped import (@gq) for project files',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration: function (node) {
        if (scopedPaths.some((path) => node.source.value.includes(path))) {
          context.report({
            node,
            messageId: 'errorScopedImports',
            fix: (fixer) => {
              var importPath = node.source.value.split(scopedPathsRegex);
              var newImportPath = importPath[1].substring(2) + importPath[2];

              return fixer.replaceText(
                node,
                node.specifiers
                  .map(
                    (specifier) =>
                      `import { ${specifier.local.name} } from '@gq${newImportPath}';`
                  )
                  .join('\n')
              );
            },
          });
        }
      },
    };
  },
});
