// Gene's Realtime Sync Engine

import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { pb } from './pocketbase';
import type { AreasResponse, ProjectsResponse, TasksResponse, UsersResponse } from './types/db';

export type SyncData = {
	projectid: string;
	tasks: TasksResponse[];
	areas: AreasResponse[];
	users: UsersResponse[];
	projects: ProjectsResponse[];
};

export const sync = writable<SyncData>({
	projectid: '',
	tasks: [],
	areas: [],
	users: [],
	projects: []
});

let projectid = '';

export function initSync(project: string) {
	projectid = project;
	sync.update((prev) => ({ ...prev, projectid: project }));

	pb.collection('tasks')
		.getFullList({ filter: `project="${project}"` })
		.then((data) => {
			sync.update((prev) => ({ ...prev, tasks: data }));
		});

	pb.collection('areas')
		.getFullList({ filter: `project="${project}"` })
		.then((data) => {
			sync.update((prev) => ({ ...prev, areas: data }));
		});
}

if (browser) {
	pb.collection('tasks').subscribe('*', ({ action, record }) => {
		if (record.project !== projectid) return;
		if (action === 'create') {
			sync.update((prev) => ({ ...prev, tasks: [...prev.tasks, record] }));
		} else if (action === 'delete') {
			sync.update((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== record.id) }));
		} else if (action === 'update') {
			sync.update((prev) => ({
				...prev,
				tasks: prev.tasks.map((t) => (t.id === record.id ? record : t))
			}));
		}
	});
	pb.collection('areas').subscribe('*', ({ action, record }) => {
		if (record.project !== projectid) return;
		if (action === 'create') {
			sync.update((prev) => ({ ...prev, areas: [...prev.areas, record] }));
		} else if (action === 'delete') {
			sync.update((prev) => ({ ...prev, areas: prev.areas.filter((t) => t.id !== record.id) }));
		} else if (action === 'update') {
			sync.update((prev) => ({
				...prev,
				areas: prev.areas.map((t) => (t.id === record.id ? record : t))
			}));
		}
	});

	pb.collection('users').subscribe('*', ({ action, record }) => {
		if (action === 'create') {
			sync.update((prev) => ({ ...prev, users: [...prev.users, record] }));
		} else if (action === 'delete') {
			sync.update((prev) => ({ ...prev, users: prev.users.filter((t) => t.id !== record.id) }));
		} else if (action === 'update') {
			sync.update((prev) => ({
				...prev,
				users: prev.users.map((t) => (t.id === record.id ? record : t))
			}));
		}
	});
	pb.collection('users')
		.getFullList({})
		.then((data) => {
			sync.update((prev) => ({ ...prev, users: data }));
		});

	pb.collection('projects').subscribe('*', ({ action, record }) => {
		if (action === 'create') {
			sync.update((prev) => ({ ...prev, projects: [...prev.projects, record] }));
		} else if (action === 'delete') {
			sync.update((prev) => ({
				...prev,
				projects: prev.projects.filter((t) => t.id !== record.id)
			}));
		} else if (action === 'update') {
			sync.update((prev) => ({
				...prev,
				projects: prev.projects.map((t) => (t.id === record.id ? record : t))
			}));
		}
	});
	pb.collection('projects')
		.getFullList({})
		.then((data) => {
			sync.update((prev) => ({ ...prev, projects: data }));
		});
}
