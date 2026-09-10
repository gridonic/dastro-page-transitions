#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const currentVersion = packageJson.version;
const repo = 'gridonic/dastro-page-transitions';
const installTag = `github:${repo}#v`;

const isDryRun = process.argv.includes('--dry-run');

console.log(`Current version: ${currentVersion}`);
if (isDryRun) {
  console.log('\n🔍 DRY RUN MODE - No commits or tags will be created');
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const collectChangelogEntries = () => {
  return new Promise((resolve) => {
    console.log(
      '\n📝 Please enter changelog entries (one per line, type nothing when finished):',
    );
    const changelogEntries = [];

    const askForEntry = () => {
      rl.question('  - ', (entry) => {
        if (entry.toLowerCase() === '') {
          if (changelogEntries.length === 0) {
            console.log('❌ At least one changelog entry is required!');
            askForEntry();
            return;
          }
          resolve(changelogEntries);
        } else if (entry.trim()) {
          changelogEntries.push(entry.trim());
          askForEntry();
        } else {
          askForEntry();
        }
      });
    };

    askForEntry();
  });
};

const getCommitMessagesSinceLastVersion = () => {
  try {
    const latestTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    }).trim();
    console.log(`\n📋 Commits since ${latestTag}:`);

    const commits = execSync(`git log ${latestTag}..HEAD --oneline`, {
      encoding: 'utf8',
    }).trim();

    if (commits) {
      commits.split('\n').forEach((commit) => {
        console.log(`  ${commit}`);
      });
    } else {
      console.log('  No commits found since last version');
    }
  } catch (error) {
    console.log('📋 No previous version tags found, showing all commits:');
    try {
      const allCommits = execSync('git log --oneline', {
        encoding: 'utf8',
      }).trim();
      if (allCommits) {
        allCommits
          .split('\n')
          .slice(0, 10)
          .forEach((commit) => {
            console.log(`  ${commit}`);
          });
        if (allCommits.split('\n').length > 10) {
          console.log(
            `  ... and ${allCommits.split('\n').length - 10} more commits`,
          );
        }
      }
    } catch (logError) {
      console.log('  Could not retrieve commit history');
    }
  }
  console.log('');
};

const updateChangelog = (newVersion, changelogEntries) => {
  const changelogPath = join(__dirname, '..', 'CHANGELOG.md');
  const currentContent = readFileSync(changelogPath, 'utf-8');

  const newEntry = `### [${newVersion}](https://github.com/${repo}/compare/v${currentVersion}...v${newVersion})\n\n${changelogEntries.map((entry) => `- ${entry}`).join('\n')}\n\n`;
  const updatedContent = newEntry + currentContent;

  writeFileSync(changelogPath, updatedContent);
  console.log(`\n✅ CHANGELOG.md updated with version ${newVersion}`);
};

const updateInstallPins = (newVersion) => {
  const files = [
    join(__dirname, '..', 'README.md'),
    join(__dirname, '..', 'docs/install.instruction.md'),
  ];

  for (const file of files) {
    const current = readFileSync(file, 'utf-8');
    const updated = current.replaceAll(
      `${installTag}${currentVersion}`,
      `${installTag}${newVersion}`,
    );
    if (updated !== current) {
      writeFileSync(file, updated);
      console.log(`\n✅ ${file.replace(join(__dirname, '..') + '/', '')} install tag updated to v${newVersion}`);
    }
  }
};

const runRelease = async () => {
  try {
    console.log('\n🔍 Checking for staged changes...');
    try {
      const stagedFiles = execSync('git diff --cached --name-only', {
        encoding: 'utf8',
      }).trim();
      if (stagedFiles) {
        console.error('❌ There are files already staged for commit!');
        console.error('Please unstage them first with: git reset');
        console.error('Staged files:');
        stagedFiles.split('\n').forEach((file) => console.error(`  - ${file}`));
        rl.close();
        process.exit(1);
      }
      console.log('\n✅ No staged changes found, proceeding...');
    } catch (error) {
      console.log('\n✅ No staged changes found, proceeding...');
    }

    const newVersion = await new Promise((resolve) => {
      rl.question('Enter new version: ', resolve);
    });

    console.log(`New version will be: ${newVersion}`);

    const semverRegex = /^\d+\.\d+\.\d+$/;

    if (!semverRegex.test(newVersion)) {
      console.error(
        '❌ Invalid version format! Please use semantic versioning (e.g., 1.2.3)',
      );
      rl.close();
      process.exit(1);
    }

    const currentParts = currentVersion.split('.').map(Number);
    const newParts = newVersion.split('.').map(Number);

    let isHigher = false;
    for (let i = 0; i < 3; i++) {
      if (newParts[i] > currentParts[i]) {
        isHigher = true;
        break;
      } else if (newParts[i] < currentParts[i]) {
        break;
      }
    }

    if (!isHigher) {
      console.error(
        `❌ New version ${newVersion} is not higher than current version ${currentVersion}!`,
      );
      rl.close();
      process.exit(1);
    }

    console.log(
      `\n✅ Version ${newVersion} is valid and higher than current version ${currentVersion}`,
    );

    console.log('\n🔍 Checking if tag already exists...');
    try {
      execSync(`git rev-parse v${newVersion}`, { stdio: 'pipe' });
      console.error(
        `❌ Tag v${newVersion} already exists! Please choose a different version.`,
      );
      rl.close();
      process.exit(1);
    } catch (tagError) {
      console.log(`\n✅ Tag v${newVersion} does not exist, proceeding...`);
    }

    getCommitMessagesSinceLastVersion();

    const changelogEntries = await collectChangelogEntries(newVersion);

    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - Skipping CHANGELOG.md update');
      console.log(`📋 Would add to CHANGELOG.md:`);
      changelogEntries.forEach((entry) => console.log(`   - ${entry}`));
    } else {
      updateChangelog(newVersion, changelogEntries);
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - Skipping package.json update');
      console.log(`📋 Would update package.json version to: ${newVersion}`);
    } else {
      packageJson.version = newVersion;
      writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
      );
      console.log(`\n✅ Version updated to ${newVersion} in package.json`);
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - Skipping install tag updates');
      console.log(
        `📋 Would update ${installTag}${currentVersion} → ${installTag}${newVersion}`,
      );
    } else {
      updateInstallPins(newVersion);
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - Skipping npm install');
      console.log('📋 Would run: npm install');
    } else {
      console.log('\n🔄 Running npm install to update package-lock.json...');
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✅ package-lock.json updated');
    }

    if (isDryRun) {
      console.log('\n🔍 DRY RUN MODE - Skipping commit and tag creation');
      console.log('📋 Files that would be committed:');
      console.log('   - package.json (version updated)');
      console.log('   - package-lock.json (updated)');
      console.log('   - CHANGELOG.md (updated)');
      console.log('   - README.md (install tag updated)');
      console.log('   - docs/install.instruction.md (install tag updated)');
      console.log(`📋 Would create tag: v${newVersion}`);
      console.log(
        `📋 Would commit with message: "build(${newVersion}): version bump"`,
      );
      console.log('\n🎉 Dry run completed successfully!');
    } else {
      console.log('\n🔄 Committing changes...');
      const commitMessage = `build(${newVersion}): version bump`;
      execSync(
        `git add package.json package-lock.json CHANGELOG.md README.md docs/install.instruction.md`,
        { stdio: 'inherit' },
      );
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      console.log(`\n✅ Changes committed with message: "${commitMessage}"`);

      console.log('\n🔄 Creating Git tag...');
      execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
      console.log(`\n✅ Tag v${newVersion} created successfully`);

      console.log('\n🎉 Release preparation completed successfully!');
      console.log('\n📋 Next steps to release:');
      console.log('   git push');
      console.log('   git push origin v' + newVersion);

      const pushCommands = `git push && git push origin v${newVersion}`;
      try {
        execSync(`echo "${pushCommands}" | pbcopy`, { stdio: 'pipe' });
        console.log(`\n📋 Copied to clipboard: ${pushCommands}`);
      } catch (clipboardError) {
        console.log(
          `\n⚠️  Could not copy to clipboard. Manual command: ${pushCommands}`,
        );
      }
    }
  } catch (error) {
    console.error('❌ Error during release process:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

runRelease();
