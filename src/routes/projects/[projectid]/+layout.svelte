<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { initSync, sync } from '$lib/sync';
	import Brain from 'lucide-svelte/icons/brain';
	import Hammer from 'lucide-svelte/icons/hammer';
	import BookCheck from 'lucide-svelte/icons/book-check';
	import LogOut from 'lucide-svelte/icons/log-out';
	import CodeXml from 'lucide-svelte/icons/code-xml';
	import Contact from 'lucide-svelte/icons/contact';
	import Home from 'lucide-svelte/icons/home';
	import Countdown from '$lib/components/Countdown.svelte';
	import { onMount } from 'svelte';
	import { pb, signOut, user } from '$lib/pocketbase';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { goto } from '$app/navigation';

	let title: string = '';

	function handleTitle() {
		$sync.projects.forEach((element) => {
			if (element.id == $page.params.projectid) {
				title = element.name;
			}
		});
		title = title;
	}

	onMount(async () => {
		initSync($page.params.projectid);

		setTimeout(handleTitle, 250);
		pb.collection('projects').subscribe('*', (e) => {
			handleTitle();
		});
	});

	$: handleTitle();
</script>

<div class="p-5 pr-10 flex justify-between place-items-center">
	<div class="flex place-items-center gap-5">
		<div class="text-2xl font-bold whitespace-nowrap text-blue-700a">{title}</div>
		<div class="flex gap-2 place-items-center">
			<Button
				variant={$page.url.pathname.endsWith('/planning') ? 'default' : 'secondary'}
				href="/projects/{$page.params.projectid}/planning"
			>
				<Brain size={18} />
				<span class="ml-2">Plan</span>
			</Button>
			<Button
				variant={$page.url.pathname.endsWith('/build') ? 'default' : 'secondary'}
				href="/projects/{$page.params.projectid}/build"
			>
				<Hammer size={18} />
				<span class="ml-2">Build</span>
			</Button>
			<Button
				variant={$page.url.pathname.endsWith('/publish') ? 'default' : 'secondary'}
				href="/projects/{$page.params.projectid}/publish"
			>
				<BookCheck size={18} />
				<span class="ml-2">Publish</span>
			</Button>
		</div>
	</div>
	<div class="flex gap-5">
		{#if !$page.url.pathname.endsWith('/planning')}
			<div class="ml-6 grid place-items-center">
				<Countdown />
			</div>
		{/if}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<img
					class="w-12 h-12 rounded-full hover:-translate-y-1 transition-all hover:opacity-85"
					src={pb.files.getUrl($user, $user?.avatar)}
					alt="your profile"
				/>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56">
				<DropdownMenu.Label>{$user?.name}</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item href="/projects"
						><CodeXml class="mr-2 h-4 w-4" />Projects</DropdownMenu.Item
					>
					<DropdownMenu.Item href="/profile"
						><Contact class="mr-2 h-4 w-4" />Profile</DropdownMenu.Item
					>
					<DropdownMenu.Item href="/"
						><Home class="mr-2 h-4 w-4" />Home</DropdownMenu.Item
					>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />

				<DropdownMenu.Item on:click={() => {
					signOut();
					goto('/');
				}}>
					<LogOut class="mr-2 h-4 w-4" />
					<span>Sign out</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>

<slot />
