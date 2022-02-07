#!/usr/bin/env node

const stdin = process.stdin,
  stdout = process.stdout,
  inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  inputChunks.push(chunk);
});

stdin.on('end', function () {
  const audit = JSON.parse(inputChunks.join(''));
  const vulnerabilities = audit.vulnerabilities;

  const issues = Object.entries(vulnerabilities).flatMap(
    ([_, vulnerability]) => {
      return vulnerability.via
        .filter(
          (via) => typeof via !== 'string' && via.hasOwnProperty('source')
        )
        .flatMap((via) => {
          const issue = {
            action: 'update',
            package: vulnerability.name,
            severity: via.severity,
            recommendation: '-',
            description: via.title,
            link: via.url,
            path: vulnerability.name,
            breaking: 'unknown',
          };
          return getAffectedPackages(
            vulnerabilities,
            [vulnerability.name],
            vulnerability.effects || [],
            issue
          );
        });
    }
  );

  issues.forEach((issue) => {
    stdout.write(
      [
        issue.action,
        issue.package,
        issue.severity,
        issue.recommendation,
        issue.description,
        issue.link,
        issue.path,
        issue.breaking,
      ].join('\t') + '\n'
    );
  });
});

function getAffectedPackages(vulnerabilities, sourcePath, effects, issue) {
  if (effects.length == 0) {
    return issue;
  }

  return effects.flatMap((effect) =>
    getAffectedPackages(
      vulnerabilities,
      sourcePath.concat([vulnerabilities[effect].name]),
      vulnerabilities[effect].effects.filter(
        (item) => sourcePath.indexOf(item) <= 0
      ),
      Object.assign({}, issue, { path: effect + '>' + issue.path })
    )
  );
}
