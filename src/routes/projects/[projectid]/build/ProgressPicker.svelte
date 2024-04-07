<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { pb } from '$lib/pocketbase';
	import { TasksStatusOptions, type TasksResponse } from '$lib/types/db';
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	export let task: TasksResponse;

	let selected = task.status as string;

	$: if (task.status !== selected) {
		pb.collection('tasks').update(task.id, { status: selected });
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="opacity-65 hover:opacity-100 -ml-1 mr-1 p-1">
		<GripVertical size={18} />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.RadioGroup bind:value={selected}>
				<DropdownMenu.RadioItem value={TasksStatusOptions.todo}>Todo</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value={TasksStatusOptions.inprogress}>
					In Progress
				</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value={TasksStatusOptions.done}>Done</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
			<DropdownMenu.Item on:click={() => pb.collection('tasks').delete(task.id)}>
				<Trash2 class="mr-2" size={16} /> Delete
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
