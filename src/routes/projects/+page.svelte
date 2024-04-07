<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import { sync } from '$lib/sync';
	import { onMount } from 'svelte';
	import { pb, user } from '$lib/pocketbase';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import ProjectPersonSelector from '$lib/components/ProjectPersonSelector.svelte';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import CodeXml from 'lucide-svelte/icons/code-xml';

	let projects: any[] = [];
	let userId: any[] = [];
	let presentUsers: any[] = [];

	$: projects = $sync.projects;

	let valuesOnly2: string[];
	let projName: string;

	async function handleSubmit() {
		const data = {
			name: projName,
			users: valuesOnly2
		};
		const record = await pb.collection('projects').create(data);
	}
</script>

<main class="w-screen h-screen px-32 grid place-items-end overflow-x-hidden">
	<Card class="w-full h-[50rem] rounded-t-lg flex flex-col gap-8 px-16 mt-6">
		<div class="text-center whitespace-nowrap text-4xl font-bold mt-24 flex items-center">
			<CodeXml class="mr-5" size={40} />Your Projects
		</div>

		<div class="flex flex-col gap-5">
			<Dialog.Root>
				<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>New Project</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header><Dialog.Title>Create New Project</Dialog.Title></Dialog.Header>
					<div class="grid grid-cols-4 items-center gap-4">
						<Label for="name" class="text-right">Project Name</Label>
						<Input
							id="username"
							placeholder="SampleProject"
							class="col-span-3"
							bind:value={projName}
						/>
						<Label for="members" class="text-right">Members</Label>
						<ProjectPersonSelector bind:valuesOnly2 />
					</div>
					<Dialog.Footer>
						<Button
							type="submit"
							on:click={() => {
								handleSubmit();
							}}>Initalize Project</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>

			{#each projects as project}
				<a href="/projects/{project.id}/planning">
					<Card
						class="py-6 h-24 flex gap-6 items-center hover:bg-white/10 transition-color duration-500 ease-in-out group"
					>
						<div class="text-2xl font-bold ml-8 grid place-items-center">
							{project.name}
						</div>
						<div class="w-px h-full bg-primary mr-6" />
						{#each project.users as user}
							{@const record = $sync.users.find((e) => e.id == user)}
							<Tooltip.Root>
								<Tooltip.Trigger class="-ml-8 group-hover:-ml-3 transition-all">
									{#if record}
										<img
											class="rounded-full aspect-square w-12 shadow-md"
											src={record.avatar ? pb.files.getUrl(record, record.avatar) : "/assets/default-user.png"}
											alt="avatar"
										/>
									{:else}
										<div class="rounded-full aspect-square w-12 bg-primary shadow-md"></div>
									{/if}
								</Tooltip.Trigger>
								<Tooltip.Content>
									{$sync.users.filter((e) => e.id == user)[0].name}
								</Tooltip.Content>
							</Tooltip.Root>
						{/each}
					</Card>
				</a>
			{/each}
		</div>
	</Card>
</main>
