<script lang="ts">
	import { page } from '$app/stores';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { pb } from '$lib/pocketbase';
	import { sync } from '$lib/sync';
	import { TasksStatusOptions } from '$lib/types/db';
	import { cn, stc } from '$lib/utils';
	import Circle from 'lucide-svelte/icons/circle';
	import CircleCheck from 'lucide-svelte/icons/circle-check';
	import CircleDashed from 'lucide-svelte/icons/circle-dashed';
	import Filter from 'lucide-svelte/icons/filter';
	import Package from 'lucide-svelte/icons/package';
	import X from 'lucide-svelte/icons/x';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import AreaFilterSelector from './AreaFilterSelector.svelte';
	import TaskItem from './TaskItem.svelte';

	let filter: string[] = [];
	$: shownTasks =
		filter.length === 0
			? $sync.tasks
			: $sync.tasks.filter((t) => !!filter.find((f) => f === t.area));

	let title = '';

	let open = false;

	function submitTask() {
		pb.collection('tasks').create({
			title: title,
			project: $page.params.projectid,
			status: TasksStatusOptions.todo
		});
		title = '';
		open = false;
	}

	$: console.log(filter);
</script>

<div class="fixed bottom-12 right-16 w-[24rem] z-50">
	<Dialog.Root bind:open>
		<Dialog.Trigger
			class={cn(buttonVariants({ variant: 'default' }), 'w-full flex h-16 text-lg items-center')}
		>
			+<Package class="mr-2 w-5 mt-1" />
			File new task
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title class="flex items-center">
					+<Package class="mr-2 w-5 mt-1" />New Task
				</Dialog.Title>
			</Dialog.Header>
			<form on:submit|preventDefault={submitTask} class="grid gap-4 py-4">
				<Input id="name" class="col-span-3" bind:value={title} />
			</form>
			<Dialog.Footer>
				<Button type="submit" on:click={submitTask}>create</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

<div>
	<div class="flex gap-2 items-center font-medium py-2 px-5 border-t z-40">
		<Filter size={18} />Filters
		<div class="ml-2.5">
			<AreaFilterSelector bind:valuesOnly2={filter} />
		</div>

		<div class="flex pl-2.5 gap-3">
			{#each filter as areaid}
				{@const area = $sync.areas.find((a) => a.id === areaid)}
				<div
					class="text-[0.825rem] text-white font-bold rounded-full px-2.5 shrink-0"
					style="background-color: {area ? stc(area.id) : stc('gray')};"
				>
					<p class="whitespace-nowrap">
						{area ? area.title : 'select tag'}
					</p>
				</div>
			{/each}
		</div>
	</div>
	<div>
		<div class="flex gap-2 items-center font-medium py-2 px-5 bg-secondary top-0 sticky z-40">
			<Circle size={18} />Tasks
		</div>
		<ul class="divide-y">
			{#each shownTasks.filter((t) => t.status === TasksStatusOptions.todo) as task (task.id)}
				<div animate:flip={{ duration: 250, easing: quintOut }}>
					<TaskItem {task} />
				</div>
			{/each}
		</ul>
		<div class="flex gap-2 items-center font-medium py-2 px-5 bg-secondary top-0 sticky z-40">
			<CircleDashed size={18} />In Progress
		</div>
		<ul class="divide-y">
			{#each shownTasks.filter((t) => t.status === TasksStatusOptions.inprogress) as task (task.id)}
				<div animate:flip={{ duration: 250, easing: quintOut }}>
					<TaskItem {task} />
				</div>
			{/each}
		</ul>
		<div class="flex gap-2 items-center font-medium py-2 px-5 bg-secondary top-0 sticky z-40">
			<CircleCheck size={18} />Completed
		</div>
		<ul class="divide-y">
			{#each shownTasks.filter((t) => t.status === TasksStatusOptions.done) as task (task.id)}
				<div animate:flip={{ duration: 250, easing: quintOut }}>
					<TaskItem {task} />
				</div>
			{/each}
		</ul>
	</div>
</div>
