<script lang="ts">
	import type { TasksResponse } from '$lib/types/db';
	import AreaPicker from './AreaPicker.svelte';
	import ProgressPicker from './ProgressPicker.svelte';

	export let task: TasksResponse & { translations: { [lang: string]: string } };
	import { user } from '$lib/pocketbase';
	import { pb } from '$lib/pocketbase';
	import { sync } from '$lib/sync';
	import * as Tooltip from '$lib/components/ui/tooltip';

	let prefLang: string;

	$: prefLang = $user?.language;
	// if(task.translations && prefLang) {
	// 	const translation = task.translations.find(t => t.language === prefLang);
	// }
	// $: console.log(prefLang);

	let userids = $sync.areas.find((e) => e.id == task.area)?.users;
	console.log($sync.areas.find((e) => e.id == task.area)?.title);
	let users = $sync.users.filter((e) => userids?.includes(e.id));
</script>

<li class="flex items-center hover:bg-secondary/50 transition-colors px-5">
	<ProgressPicker {task} />
	<AreaPicker taskid={task.id} areaid={task.area} />
	<div class="py-2 px-2.5 w-full">
		{#if task.translations && prefLang}
			{#if task.translations[prefLang]}
				{task.translations[prefLang]}
			{:else}
				{task.translations['english']}<span class="text-xs text-zinc-400 ml-1"
					>(translation could not be found)</span
				>
			{/if}
		{:else}
			<span class="animate-pulse">
				{task.title}
			</span>
		{/if}
	</div>
	<div class="flex pl-4 group">
		{#each users as user}
			<Tooltip.Root>
				<Tooltip.Trigger class="-ml-2 group-hover:ml-2 transition-all z-40">
					<img
						class="rounded-full aspect-square w-8"
						src={user.avatar ? pb.files.getUrl(user, user.avatar) : '/assets/default-user.png'}
						alt="avatar"
					/>
				</Tooltip.Trigger>
				<Tooltip.Content>
					{user.name}
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>
</li>
