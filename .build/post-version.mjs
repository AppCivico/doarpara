import { exec } from 'child_process';
import fs from 'fs';

const packageData = JSON.parse(fs.readFileSync('./package.json'));
const version = packageData.version;
const today = new Date().toISOString().slice(0, 10);
const changelogPath = './CHANGELOG.md';

fs.readFile(changelogPath, 'utf8', (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	const changelogIndex = data.indexOf('Changelog');
	if (changelogIndex !== -1) {
		const newlineIndex = data.indexOf('\n', changelogIndex);
		if (newlineIndex !== -1) {
			const updatedChangelog = data.slice(0, newlineIndex + 1) + `\n## v${version} - ${today}\n` + data.slice(newlineIndex + 1);
			fs.writeFile(changelogPath, updatedChangelog, 'utf8', (err) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log(`Version entry v${version} added to CHANGELOG.md`);
				stageAndAmendCommit([changelogPath], version);
			});
		}
	}
});

function stageAndAmendCommit(filePaths, version) {
	const gitAddCommand = `git add ${filePaths.join(' ')}`;
	const gitCommitCommand = 'git commit --amend --no-edit';
	const gitTagCommand = `git tag -d v${version} && git tag v${version}`;

	exec(`${gitAddCommand} && ${gitCommitCommand} && ${gitTagCommand}`, (error, stdout, stderr) => {
		if (error) {
			console.error(error);
			return;
		}
		console.log(`Staged ${filePaths.join(', ')}, amended to the previous commit, and added git tag v${version}.`);
	});
}
