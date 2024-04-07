<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { pb } from '$lib/pocketbase';
	import { sync } from '$lib/sync';
	import { onMount } from 'svelte';
	import { Chart, type EChartsOptions } from 'svelte-echarts';
	let xaxis: string[] = [];
	let series: {
		done: number[];
		inprogress: number[];
		total: number[];
	} = { done: [], inprogress: [], total: [] };

	onMount(async () => {
		const records = await pb.collection('snapshots').getFullList({
			sort: 'datetime'
		});
		for (const record of records) {
			const data = record.data as { done: number; inprogress: number; total: number };

			xaxis.push(record.datetime);

			series.done.push(data.done);
			series.inprogress.push(data.done + data.inprogress);
			series.total.push(data.total);
		}
		series = series;
		// pb.collection('snapshots').subscribe('*', async function(e) {
		//   e.
		// })
	});

	$: options = {
		// legend: {
		// 	data: ['Done', 'In progress', 'Scope']
		// },
		tooltip: {
			trigger: 'axis'
		},
		xAxis: {
			data: [...xaxis, ...new Array(20)],
			type: 'category',
			show: false
		},
		yAxis: {
			type: 'value',
			max: $sync.tasks.length,
			show: false
		},
		series: [
			{
				name: 'Done',
				data: series.done,
				areaStyle: {},
				emphasis: {
					focus: 'series'
				},
				type: 'line',
				stack: 'total',
				smooth: true,
				showSymbol: false,

				color: '#3b82f6'
			},
			{
				name: 'In progress',
				data: series.inprogress,
				type: 'line',
				smooth: true,
				showSymbol: false,
				color: '#fcba03'
			},
			{
				name: 'Scope',
				data: series.total,
				type: 'line',
				smooth: true,
				showSymbol: false,
				color: '#d9d9d9'
			}
		]
	} satisfies EChartsOptions;
</script>

	<div class="relative chart z-[999] bg-secondary/45">
		<Chart {options} />
	</div>

<style>
	.chart {
		width: 100%;
		height: 275px;
	}
</style>
