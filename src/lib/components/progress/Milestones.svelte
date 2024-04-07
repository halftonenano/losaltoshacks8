<script>
	import { sync } from '$lib/sync';
	import { TasksStatusOptions } from '$lib/types/db';
	import { stc } from '$lib/utils';
	import CircularProgress from './CircularProgress.svelte';
</script>

<div>
	<ul class="space-y-3">
		{#each $sync.areas as area}
			{@const areaTasks = $sync.tasks.filter((t) => t.area === area.id)}
			{@const percentage =
				areaTasks.filter((t) => t.status === TasksStatusOptions.done).length / areaTasks.length}
			<li class="flex gap-3 items-center text-sm text-zinc-200">
				{#key percentage}
					<CircularProgress progress={percentage} color={'#3b82f6'} size={17} />
				{/key}
				{area.title}
				<span class="text-zinc-400"
					>{isNaN(percentage) ? 0 : Math.round(percentage * 100)}% of {areaTasks.length}</span
				>
			</li>
		{/each}
	</ul>
</div>
