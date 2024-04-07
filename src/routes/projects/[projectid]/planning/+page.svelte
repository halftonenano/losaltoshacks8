<script lang="ts">
	import Editor from '$lib/components/editor/Editor.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Card } from '$lib/components/ui/card';
	import { sync } from '$lib/sync';
	import { pb } from '$lib/pocketbase';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import PersonSelector from '$lib/components/PersonSelector.svelte';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import dayjs, { type Dayjs } from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import Countdown from '$lib/components/Countdown.svelte';
	import toast, { Toaster } from 'svelte-french-toast';



	dayjs.extend(duration);

	let interval = -1;

	onMount(async () => {
		const record = await pb.collection('projects').getOne($page.params.projectid);
		console.log(record);
		start = dayjs(record.startTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
		end = dayjs(record.endTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
		interval = setInterval(() => {
			if (startDate && endDate) {
				updateCountdown(startDate, endDate);
			}
		}, 1000);

		($sync.projects).forEach(element => {
			if (element.id == $page.params.projectid) {
				title = element.name;
			}})
			title=title;
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	let start = '';
	let end = '';
	let countdown = '';
	let percentCompleted = 0;

	let startDate: Dayjs | null = null;
	let endDate: Dayjs | null = null;

	$: if (start && end) {
		startDate = dayjs(start);
		endDate = dayjs(end);
		updateCountdown(startDate, endDate);
	}

	function updateCountdown(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) {
		const now = dayjs();
		const totalDuration = endDate.diff(startDate);
		const elapsedDuration = now.diff(startDate);
		const percentComplete = (elapsedDuration / totalDuration) * 100;

		const duration = dayjs.duration(endDate.diff(now));
		const days = Math.floor(duration.asDays());
		const hours = duration.hours();
		const minutes = duration.minutes();
		const seconds = duration.seconds();

		if (endDate.isAfter(now)) {
			countdown = `Time left: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
			percentCompleted = percentComplete;
		} else {
			countdown = 'Time has expired';
			percentCompleted = 100;
		}
	}

	let area: string = '';

	async function handleAreaSubmit() {
		const data = { title: area, project: $page.params.projectid };
		const record = await pb.collection('areas').create(data);
		area = '';
		console.log($sync.areas);
	}

	async function handleAreaRemove(areaItem: any) {
		await pb.collection('areas').delete(areaItem.id);
	}

	async function handleTimeSubmit() {
		console.log(start);
		const formattedStart = dayjs(start).toISOString();
		const formattedEnd = dayjs(end).toISOString();
		console.log(formattedStart);
		const data = {
			startTime: formattedStart,
			endTime: formattedEnd
		};
		const record = await pb.collection('projects').update($page.params.projectid, data);
		toast.success('Time has been updated');
		console.log(record);
	}

	
	let title = ""; // Original input value
  let debouncedTitle = ''; // Debounced value variable
  let timeout:any;


	$: {
		clearTimeout(timeout);
		timeout=setTimeout(() => {
      debouncedTitle = title;
    }, 600);
	}

	async function handleUpdate(debouncedTitle: string) {
		if (title){
			const record = await pb.collection('projects').update($page.params.projectid, {"name":debouncedTitle});
		}
	}
	$: {
		console.log(debouncedTitle);
		handleUpdate(debouncedTitle);

	}

</script>

<main class="grid grid-cols-2 p-8 gap-4">
	<div class="w-full flex flex-col gap-6">
		<div>
			<div class="flex place-items-center gap-4">
				<div class="whitespace-nowrap">
					Project Name:
				</div>
				<Input bind:value={title} />
			</div>
		</div>
		<div>
			<div class="text-xl font-bold text-center mb-2">Brainstorming</div>
			<div class="min-h-50vh w-full text-lg rounded-md bg-gradient-to-br from-secondary to-[#31525d]">
				<Editor docid={`${$page.params.projectid}/planning`} />
			</div>
		</div>
	</div>
	<div class="flex flex-col w-full gap-4">
		<div class="w-full">
			<Card class="p-4">
				<div class="text-xl font-bold text-center">Creating Milestones</div>
				<div class="p-4">
					<div class="flex flex-col gap-3 flex-wrap pb-4">
						{#each $sync.areas as areaItem, i}
							<div class="flex gap-4 place-items-center">
								<div class="bg-blue-800 min-w-64 max-w-fit text-center p-2 px-8 rounded-md">
									<div class="flex place-items-center gap-2 justify-between">
										<span class="w-fit">{areaItem.title}</span>
										<button
											on:click={() => handleAreaRemove(areaItem)}
											class="rounded-lg hover:bg-blue-900 transition-all duration-300 ease-in-out p-1"
										>
											<Trash2 size={20} />
										</button>
									</div>
								</div>
								<PersonSelector id={areaItem.id} />
							</div>
						{/each}
						{#if $sync.areas.length > 4}
							<div class="text-red-600">
								You seem to be adding a lot of objectives, beware of feature creep!
							</div>
						{/if}
					</div>
					<form on:submit|preventDefault={handleAreaSubmit} class="flex gap-2">
						<Input bind:value={area} placeholder="Type areas of work here" />
						<Button type="submit">Submit</Button>
					</form>
				</div>
			</Card>
		</div>
		<Card class="p-4 w-full" >
			<div class="flex flex-col gap-4">
				<div class="text-xl font-bold text-center">Establishing Timeline</div>
				<div class="grid grid-cols-2 gap-4">
					<div class="flex flex-col text-center">
						<div>Starting Time:</div>
						<input class="bg-blue-700 p-2 rounded-md" type="datetime-local" bind:value={start} />
					</div>
					<div class="flex flex-col text-center">
						<div>Ending Time:</div>
						<input class="bg-blue-700 p-2 rounded-md" type="datetime-local" bind:value={end} />
					</div>
				</div>
				<Button
					on:click={() => {
						handleTimeSubmit();
					}}
					class="font-bold"
				>
					Save
				</Button>
				<div class="h-px w-full bg-blue-900 opacity-50"></div>
				{#if countdown}
					<div class="flex justify-between">
						<div class="text-center">
							{countdown}
						</div>
						<div class="text-center">
							{percentCompleted.toFixed(2)}% completed
						</div>
					</div>
				{:else}
					<div class="text-center w-full">Select a starting and ending time for the hackathon!</div>
				{/if}
			</div>
		</Card>
	</div>
</main>
