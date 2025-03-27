#!/usr/bin/env node

import { $,question } from 'zx';
import pc from 'picocolors';
import { createInterface } from 'node:readline';

// Silence zx's default output
$.verbose = false;

async function getGitInfo() {
  try {
    const remote = await $`git remote -v`;
    const branch = await $`git branch --show-current`;

    // Get the configured push destination if available
    let targetBranch = "";
    try {
      // Get the push destination for the current branch
      const currentRemote = await $`git config --get branch.${branch.stdout.trim()}.remote`;
      const remoteBranch = await $`git config --get branch.${branch.stdout.trim()}.merge`;
      if (currentRemote.stdout.trim() && remoteBranch.stdout.trim()) {
        // Convert refs/heads/main to just main
        const branchName = remoteBranch.stdout.trim().replace("refs/heads/","");
        targetBranch = `${currentRemote.stdout.trim()}/${branchName}`;
      }
    } catch (e) {
      // If there's an error, the branch might not have an upstream set
      targetBranch = "";
    }

    return {
      remote: remote.stdout.trim(),
      branch: branch.stdout.trim(),
      targetBranch
    };
  } catch (error) {
    console.error(pc.red('Error getting git information:'),error.message);
    process.exit(1);
  }
}

// Read and process stdin from Git pre-push hook
async function readPushRefsFromGitHook() {
  if (process.stdin.isTTY) {
    return [];
  }

  // Create an input stream
  const rl = createInterface({
    input: process.stdin,
    terminal: false
  });

  const refs = [];

  return new Promise(resolve => {
    rl.on('line',(line) => {
      if (line.trim() !== '') {
        refs.push(line);
      }
    });

    rl.once('close',() => {
      resolve(refs);
    });

    // Add a timeout in case stdin doesn't close properly
    setTimeout(() => {
      rl.close();
    },1000);
  });
}

function displayGitInfo(info,pushRefs) {
  console.log(pc.bold('\n=== Git Push Information ==='));

  console.log(pc.cyan('\nRemote Repositories:'));
  console.log(pc.red(info.remote));

  console.log(pc.cyan('\nCurrent Branch:'),pc.red(info.branch));

  if (info.targetBranch) {
    console.log(pc.cyan('\nTarget Remote Branch:'),pc.red(info.targetBranch));
  } else {
    console.log(pc.cyan('\nTarget Remote Branch:'),pc.yellow('Not configured'));
  }

  if (pushRefs.length > 0) {
    console.log(pc.cyan('\nPush Details:'));
    pushRefs.forEach(ref => {
      console.log(pc.magenta(ref));
    });
  } else {
    console.log(pc.cyan('\nPush Details:'),pc.yellow('No refs to push'));
  }

  console.log(pc.bold('\n==========================\n'));
}

async function askForConfirmation() {
  const answer = await question(pc.yellow('Do you want to proceed with push? ') + pc.gray('(y/') + pc.bold('N') + pc.gray('): '));
  return answer.toLowerCase() === 'y';
}

async function main() {
  // exec 0< /dev/tty
  await $`exec 0< /dev/tty`;

  const pushRefs = await readPushRefsFromGitHook();
  const gitInfo = await getGitInfo();
  displayGitInfo(gitInfo,pushRefs);

  const confirmed = await askForConfirmation();
  if (!confirmed) {
    console.log(pc.blue('Push cancelled by user'));
    process.exit(1);
  }
}

main();