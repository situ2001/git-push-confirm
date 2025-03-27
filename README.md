# git-push-confirm

A Git pre-push hook utility that shows repository information and asks for confirmation before proceeding with push.

## Features

- Displays remote repository information
- Shows current branch
- Indicates total number of commits
- Shows any uncommitted changes
- Asks for confirmation before pushing

## Installation

```bash
# Using npm
npm install git-push-confirm

# Using yarn
yarn add git-push-confirm

# Using pnpm
pnpm add git-push-confirm
```

## Setup with Husky

1. Install husky if you haven't already:

```bash
# Using npm
npm install husky --save-dev
npm run prepare

# Using yarn
yarn add husky --dev
yarn prepare

# Using pnpm
pnpm add husky --save-dev
pnpm prepare
```

2. Create a pre-push hook:

```bash
npx husky add .husky/pre-push "npx git-push-confirm"
```

## Usage

Once set up, whenever you attempt to push your git repository, the hook will:

1. Display information about your repository
2. Ask for confirmation before proceeding with the push
3. Allow you to cancel the push if needed

By default, you need to type 'y' to confirm the push, or press Enter or type anything else to cancel.

## License

MIT
