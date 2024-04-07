<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import dayjs, { type Dayjs } from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import Progress from './ui/progress/progress.svelte';
	dayjs.extend(duration);

	let interval = -1;

	onMount(async () => {
		const record = await pb.collection('projects').getOne($page.params.projectid);
		start = dayjs(record.startTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
		end = dayjs(record.endTime).format('YYYY-MM-DDTHH:mm:ss.SSS');
		interval = setInterval(() => {
			if (startDate && endDate) {
				updateCountdown(startDate, endDate);
			}
		}, 1000);
		countdown = countdown;
		percentCompleted = percentCompleted;
		// pb.collection('projects').subscribe('*', function (e) {
		//   console.log(e);
		// })
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
			// countdown = `Time left: ${days}:${hours}:${minutes}:${seconds}`;
			countdown = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
			percentCompleted = percentComplete;
		} else {
			countdown = 'Time has expired';
			percentCompleted = 100;
		}
	}
</script>

<div class="flex flex-col gap-2 w-[250px]">
	<div class="flex items-center justify-between gap-3 w-full">
		<div class="whitespace-nowrap">
			{countdown}
		</div>
		<div class="text-xs text-blue-300">
			{percentCompleted.toFixed(2)}%
		</div>
	</div>
	<Progress value={percentCompleted} />
</div>
