<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { pb } from '$lib/pocketbase';
	import { sync } from '$lib/sync';
	import { stc } from '$lib/utils';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	export let taskid: string;
	export let areaid: string;

	$: area = $sync.areas.find((t) => t.id === areaid);

	let selectedid = '';

	$: if (selectedid !== '') {
		pb.collection('tasks').update(taskid, { area: selectedid });
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<div
			class="flex gap-1 items-center text-[0.825rem] text-white font-bold rounded-full pl-1.5 pr-2.5 shrink-0"
			style="background-color: {area ? stc(area.id) : stc('gray')};"
		>
			<ChevronDown class="mt-px" size={14} />
			<p class="whitespace-nowrap">
				{area ? area.title : 'select tag'}
			</p>
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.RadioGroup bind:value={selectedid}>
				{#each $sync.areas as area}
					<DropdownMenu.RadioItem value={area.id}>{area.title}</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
