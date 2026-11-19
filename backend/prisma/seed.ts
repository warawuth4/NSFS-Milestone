import { PrismaClient, MilestoneStatus, SprintStatus, Status, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding sleeping score dashboard milestone and agile data...');

  // Create Milestone
  const milestone = await prisma.milestone.create({
    data: {
      title: 'Milestone 1: Sleep Score Dashboard & Circadian Analytics Engine',
      description: 'Ship comprehensive sleeping score tracking platform with biometric calculation, nocturnal hypnograms, and 2-click task progress progression.',
      targetDate: new Date('2026-04-30T23:59:59.000Z'),
      status: MilestoneStatus.IN_PROGRESS,
    },
  });

  // Create Sprints
  const sprint1 = await prisma.sprint.create({
    data: {
      name: 'Sprint 1 - Biometric Ingestion & Sleep Score Algorithm',
      goal: 'Deliver 0-100 sleep score formula, landing milestone overview, and 2-click task progress transitions.',
      startDate: new Date('2026-03-01T00:00:00.000Z'),
      endDate: new Date('2026-03-14T23:59:59.000Z'),
      status: SprintStatus.ACTIVE,
      milestoneId: milestone.id,
    },
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      name: 'Sprint 2 - Nocturnal Hypnogram & Stage Distribution Charts',
      goal: 'Visualize deep, REM, and light sleep stages and calculate personal sleep debt benchmarks.',
      startDate: new Date('2026-03-15T00:00:00.000Z'),
      endDate: new Date('2026-03-28T23:59:59.000Z'),
      status: SprintStatus.PLANNED,
      milestoneId: milestone.id,
    },
  });

  // Create Epic using "As a ..., I want to ..., so that..."
  const epic = await prisma.epic.create({
    data: {
      title: 'Sleep Score Health & Circadian Rhythm Analytics Engine',
      role: 'wellness enthusiast and wearable device user',
      want: 'view my holistic daily sleep score and sleep stage breakdown in a centralized health dashboard',
      soThat: 'I can understand factors disrupting my deep sleep and optimize my nighttime recovery habits',
      description: 'Consolidates biometric sleep duration, sleep efficiency percentages, and circadian rhythm trends.',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      milestoneId: milestone.id,
    },
  });

  // Create Story using "As a ..., I want to ..., so that..."
  const story = await prisma.story.create({
    data: {
      title: 'Nocturnal Sleep Stage Hypnogram & Restorative Score Gauge',
      role: 'insomnia patient tracking sleep hygiene',
      want: 'visualize the ratio of REM, deep, and light sleep compared to clinical benchmarks',
      soThat: 'I can identify wakefulness interruptions and discuss actionable trends with my sleep physician',
      description: 'Renders time-series hypnogram bar charts and calculates deep sleep target thresholds.',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      epicId: epic.id,
    },
  });

  // Create Tasks using "As a ..., I want to ..., so that..."
  const task1 = await prisma.task.create({
    data: {
      title: 'Compute Weighted 0-100 Sleep Score Algorithm',
      role: 'health data engineer',
      want: 'compute weighted 0-100 sleep scores combining total sleep time, heart rate variability, and tossing frequency',
      soThat: 'the frontend dashboard renders accurate score gauges within 200 milliseconds of device sync',
      status: Status.DONE,
      priority: Priority.CRITICAL,
      storyId: story.id,
      sprintId: sprint1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement 2-Click Task Progress Dropdown on Milestone Dashboard',
      role: 'frontend engineer',
      want: 'change task progress directly from the milestone page in 2 clicks',
      soThat: 'our project milestone completion percentage updates immediately',
      status: Status.DONE,
      priority: Priority.HIGH,
      storyId: story.id,
      sprintId: sprint1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Sleep Stage Breakdown & REM Progression Chart Widget',
      role: 'data visualization specialist',
      want: 'render interactive hypnograms displaying duration in deep sleep, REM, and light sleep',
      soThat: 'users can quickly inspect their restorative sleep architecture on the dashboard',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      storyId: story.id,
      sprintId: sprint1.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Sleep Debt & Circadian Rhythm Calibration',
      role: 'sleep science researcher',
      want: 'calculate accumulated weekly sleep debt based on personal biological sleep targets',
      soThat: 'the score gauge warns users when chronic sleep deficit requires weekend recovery sleep',
      status: Status.TODO,
      priority: Priority.MEDIUM,
      storyId: story.id,
      sprintId: sprint2.id,
    },
  });

  // Create Acceptance Criteria using "Given ..., When ..., Then ..."
  await prisma.acceptanceCriterion.create({
    data: {
      given: 'an authenticated user has synchronized 420 minutes of nocturnal wearable sleep logs',
      when: 'the calculation engine completes analyzing deep sleep duration, awake minutes, and heart rate dip',
      then: 'the sleeping score dashboard renders a circular score gauge between 0 and 100 with restorative tier categorization',
      isMet: true,
      taskId: task1.id,
      storyId: story.id,
    },
  });

  await prisma.acceptanceCriterion.create({
    data: {
      given: 'a user inspecting tasks on the sleep score milestone overview',
      when: 'the user clicks the progress status badge and selects "DONE"',
      then: 'the task status transitions and the milestone completion percentage updates within exactly 2 clicks',
      isMet: true,
      taskId: task2.id,
      storyId: story.id,
    },
  });

  await prisma.acceptanceCriterion.create({
    data: {
      given: 'a user creating a work item for sleeping score tracking',
      when: 'the user opens the creation fill box',
      then: 'each fill box displays helpful topic-specific example sentences in gray text',
      isMet: true,
      taskId: task3.id,
      storyId: story.id,
    },
  });

  console.log('Sleeping score seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
