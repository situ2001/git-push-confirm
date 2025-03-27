#!/usr/bin/env node

import { $, question } from 'zx';
import pc from 'picocolors';

// Silence zx's default output
$.verbose = false;

async function getGitInfo() {
  try {
    const remote = await $`git remote -v`;
    const branch = await $`git branch --show-current`;
    const status = await $`git status --porcelain`;
    const commitCount = await $`git log --oneline | wc -l`;
    
    // Get the configured push destination if available
    let targetBranch = "";
    try {
      // Get the push destination for the current branch
      const currentRemote = await $`git config --get branch.${branch.stdout.trim()}.remote`;
      const remoteBranch = await $`git config --get branch.${branch.stdout.trim()}.merge`;
      if (currentRemote.stdout.trim() && remoteBranch.stdout.trim()) {
        // Convert refs/heads/main to just main
        const branchName = remoteBranch.stdout.trim().replace("refs/heads/", "");
        targetBranch = `${currentRemote.stdout.trim()}/${branchName}`;
      }
    } catch (e) {
      // If there's an error, the branch might not have an upstream set
      targetBranch = "";
    }

    return {
      remote: remote.stdout.trim(),
      branch: branch.stdout.trim(),
      status: status.stdout.trim(),
      commitCount: commitCount.stdout.trim(),
      targetBranch
    };
  } catch (error) {
    console.error(pc.red('Error getting git information:'), error.message);
    process.exit(1);
  }
}

function displayGitInfo(info) {
  console.log(pc.bold('\n=== Git Push Information ==='));
  
  console.log(pc.cyan('\nRemote Repositories:'));
  console.log(pc.red(info.remote));
  
  console.log(pc.cyan('\nCurrent Branch:'), pc.red(info.branch));
  
  if (info.targetBranch) {
    console.log(pc.cyan('\nTarget Remote Branch:'), pc.red(info.targetBranch));
  } else {
    console.log(pc.cyan('\nTarget Remote Branch:'), pc.yellow('Not configured'));
  }
  
  console.log(pc.cyan('\nTotal Commits:'), pc.yellow(info.commitCount));
  
  if (info.status) {
    console.log(pc.cyan('\nUncommitted Changes:'));
    console.log(pc.gray(info.status));
  } else {
    console.log(pc.cyan('\nUncommitted Changes:'), pc.green('None'));
  }
  
  console.log(pc.bold('\n==========================\n'));
}

async function askForConfirmation() {
  const answer = await question(pc.yellow('Do you want to proceed with push? ') + pc.gray('(y/') + pc.bold('N') + pc.gray('): '));
  return answer.toLowerCase() === 'y';
}

async function main() {
  const gitInfo = await getGitInfo();
  displayGitInfo(gitInfo);

  const confirmed = await askForConfirmation();
  if (!confirmed) {
    console.log(pc.blue('Push cancelled by user'));
    process.exit(1);
  }
}

main();