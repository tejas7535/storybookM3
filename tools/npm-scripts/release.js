const execSync = require('child_process').execSync;

const arg = process.argv[2];

execSync(`cd ${arg} && standard-version --no-verify\""`, { stdio: [0, 1, 2] });
