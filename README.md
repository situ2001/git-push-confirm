# git-push-confirm

A Git pre-push hook utility that shows repository information and asks for confirmation before proceeding with push.

## Example

```bash
=== Git Push Information ===

Remote Repositories:
origin  https://github.com/situ2001/git-push-confirm.git (fetch)
origin  https://github.com/situ2001/git-push-confirm.git (push)

Current Branch: main

Target Remote Branch: origin/main

==========================

Do you want to proceed with push? (y/N): 
```

## Installation

```bash
# Using npm
npm install -D git-push-confirm

# Using yarn
yarn add -D git-push-confirm

# Using pnpm
pnpm add -D git-push-confirm
```

## Setup with Husky

1. Install this package to your project:

```bash
# Using npm
npm install -D git-push-confirm

# Using yarn
yarn add -D git-push-confirm

# Using pnpm
pnpm add -D git-push-confirm
```

2. Install husky if you haven't already:

```bash
# Using npm
npm install husky --save-dev
npx husky init

echo "exec 0< /dev/tty && npx git-push-confirm" > .husky/pre-push

# Using yarn
yarn add husky --dev
yarn husky init

echo "exec 0< /dev/tty && yarn git-push-confirm" > .husky/pre-push

# Using pnpm
pnpm add husky --save-dev
pnpm husky init

echo "exec 0< /dev/tty && pnpm dlx git-push-confirm" > .husky/pre-push
```

## Usage

Once set up, whenever you attempt to push your git repository, the hook will:

1. Display information about your repository
2. Ask for confirmation before proceeding with the push
3. Allow you to cancel the push if needed

By default, you need to type 'y' to confirm the push, or press Enter or type anything else to cancel.

## License

MIT
