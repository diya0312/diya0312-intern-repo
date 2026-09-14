# Writing Meaningful Commit Messages

**Milestone:** 3  
**Issue Number:** #62  
**Date:** 14/09/2026

## Goal

Learn how to write clear and meaningful Git commit messages and understand why they are useful when working in a team.

## Research

I looked at the commit history of the React open-source project to see how real projects write commit messages.

![React commit history](screenshots/react-commit-history.png)

These messages are useful because they clearly describe the area affected and what was changed. I did not find a clearly bad commit message in the examples I looked at. Instead, I used simple messages in my own repository to demonstrate different styles.

## What Makes a Good Commit Message?

A good commit message should:

- Clearly describe the main change.
- Be short and easy to understand.
- Give enough context about what the commit is for.
- Follow a consistent style.
- Make the Git history easier to understand later.

## How Does a Clear Message Help Team Collaboration?

- Team members can quickly understand what was changed.
- It makes code reviews easier.
- It helps when debugging or looking through old commits.
- It makes it easier to find a commit related to a particular change.
- It reduces the need to inspect every commit's code changes just to understand its purpose.

## How Can Poor Commit Messages Cause Problems?

- Vague messages do not explain what was changed.
- It becomes harder to understand the project history.
- Finding a particular change later becomes difficult.
- Debugging and reviewing changes can take more time.
- Overly detailed messages can hide the main purpose of a small change.

## Commit Styles

I created a small file called `commit-message-practice.txt` in my `milestone-3` folder and made three commits with different message styles.

### 1. Vague Commit Message

I created the file and committed it using:

`fixed`

This is vague because it does not explain what was fixed or changed.

### 2. Overly Detailed Commit Message

I added another line to the file and used a deliberately long commit message:

`Updated the commit message practice file by adding a second line that explains that this line was added specifically to demonstrate how an overly detailed commit message can contain unnecessary information about a very small change`

This contains much more information than necessary for such a small change, making the main purpose harder to see quickly.

### 3. Clear Commit Message

I added a third line and committed it using:

`Add clear commit message example`

This is more useful because it is short and clearly describes the purpose of the change.

![Three commit message examples](screenshots/commit-message-history.png)

## What I Learned

- Commit messages are an important part of a project's history.
- A vague message can make changes difficult to understand later.
- A very long message can make a simple change harder to understand.
- A good commit message should clearly communicate the purpose of the change without unnecessary detail.
- Looking at commit histories from real open-source projects helped me understand how meaningful messages are used in practice.