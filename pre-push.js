#!/usr/bin/env node

import { $, question } from 'zx';

// Silence zx's default output
$.verbose = false;

async function getGitInfo() {
  try {
    const remote = await $`git remote -v`;
    const branch = await $`git branch --show-current`;
    const status = await $`git status --porcelain`;
    const commitCount = await $`git log --oneline | wc -l`;

    return {
      remote: remote.stdout.trim(),
      branch: branch.stdout.trim(),
      status: status.stdout.trim(),
      commitCount: commitCount.stdout.trim()
    };
  } catch (error) {
    console.error('Error getting git information:',error.message);
    process.exit(1);
  }
}

function displayGitInfo(info) {
  console.log('\n=== Git Push Information ===');
  console.log('\nRemote Repositories:');
  console.log(info.remote);
  console.log('\nCurrent Branch:',info.branch);
  console.log('\nTotal Commits:',info.commitCount);

  if (info.status) {
    console.log('\nUncommitted Changes:');
    console.log(info.status);
  } else {
    console.log('\nNo uncommitted changes');
  }
  console.log('\n==========================\n');
}

async function askForConfirmation() {
  const answer = await question('Do you want to proceed with push? (y/N): ');
  return answer.toLowerCase() === 'y';
}

async function main() {
  const gitInfo = await getGitInfo();
  displayGitInfo(gitInfo);

  const confirmed = await askForConfirmation();
  if (!confirmed) {
    console.log('Push cancelled by user');
    process.exit(1);
  }
}

main();