<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Label } from '$lib/components/ui/label';
	import Download from 'lucide-svelte/icons/download';
	import { toPng } from 'html-to-image';
	import { nanoid } from 'nanoid/non-secure';

	let text = 'Project Title';

	function downloadURI(uri: string, name: string) {
		let link = document.createElement('a');
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		// delete link;
	}

	let element: HTMLDivElement;
	let start = '#202c3c';
	let end = '#38545c';

	let images: FileList | null = null;

	$: imageUrl = !images ? '' : URL.createObjectURL(images[0]);
</script>

<div>
	<div class="flex gap-3">
		<Input placeholder="Text goes here" bind:value={text} />
		<input type="color" bind:value={start} />
		<input type="color" bind:value={end} />
		<Button
			class="flex gap-2 mx-auto mb-5"
			on:click={async () => {
				downloadURI(
					await toPng(element, { canvasWidth: 1920, canvasHeight: 1280 }),
					`image_${nanoid(6)}.png`
				);
			}}
		>
			<Download size={18} />
			Download as PNG
		</Button>
	</div>
	<div class="grid w-full max-w-sm items-center gap-1.5">
		<Label for="picture">Picture</Label>
		<input type="file" bind:files={images} />
	</div>

	<div
		bind:this={element}
		class={`p-10 w-[700px] overflow-hidden`}
		style="aspect-ratio: 3/2; background: linear-gradient(to bottom right, {start}, {end});"
	>
		<div class="text-white font-bold text-5xl opacity-65 mb-16">{text}</div>
		{#if imageUrl !== ''}
			<img class="rounded-md mx-auto w-[600px] font-bold text-5xl rotated" src={imageUrl} alt="" />
			{:else}
			<div
				class="bg-white rounded-md mx-auto w-[600px] aspect-video shadow-xl text-blue-600 font-bold text-5xl rotated"
			>
				cool placeholder image here
			</div>
		{/if}
	</div>
</div>

<style>
	.rotated {
		transform: rotate3d(1.3, -1, 0.7, 35deg);
		/* -webkit-perspective: 500px; */
		perspective-origin: -170%;
		perspective: 900px;
	}

	:root {
	}
</style>
