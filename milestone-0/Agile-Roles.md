# Roles in an Agile Team  

**Milestone:** 0  
**Issue Number:** #7  
**Date:** 21/10/2026  

## Key Roles in an Agile Team

- **Developers**
  - Design, build and maintain the product (frontend, backend, mobile).
  - Break work into tasks, write code and tests, review each other's code, and fix bugs.
  - Keep their tasks on the board up to date.
- **QA (Quality Assurance)**
  - Make sure the product works as expected before it reaches users.
  - Write test cases, test new features and look for edge cases.
  - Report bugs clearly so developers can reproduce and fix them.
  - Often push for automated tests and good test coverage.
- **Product Manager (PM)**
  - Decides **what** to build and **why**, based on users, data and business goals.
  - Owns and prioritises the **backlog**.
  - Writes or approves requirements and acceptance criteria.
  - Talks to stakeholders and users.
- **Agile Project Manager (Agile PM) / Scrum Master**
  - Looks after **how** the team works, not what it builds.
  - Runs or facilitates ceremonies (stand-ups, retrospectives, planning).
  - Removes blockers and protects the team from distractions.
  - Keeps the board healthy, e.g. WIP limits and nothing stuck in "Blocked".
- **Other supporting roles**
  - **Stakeholders:** founders, management or partners who care about the result and give direction.
  - **UX / UI designers:** research users and design screens and flows.
  - **Customer support:** hear directly from users and turn complaints and bug reports into backlog items.
  - **DevOps:** build pipelines, deployments and infrastructure.

## How Roles Collaborate in Kanban vs Scrum

- **Scrum**
  - Fixed roles: Product Owner (similar to PM), Scrum Master, and Developers (which includes QA).
  - Collaboration happens mainly at set ceremonies: Sprint Planning, Daily Stand-up, Review and Retrospective.
  - The Product Owner fixes the sprint scope, and the team commits to it for the sprint.
- **Kanban**
  - **No required roles**. The team keeps its existing job titles.
  - Collaboration happens **continuously around the board**:
    - the PM keeps the backlog prioritised
    - developers pull the next item
    - QA and reviewers pick up items in "Ready for Review"
  - Handoffs are visible as cards moving between columns, so less coordination is needed in meetings.
  - Fits well with remote teams, because the board shows everyone's status at any time.

## Reflection

### What is my role, and how does it contribute to the Agile process?

- I'm a **backend development intern** at Focus Bear, working remotely.
- Right now I'm in onboarding: I learn the backend stack (NestJS, TypeORM, PostgreSQL, Redis/BullMQ, Auth0, Jest) by completing tasks as GitHub issues.
- **How I contribute:**
  - I pick up an issue, build it, test it, and submit evidence (code, screenshots and an .md write-up).
  - I keep my issue status up to date, so progress is visible.
  - I respond to review feedback and resubmit. This is the same loop real backend work goes through: build → review → fix → done.
- Later, my backend work (APIs, background jobs, tests) will support the features that the product and frontend/mobile teams build on.

### How do my responsibilities overlap or interact with other roles?

- **With QA / reviewers:** my work is checked before it counts as done. During onboarding, the **Focus Bear review bot** plays this role: it checks my issues for accuracy and evidence, and asks for changes. Writing tests (Jest, Supertest) also overlaps with QA's job of keeping quality high.
- **With the PM / supervisor:** they decide priorities (which issues and milestones come first), and I follow that order and flag when I'm blocked.
- **With other developers:** backend APIs are used by frontend and mobile developers, so clear endpoints, error messages and documentation matter.
- **With customer support:** bugs reported by users can become backend tasks for me.

## Task

### How my role fits into the Agile team

- I'm a developer in a Kanban-style flow. I **pull** a task from my backlog (an open issue), move it to **in progress**, finish it with tests and evidence, then send it for **review**.
- My job is to turn prioritised tasks into **working, tested backend code** and keep my status visible, so the team always knows where things stand.

### One role I collaborate with and how to improve teamwork

- **Role: QA / reviewer.** In my onboarding, this is the review bot that approves or rejects my issues.
- **What I learned:** some of my issues were rejected because:
  - the evidence didn't fully match the task (e.g. a screenshot that didn't match the code in the repo)
  - a reflection question wasn't answered directly
- **How I'll improve teamwork with this role:**
  - Read the **acceptance criteria** (the issue checklist) before starting, and check each item off against my work before submitting.
  - Make sure every screenshot matches the code that's actually pushed.
  - Answer each reflection question **directly**, under its own heading.
  - When I get feedback, fix exactly what was asked and reply with a short note on what changed.
  - This means fewer rejection rounds, which saves time for both me and the reviewer.
