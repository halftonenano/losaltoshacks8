<script>
	import ShowcaseGenerator from './ShowcaseGenerator.svelte';
	import Editor2 from '$lib/components/editor/Editor2.svelte'
	import Card from '$lib/components/ui/card/card.svelte';
	import { page } from '$app/stores';
</script>

<main class="flex p-8 gap-4">
	<div class="flex-1">
		<div class="text-xl font-bold text-center mb-2">Script Editor</div>
		<div class="min-h-50vh w-full text-lg rounded-md bg-gradient-to-br from-secondary to-[#31525d]">
			<Editor2 docid={`${$page.params.projectid}/publish`} />
		</div>
	</div>
	<div class="flex flex-col w-full gap-4 flex-grow max-w-fit">
		<div class="w-full">
			<Card class="p-4">
				<div class="text-xl font-bold text-center">Thumbnail Generator</div>
				<div class="p-4 mx-auto w-fit">
					<ShowcaseGenerator />
				</div>
			</Card>
		</div>
	</div>
</main>