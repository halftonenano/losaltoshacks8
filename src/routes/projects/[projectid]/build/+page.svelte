<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import Milestones from '$lib/components/progress/Milestones.svelte';
	import ProgressChart from '$lib/components/progress/ProgressChart.svelte';
	import Tasks from './Tasks.svelte';
	import MilestonesIcon from 'lucide-svelte/icons/milestone';
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import { user } from '$lib/pocketbase';
	if (!window.Notification) {
		console.log('Browser does not support notifications.');
	} else {
		// check if permission is already granted
		if (Notification.permission === 'granted') {
			// show notification here
		} else {
			// request permission from user
			Notification.requestPermission()
				.then(function (p) {
					if (p === 'granted') {
						// show notification here
					} else {
						console.log('User blocked notifications.');
					}
				})
				.catch(function (err) {
					console.error(err);
				});
		}
	}

	onMount(async () => {
		pb.collection('tasks').subscribe('*', function (e) {
			if (e.action === 'update') {
				if (!window.Notification) {
					console.log('Browser does not support notifications.');
				} else {
					// check if permission is already granted
					if (Notification.permission === 'granted') {
						// show notification here
						// var notify = new Notification(`Task "${e.record.title}" updated to ${e.record.status}`);
					} else {
						// request permission from user
						Notification.requestPermission()
							.then(function (p) {
								if (p === 'granted') {
									// show notification here
									// var notify = new Notification(`Task "${e.record.title}" updated to ${e.record.status}`);
								} else {
									console.log('User blocked notifications.');
								}
							})
							.catch(function (err) {
								console.error(err);
							});
					}
				}
			}
		});
	});
</script>

<main class="grid min-h-[calc(100vh_-_100px)] overflow-x-hidden" style="grid-template: 1fr / 5fr 3fr">
	<Tasks />
	<div class="h-[calc(100vh_-_100px)] sticky top-0 border-l border-t">
		<div class="ml-5 border-l w-full">
			<div class="p-5">
				<div class="font-bold flex items-center gap-2 mb-5"><MilestonesIcon />Milestones</div>
				<div class="ml-1 border-l pl-3 border-primary">
					<Milestones />
				</div>
			</div>
			<div class="w-full mt-3 py-5 border-y">
				<LedMatrix width={25} height={5} />
			</div>
			<div class="sticky bottom-0">
				<ProgressChart />
			</div>
		</div>
	</div>
</main>
