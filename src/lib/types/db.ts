/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Areas = "areas",
	Projects = "projects",
	Snapshots = "snapshots",
	Tasks = "tasks",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AreasRecord = {
	project?: RecordIdString
	title: string
	users?: RecordIdString[]
}

export type ProjectsRecord = {
	endTime?: IsoDateString
	name?: string
	startTime?: IsoDateString
	users?: RecordIdString[]
}

export type SnapshotsRecord<Tdata = unknown> = {
	data?: null | Tdata
	datetime: IsoDateString
	project: RecordIdString
}

export enum TasksStatusOptions {
	"todo" = "todo",
	"inprogress" = "inprogress",
	"done" = "done",
}
export type TasksRecord<Ttranslations = unknown> = {
	area?: RecordIdString
	project: RecordIdString
	status: TasksStatusOptions
	title?: string
	translations?: null | Ttranslations
}

export enum UsersLanguageOptions {
	"english" = "english",
	"spanish" = "spanish",
	"french" = "french",
	"german" = "german",
	"mandarin" = "mandarin",
	"japanese" = "japanese",
	"hindi" = "hindi",
	"korean" = "korean",
	"telegu" = "telegu",
	"tamil" = "tamil",
	"vietnamese" = "vietnamese",
	"russian" = "russian",
}
export type UsersRecord = {
	avatar?: string
	language?: UsersLanguageOptions
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type AreasResponse<Texpand = unknown> = Required<AreasRecord> & BaseSystemFields<Texpand>
export type ProjectsResponse<Texpand = unknown> = Required<ProjectsRecord> & BaseSystemFields<Texpand>
export type SnapshotsResponse<Tdata = unknown, Texpand = unknown> = Required<SnapshotsRecord<Tdata>> & BaseSystemFields<Texpand>
export type TasksResponse<Ttranslations = unknown, Texpand = unknown> = Required<TasksRecord<Ttranslations>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	areas: AreasRecord
	projects: ProjectsRecord
	snapshots: SnapshotsRecord
	tasks: TasksRecord
	users: UsersRecord
}

export type CollectionResponses = {
	areas: AreasResponse
	projects: ProjectsResponse
	snapshots: SnapshotsResponse
	tasks: TasksResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'areas'): RecordService<AreasResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
	collection(idOrName: 'snapshots'): RecordService<SnapshotsResponse>
	collection(idOrName: 'tasks'): RecordService<TasksResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
