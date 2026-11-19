import type {
  Milestone,
  Sprint,
  Epic,
  Story,
  Task,
  AcceptanceCriterion,
  Status,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// Built-in initial mock dataset specifically focused on "Dashboard for Sleeping Score"
let mockMilestones: Milestone[] = [
  {
    id: 'm-sleep-1',
    title: 'Milestone 1: Sleep Score Dashboard & Circadian Analytics Engine',
    description: 'Deliver the core biometric sleep score calculation, hypnogram stage visualizer, and 2-click task progress transitions.',
    targetDate: '2026-04-30T23:59:59.000Z',
    status: 'IN_PROGRESS',
    progress: {
      totalTasks: 4,
      doneTasks: 2,
      inProgressTasks: 1,
      inReviewTasks: 0,
      todoTasks: 1,
      percentage: 50,
    },
    sprints: [],
    epics: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockSprints: Sprint[] = [
  {
    id: 'sp-1',
    name: 'Sprint 1 - Biometric Ingestion & Sleep Score Algorithm',
    goal: 'Compute weighted 0-100 sleeping score and render landing page gauge with 2-click status changing.',
    startDate: '2026-03-01T00:00:00.000Z',
    endDate: '2026-03-14T23:59:59.000Z',
    status: 'ACTIVE',
    milestoneId: 'm-sleep-1',
    tasks: [],
    progress: {
      totalTasks: 3,
      doneTasks: 2,
      inProgressTasks: 1,
      inReviewTasks: 0,
      todoTasks: 0,
      percentage: 67,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sp-2',
    name: 'Sprint 2 - Nocturnal Hypnogram & Stage Distribution Charts',
    goal: 'Visualize deep, REM, and light sleep stages and calculate sleep debt benchmarks.',
    startDate: '2026-03-15T00:00:00.000Z',
    endDate: '2026-03-28T23:59:59.000Z',
    status: 'PLANNED',
    milestoneId: 'm-sleep-1',
    tasks: [],
    progress: {
      totalTasks: 1,
      doneTasks: 0,
      inProgressTasks: 0,
      inReviewTasks: 0,
      todoTasks: 1,
      percentage: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockEpics: Epic[] = [
  {
    id: 'e-1',
    title: 'Sleep Score Health & Circadian Rhythm Analytics Engine',
    role: 'wellness enthusiast and wearable device user',
    want: 'view my holistic daily sleep score and sleep stage breakdown in a centralized health dashboard',
    soThat: 'I can understand factors disrupting my deep sleep and optimize my nighttime recovery habits',
    description: 'Consolidates biometric sleep duration, sleep efficiency percentages, and circadian rhythm trends.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    milestoneId: 'm-sleep-1',
    stories: [],
    acceptanceCriteria: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockStories: Story[] = [
  {
    id: 'st-1',
    title: 'Nocturnal Sleep Stage Hypnogram & Restorative Score Gauge',
    role: 'insomnia patient tracking sleep hygiene',
    want: 'visualize the ratio of REM, deep, and light sleep compared to clinical benchmarks',
    soThat: 'I can identify wakefulness interruptions and discuss actionable trends with my sleep physician',
    description: 'Renders time-series hypnogram bar charts and calculates deep sleep target thresholds.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    epicId: 'e-1',
    tasks: [],
    acceptanceCriteria: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockTasks: Task[] = [
  {
    id: 't-1',
    title: 'Compute Weighted 0-100 Sleep Score Algorithm',
    role: 'health data engineer',
    want: 'compute weighted 0-100 sleep scores combining total sleep time, heart rate variability, and tossing frequency',
    soThat: 'the frontend dashboard renders accurate score gauges within 200 milliseconds of device sync',
    description: 'Implements Poisson regression on tossing episodes and factors nocturnal heart rate dip.',
    status: 'DONE',
    priority: 'CRITICAL',
    storyId: 'st-1',
    sprintId: 'sp-1',
    acceptanceCriteria: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Implement 2-Click Task Progress Dropdown on Milestone Dashboard',
    role: 'frontend engineer',
    want: 'change task progress directly from the milestone page in 2 clicks',
    soThat: 'our project milestone completion percentage updates immediately',
    description: 'Supports TODO, IN_PROGRESS, IN_REVIEW, and DONE states within 2 clicks.',
    status: 'DONE',
    priority: 'HIGH',
    storyId: 'st-1',
    sprintId: 'sp-1',
    acceptanceCriteria: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Sleep Stage Breakdown & REM Progression Chart Widget',
    role: 'data visualization specialist',
    want: 'render interactive hypnograms displaying duration in deep sleep, REM, and light sleep',
    soThat: 'users can quickly inspect their restorative sleep architecture on the dashboard',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    storyId: 'st-1',
    sprintId: 'sp-1',
    acceptanceCriteria: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Sleep Debt & Circadian Rhythm Calibration',
    role: 'sleep science researcher',
    want: 'calculate accumulated weekly sleep debt based on personal biological sleep targets',
    soThat: 'the score gauge warns users when chronic sleep deficit requires weekend recovery sleep',
    status: 'TODO',
    priority: 'MEDIUM',
    storyId: 'st-1',
    sprintId: 'sp-2',
    acceptanceCriteria: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockAcceptanceCriteria: AcceptanceCriterion[] = [
  {
    id: 'ac-1',
    given: 'an authenticated user has synchronized 420 minutes of nocturnal wearable sleep logs',
    when: 'the calculation engine completes analyzing deep sleep duration, awake minutes, and heart rate dip',
    then: 'the sleeping score dashboard renders a circular score gauge between 0 and 100 with restorative tier categorization',
    isMet: true,
    taskId: 't-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ac-2',
    given: 'a user inspecting tasks on the sleep score milestone overview',
    when: 'the user clicks the progress status badge and selects "DONE"',
    then: 'the task status transitions and the milestone completion percentage updates within exactly 2 clicks',
    isMet: true,
    taskId: 't-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ac-3',
    given: 'a user creating a work item for sleeping score tracking',
    when: 'the user opens the creation fill box',
    then: 'each fill box displays helpful topic-specific example sentences in gray text',
    isMet: true,
    taskId: 't-3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function recalculateMockProgress() {
  const total = mockTasks.length;
  const done = mockTasks.filter((t) => t.status === 'DONE').length;
  const inProgress = mockTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inReview = mockTasks.filter((t) => t.status === 'IN_REVIEW').length;
  const todo = mockTasks.filter((t) => t.status === 'TODO').length;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  if (mockMilestones[0]) {
    mockMilestones[0].progress = {
      totalTasks: total,
      doneTasks: done,
      inProgressTasks: inProgress,
      inReviewTasks: inReview,
      todoTasks: todo,
      percentage,
    };
  }

  mockSprints.forEach((s) => {
    const sTasks = mockTasks.filter((t) => t.sprintId === s.id);
    const sTotal = sTasks.length;
    const sDone = sTasks.filter((t) => t.status === 'DONE').length;
    const sInProgress = sTasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const sInReview = sTasks.filter((t) => t.status === 'IN_REVIEW').length;
    const sTodo = sTasks.filter((t) => t.status === 'TODO').length;
    s.progress = {
      totalTasks: sTotal,
      doneTasks: sDone,
      inProgressTasks: sInProgress,
      inReviewTasks: sInReview,
      todoTasks: sTodo,
      percentage: sTotal > 0 ? Math.round((sDone / sTotal) * 100) : 0,
    };
  });
}

recalculateMockProgress();

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    return handleMockRequest<T>(path, options);
  }
}

function handleMockRequest<T>(path: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : {};

  // MILESTONES
  if (path === '/milestones' && method === 'GET') {
    recalculateMockProgress();
    return mockMilestones.map((m) => ({
      ...m,
      sprints: mockSprints.filter((s) => s.milestoneId === m.id),
      epics: mockEpics.filter((e) => e.milestoneId === m.id),
    })) as unknown as T;
  }

  if (path.startsWith('/milestones/') && method === 'GET') {
    const id = path.split('/')[2];
    const found = mockMilestones.find((m) => m.id === id) || mockMilestones[0];
    recalculateMockProgress();
    return {
      ...found,
      sprints: mockSprints.map((s) => ({
        ...s,
        tasks: mockTasks.filter((t) => t.sprintId === s.id),
      })),
      epics: mockEpics.map((e) => ({
        ...e,
        stories: mockStories
          .filter((st) => st.epicId === e.id)
          .map((st) => ({
            ...st,
            tasks: mockTasks.filter((t) => t.storyId === st.id),
            acceptanceCriteria: mockAcceptanceCriteria.filter((ac) => ac.storyId === st.id),
          })),
        acceptanceCriteria: mockAcceptanceCriteria.filter((ac) => ac.epicId === e.id),
      })),
    } as unknown as T;
  }

  if (path === '/milestones' && method === 'POST') {
    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: body.title,
      description: body.description,
      targetDate: body.targetDate,
      status: body.status || 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockMilestones.push(newM);
    recalculateMockProgress();
    return newM as unknown as T;
  }

  if (path.startsWith('/milestones/') && method === 'PATCH') {
    const id = path.split('/')[2];
    const index = mockMilestones.findIndex((m) => m.id === id);
    if (index !== -1) {
      mockMilestones[index] = { ...mockMilestones[index], ...body, updatedAt: new Date().toISOString() };
      return mockMilestones[index] as unknown as T;
    }
  }

  // SPRINTS
  if (path.startsWith('/sprints') && method === 'GET') {
    recalculateMockProgress();
    return mockSprints.map((s) => ({
      ...s,
      tasks: mockTasks.filter((t) => t.sprintId === s.id),
    })) as unknown as T;
  }

  if (path === '/sprints' && method === 'POST') {
    const newSprint: Sprint = {
      id: `sp-${Date.now()}`,
      name: body.name,
      goal: body.goal,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status || 'PLANNED',
      milestoneId: body.milestoneId || mockMilestones[0]?.id || null,
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSprints.push(newSprint);
    recalculateMockProgress();
    return newSprint as unknown as T;
  }

  if (path.startsWith('/sprints/') && !path.includes('/tasks') && method === 'PATCH') {
    const id = path.split('/')[2];
    const index = mockSprints.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockSprints[index] = { ...mockSprints[index], ...body, updatedAt: new Date().toISOString() };
      recalculateMockProgress();
      return mockSprints[index] as unknown as T;
    }
  }

  if (path.includes('/sprints/') && path.includes('/tasks') && method === 'POST') {
    const sprintId = path.split('/')[2];
    const taskId = body.taskId;
    const taskIndex = mockTasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].sprintId = sprintId;
      recalculateMockProgress();
      return mockTasks[taskIndex] as unknown as T;
    }
  }

  // TASKS
  if (path.startsWith('/tasks') && method === 'GET') {
    return mockTasks.map((t) => ({
      ...t,
      story: mockStories.find((st) => st.id === t.storyId),
      sprint: mockSprints.find((s) => s.id === t.sprintId),
      acceptanceCriteria: mockAcceptanceCriteria.filter((ac) => ac.taskId === t.id),
    })) as unknown as T;
  }

  if (path === '/tasks' && method === 'POST') {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: body.title,
      role: body.role,
      want: body.want,
      soThat: body.soThat,
      description: body.description,
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      storyId: body.storyId || mockStories[0]?.id || null,
      sprintId: body.sprintId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.push(newTask);
    recalculateMockProgress();
    return newTask as unknown as T;
  }

  // 2-CLICK STATUS TRANSITION
  if (path.includes('/tasks/') && path.includes('/status') && method === 'PATCH') {
    const id = path.split('/')[2];
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      mockTasks[taskIndex].status = body.status;
      mockTasks[taskIndex].updatedAt = new Date().toISOString();
      recalculateMockProgress();
      return mockTasks[taskIndex] as unknown as T;
    }
  }

  if (path.startsWith('/tasks/') && method === 'PATCH') {
    const id = path.split('/')[2];
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...body, updatedAt: new Date().toISOString() };
      recalculateMockProgress();
      return mockTasks[taskIndex] as unknown as T;
    }
  }

  // EPICS
  if (path.startsWith('/epics') && method === 'GET') {
    return mockEpics as unknown as T;
  }

  if (path === '/epics' && method === 'POST') {
    const newEpic: Epic = {
      id: `e-${Date.now()}`,
      title: body.title,
      role: body.role,
      want: body.want,
      soThat: body.soThat,
      description: body.description,
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      milestoneId: body.milestoneId || mockMilestones[0]?.id || null,
      stories: [],
      acceptanceCriteria: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockEpics.push(newEpic);
    return newEpic as unknown as T;
  }

  // STORIES
  if (path.startsWith('/stories') && method === 'GET') {
    return mockStories as unknown as T;
  }

  if (path === '/stories' && method === 'POST') {
    const newStory: Story = {
      id: `st-${Date.now()}`,
      title: body.title,
      role: body.role,
      want: body.want,
      soThat: body.soThat,
      description: body.description,
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      epicId: body.epicId || mockEpics[0]?.id || null,
      tasks: [],
      acceptanceCriteria: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStories.push(newStory);
    return newStory as unknown as T;
  }

  // ACCEPTANCE CRITERIA
  if (path.startsWith('/acceptance-criteria') && method === 'GET') {
    return mockAcceptanceCriteria as unknown as T;
  }

  if (path === '/acceptance-criteria' && method === 'POST') {
    const newAC: AcceptanceCriterion = {
      id: `ac-${Date.now()}`,
      given: body.given,
      when: body.when,
      then: body.then,
      isMet: body.isMet ?? false,
      epicId: body.epicId,
      storyId: body.storyId,
      taskId: body.taskId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockAcceptanceCriteria.push(newAC);
    return newAC as unknown as T;
  }

  if (path.includes('/acceptance-criteria/') && path.includes('/toggle') && method === 'PATCH') {
    const id = path.split('/')[2];
    const ac = mockAcceptanceCriteria.find((a) => a.id === id);
    if (ac) {
      ac.isMet = !ac.isMet;
      return ac as unknown as T;
    }
  }

  return {} as unknown as T;
}

export const api = {
  milestones: {
    getAll: () => request<Milestone[]>('/milestones'),
    getOne: (id: string) => request<Milestone>(`/milestones/${id}`),
    create: (data: Partial<Milestone>) => request<Milestone>('/milestones', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Milestone>) => request<Milestone>(`/milestones/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/milestones/${id}`, { method: 'DELETE' }),
  },
  sprints: {
    getAll: (milestoneId?: string) => request<Sprint[]>(`/sprints${milestoneId ? `?milestoneId=${milestoneId}` : ''}`),
    getOne: (id: string) => request<Sprint>(`/sprints/${id}`),
    create: (data: Partial<Sprint>) => request<Sprint>('/sprints', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Sprint>) => request<Sprint>(`/sprints/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/sprints/${id}`, { method: 'DELETE' }),
    assignTask: (sprintId: string, taskId: string) =>
      request<Task>(`/sprints/${sprintId}/tasks`, { method: 'POST', body: JSON.stringify({ taskId }) }),
    unassignTask: (sprintId: string, taskId: string) =>
      request<Task>(`/sprints/${sprintId}/tasks/${taskId}`, { method: 'DELETE' }),
  },
  epics: {
    getAll: (milestoneId?: string) => request<Epic[]>(`/epics${milestoneId ? `?milestoneId=${milestoneId}` : ''}`),
    getOne: (id: string) => request<Epic>(`/epics/${id}`),
    create: (data: Partial<Epic>) => request<Epic>('/epics', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Epic>) => request<Epic>(`/epics/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/epics/${id}`, { method: 'DELETE' }),
  },
  stories: {
    getAll: (epicId?: string) => request<Story[]>(`/stories${epicId ? `?epicId=${epicId}` : ''}`),
    getOne: (id: string) => request<Story>(`/stories/${id}`),
    create: (data: Partial<Story>) => request<Story>('/stories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Story>) => request<Story>(`/stories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/stories/${id}`, { method: 'DELETE' }),
  },
  tasks: {
    getAll: (sprintId?: string, storyId?: string) =>
      request<Task[]>(`/tasks?${sprintId ? `sprintId=${sprintId}&` : ''}${storyId ? `storyId=${storyId}` : ''}`),
    getOne: (id: string) => request<Task>(`/tasks/${id}`),
    create: (data: Partial<Task>) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Task>) => request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: Status) =>
      request<Task>(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => request<{ success: boolean }>(`/tasks/${id}`, { method: 'DELETE' }),
  },
  acceptanceCriteria: {
    getAll: (params?: { epicId?: string; storyId?: string; taskId?: string }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return request<AcceptanceCriterion[]>(`/acceptance-criteria${q ? `?${q}` : ''}`);
    },
    create: (data: Partial<AcceptanceCriterion>) =>
      request<AcceptanceCriterion>('/acceptance-criteria', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<AcceptanceCriterion>) =>
      request<AcceptanceCriterion>(`/acceptance-criteria/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    toggle: (id: string) =>
      request<AcceptanceCriterion>(`/acceptance-criteria/${id}/toggle`, { method: 'PATCH' }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/acceptance-criteria/${id}`, { method: 'DELETE' }),
  },
};
