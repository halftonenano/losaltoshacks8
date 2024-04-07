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
		i += 0.05;
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
				{@const height = Math.sin(i + colindex * 2) * 45}
				<!-- {@const yoff = (Math.sin(i / 3 + colindex / 5) + Math.sin(i / 5 + colindex)) * 5} -->
				<div
					class="rounded-full w-1.5 h-1.5 bg-primary"
					style="opacity: {Math.max(array.length / 2 + height - rowindex * 5, 0.1)}; filter: brightness({Math.sin(i / 3 + colindex / 5) + Math.sin(i / 5 + rowindex)});"
				></div>
			{/each}
		{/each}
	</div>
</div>
