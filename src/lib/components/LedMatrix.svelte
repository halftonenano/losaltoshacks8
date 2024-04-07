<script lang="ts">
	import { onMount } from 'svelte';

	export let width = 15;
	export let height = 10;

	$: array = new Array(height).fill(new Array(width));

	let i = 0;

	let reqFrame = -1;

	onMount(() => {
		animate();
		return () => cancelAnimationFrame(reqFrame);
	});

	function animate() {
		i += 0.04;
		reqFrame = requestAnimationFrame(animate);
	}
</script>
<div class="w-full h-full flex justify-center items-center">
	<div
		class="grid gap-2 w-fit"
		style="grid-template: repeat({height}, auto) / repeat({width}, auto);"
	>
		{#each array as row, rowindex}
			{#each row as col, colindex}
				<div
					class="rounded-full w-1.5 h-1.5 bg-primary"
					style="opacity: {Math.sin(rowindex * 15 * rowindex * colindex + i * 0.00001) -
						Math.sin(rowindex * 15 + colindex + i) +
						1};"
				></div>
			{/each}
		{/each}
	</div>
</div>
