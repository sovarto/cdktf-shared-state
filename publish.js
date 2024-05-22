const {execSync} = require('child_process');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

function deleteFolder(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, {recursive: true, force: true});
    }
}

function copyAssets(source, target, patterns, ignorePatterns) {
    patterns.forEach(pattern => {
        // Use glob to find all files in the source directory matching the pattern, including subdirectories
        const patternPath = `${source}/**/${pattern}`;
        const files = glob.sync(patternPath, {nodir: true, ignore: ignorePatterns.map(x => `${source}/**/${x}`)});

        files.forEach(file => {
            // Make the file path relative to the source
            const relativePath = path.relative(source, file);

            // Construct the target file path
            const targetFile = path.join(target, relativePath);

            // Ensure the directory structure of the target file exists
            fs.ensureDirSync(path.dirname(targetFile));

            // Copy file from source to target
            fs.copySync(file, targetFile);
        });
    });
}

deleteFolder(path.resolve(__dirname, 'dist'));

execSync('npm run build', {stdio: 'inherit'});
copyAssets('./src', './dist', ['*'], ['*.ts', '*.ts.bak']);
let packageJson = require('./package.json');
delete packageJson.scripts.prepublishOnly;
fs.writeFileSync('./dist/package.json', JSON.stringify(packageJson, null, 2));
process.chdir('dist');
execSync('npm publish', {stdio: 'inherit'});
