# Advanced Git Commands & When to Use Them

**Milestone:** 3  
**Issue Number:** #60  
**Date:** 14/09/2026

## `git checkout main -- <file>`

The `git checkout main -- <file>` command restores a specific file to the version that exists on the `main` branch without affecting other files.

### What I Tested

I created a temporary test file called `git-checkout-test.txt` and modified its contents. I then used the checkout command to restore the file from `main`.

![Modified file before restore](screenshots/git-checkout-restore-1.png)

![File restored from main](screenshots/git-checkout-restore-2.png)

### When Would I Use It?

I would use this when I accidentally modify a file and want to restore only that particular file from `main` without affecting other changes in my working directory.

## `git cherry-pick`

`git cherry-pick` applies the changes introduced by a specific commit onto the current branch without merging the entire branch.

I used cherry-pick while bringing the commits from my Git bisect practice into `main`. I used a commit range so that the required bisect commits could be applied to `main`.

![Cherry-pick](screenshots/cherry-pick.png)

### When Would I Use It?

I would use cherry-pick when I need a specific commit from another branch but do not want to merge all the changes from that branch.

## `git log`

`git log` is used to view the commit history of a Git repository. It helps me understand what changes were made and how the repository evolved over time.

I used `git log` with options to view recent commits in a compact format and understand the commit history.

![Git log history](screenshots/git-log-history.png)

### When Would I Use It?

I would use `git log` when investigating previous changes, finding a particular commit, understanding how a feature evolved, or checking the history before debugging an issue.

## `git blame`

`git blame` shows which commit and author last modified each line of a file.

I used `git blame` on `milestone-3/git_understanding.md` to inspect the history of individual lines in the file.

![Git blame](screenshots/git-blame.png)

### When Would I Use It?

I would use `git blame` when I need to understand the history of a particular line, find the commit that introduced a change, or investigate changes in an unfamiliar part of a codebase.

## What Surprised Me While Testing?

- I found it useful that `git checkout main -- <file>` can restore one specific file without affecting other files.
- Cherry-pick is useful when I need a particular commit rather than all the changes from a branch.
- `git log` provides a quick way to understand how the repository has changed over time.
- `git blame` provides line-level history, which can be useful when investigating unfamiliar code.
- These commands are especially useful when working in a long-running repository where many developers are making changes.

## What I Learned

I learned that these Git commands are useful for different situations rather than being interchangeable. Checkout can restore a specific file, cherry-pick can apply selected commits, `git log` helps explore repository history, and `git blame` helps trace changes to individual lines. Understanding when to use each command can make it easier to work with and investigate a larger codebase.
