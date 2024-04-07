<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import Plus from 'lucide-svelte/icons/plus';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import { tick, onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { sync } from '$lib/sync';
	import * as Tooltip from '$lib/components/ui/tooltip';

	let areas: { value: string; label: string }[] = [];

	$: {
		areas = $sync.areas.map((a) => ({
			value: a.id,
			label: a.title
		}));
	}

	let open = false;
	let selectedUsers: { value: string; label: string }[] = [];

	export let valuesOnly2: string[] = selectedUsers.map((user) => user.value);
	$: valuesOnly2 = selectedUsers.map((user) => user.value);

	function toggleUser(user: (typeof areas)[0]) {
		if (valuesOnly2.includes(user.value)) {
			selectedUsers = selectedUsers.filter((f) => f.value !== user.value);
		} else {
			selectedUsers = [...selectedUsers, user];
		}
	}

	function closeAndFocusTrigger(triggerId: string) {
		// open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-fit"
		>
			<Plus size="20" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Search..." />
			<Command.Empty>None found.</Command.Empty>
			<Command.Group>
				{#each areas as user}
					<Command.Item
						value={user.value}
						onSelect={() => {
							toggleUser(user);
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check
							class={cn('mr-2 h-4 w-4', !valuesOnly2.includes(user.value) && 'text-transparent')}
						/>
						{user.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
