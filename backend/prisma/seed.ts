import { PrismaClient, MilestoneStatus, SprintStatus, Status, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding milestone and agile data...');

  // Create Milestone
  const milestone = await prisma.milestone.create({
    data: {
      title: 'Milestone 1: Core Platform Foundation',
      description: 'Ship agile tracking platform with milestones, sprints, and 2-click task progress updates.',
      targetDate: new Date('2026-04-30T23:59:59.000Z'),
      status: MilestoneStatus.IN_PROGRESS,
    },
  });

  // Create Sprints
  const sprint1 = await prisma.sprint.create({
    data: {
      name: 'Sprint 1 - Authentication & Project Shell',
      goal: 'Deliver landing milestone view and agile creation dialogs.',
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-14T23:59:59.000Z'),
      status: SprintStatus.ACTIVE,
      milestoneId: milestone.id,
    },
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      name: 'Sprint 2 - Velocity & Sprint Planning',
      goal: 'Allow drag-and-drop / 2-click task progress transitions and sprint allocation.',
      startDate: new Date('2026-03-15T00:00:00.000Z'),
      endDate: new Date('2026-03-28T23:59:59.000Z'),
      status: SprintStatus.PLANNED,
      milestoneId: milestone.id,
    },
  });

  // Create Epic using "As a ..., I want to ..., so that..."
  const epic = await prisma.epic.create({
    data: {
      title: 'Milestone & Agile Tracking Workflow',
      role: 'Project Lead',
      want: 'monitor cross-team milestone completion and sprint health in real-time',
      soThat: 'stakeholders have transparent visibility into project delivery timelines',
      description: 'Central hub for tracking epics, user stories, tasks, and acceptance criteria.',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      milestoneId: milestone.id,
    },
  });

  // Create Story using "As a ..., I want to ..., so that..."
  const story = await prisma.story.create({
    data: {
      title: '2-Click Task Progress Management',
      role: 'Software Engineer',
      want: 'update task status from TODO to DONE within 2 clicks directly on the milestone dashboard',
      soThat: 'I can keep sprint progress accurate without navigating through deeply nested menus',
      description: 'Fast status change action bar and dropdown.',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      epicId: epic.id,
    },
  });

  // Create Tasks using "As a ..., I want to ..., so that..."
  const task1 = await prisma.task.create({
    data: {
      title: 'Implement Milestone Progress Calculation',
      role: 'Backend Engineer',
      want: 'calculate milestone percentage based on completed tasks across all linked stories and sprints',
      soThat: 'the dashboard displays authentic progress metrics',
      status: Status.DONE,
      priority: Priority.HIGH,
      storyId: story.id,
      sprintId: sprint1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement 2-Click Status Transition Dropdown',
      role: 'Frontend Engineer',
      want: 'click a status badge and immediately select the new status from a clean menu',
      soThat: 'task progress changes in exactly 2 clicks',
      status: Status.IN_PROGRESS,
      priority: Priority.CRITICAL,
      storyId: story.id,
      sprintId: sprint1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Sprint Creation & Task Assignment Dialog',
      role: 'Scrum Master',
      want: 'create sprints and allocate backlog tasks to active iterations',
      soThat: 'the team commits to clear sprint backlogs',
      status: Status.TODO,
      priority: Priority.MEDIUM,
      storyId: story.id,
      sprintId: sprint2.id,
    },
  });

  // Create Acceptance Criteria using "Given ..., When ..., Then ..."
  await prisma.acceptanceCriterion.create({
    data: {
      given: 'a user is viewing the Milestone Landing Page',
      when: 'the user clicks a task status badge and picks "DONE"',
      then: 'the task status transitions immediately and milestone progress recalculates within 2 clicks',
      isMet: true,
      taskId: task2.id,
      storyId: story.id,
    },
  });

  await prisma.acceptanceCriterion.create({
    data: {
      given: 'a user opens the create task form',
      when: 'the user inspects any input fill box',
      then: 'each fill box displays helpful example sentences in gray placeholder/helper text',
      isMet: true,
      taskId: task2.id,
      storyId: story.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
