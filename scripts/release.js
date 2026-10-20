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

if (isDryRun) {
  console.log('\n🔍 DRY RUN MODE - No commits or tags will be created');
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question) =>
  new Promise((resolve) =>
    rl.question(question, (answer) => resolve(answer.trim())),
  );

const bumpVersion = (version, type) => {
  const [major, minor, patch] = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
};

const isHigherVersion = (version) => {
  const currentParts = currentVersion.split('.').map(Number);
  const newParts = version.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (newParts[i] > currentParts[i]) {
      return true;
    } else if (newParts[i] < currentParts[i]) {
      return false;
    }
  }
  return false;
};

const askCustomVersion = async () => {
  const version = await ask('   Enter new version: ');

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    console.error(
      '❌ Invalid version format! Please use semantic versioning (e.g., 1.2.3)',
    );
    return askCustomVersion();
  }

  if (!isHigherVersion(version)) {
    console.error(
      `❌ New version ${version} is not higher than current version ${currentVersion}!`,
    );
    return askCustomVersion();
  }

  return version;
};

const selectVersion = async () => {
  console.log(`\n📦 Current version: v${currentVersion}`);
  console.log('   Select version bump:');
  console.log(`   1) patch  → ${bumpVersion(currentVersion, 'patch')}`);
  console.log(`   2) minor  → ${bumpVersion(currentVersion, 'minor')}`);
  console.log(`   3) major  → ${bumpVersion(currentVersion, 'major')}`);
  console.log(`   4) keep   → ${currentVersion}`);
  console.log('   5) custom → enter a version');

  const choice = await ask('   Choice (1/2/3/4/5, default: 1): ');
  switch (choice) {
    case '2':
      return bumpVersion(currentVersion, 'minor');
    case '3':
      return bumpVersion(currentVersion, 'major');
    case '4':
      return currentVersion;
    case '5':
      return askCustomVersion();
    default:
      return bumpVersion(currentVersion, 'patch');
  }
};

const confirmPush = async (version) => {
  const pushCommands = `git push && git push origin v${version}`;

  if (isDryRun) {
    console.log(`\n🔍 DRY RUN MODE - Would ask to run: ${pushCommands}`);
    return;
  }

  const answer = await ask(`\n🚀 Run "${pushCommands}"? (yes/no): `);
  if (!['y', 'yes'].includes(answer.toLowerCase())) {
    console.log(`\n⏸️  Not pushed. To push later: ${pushCommands}`);
    return;
  }

  execSync('git push', { stdio: 'inherit' });
  execSync(`git push origin v${version}`, { stdio: 'inherit' });
  console.log(`\n✅ Pushed main and tag v${version}`);
};

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

    const newVersion = await selectVersion();
    const isKeep = newVersion === currentVersion;

    if (isKeep) {
      console.log(`\n✅ Keeping version ${currentVersion}, nothing to bump`);
      await confirmPush(currentVersion);
      return;
    }

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
      await confirmPush(newVersion);
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

      await confirmPush(newVersion);
    }
  } catch (error) {
    console.error('❌ Error during release process:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

runRelease();
