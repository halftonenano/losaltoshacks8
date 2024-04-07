<script>
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { pb, user } from '$lib/pocketbase';
	import { Card } from '$lib/components/ui/card';
	import BookOpen from 'lucide-svelte/icons/book-open';
	import Info from 'lucide-svelte/icons/info';
	import * as Dialog from '$lib/components/ui/dialog';
	import LedWave from '$lib/components/LedWave.svelte';

	async function oAuth() {
		await pb.collection('users').authWithOAuth2({ provider: 'google' });
	}
</script>

<div
	class="absolute bottom-0 left-0 origin-center -z-20 aspect-square w-[32rem] rounded-full bg-green-700/25 blur-[140px]"
/>
<div
	class="absolute top-0 right-0 origin-center -z-20 aspect-square w-[32rem] rounded-full bg-blue-700/15 blur-[140px]"
/>
<div class="absolute bottom-4 right-4">
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}><Info /></Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px] w-full">
			<Dialog.Header>
				<Dialog.Title>How to use Product Name</Dialog.Title>
			</Dialog.Header>
			<div class="flex flex-col gap-4 py-4">
				<div>1. Login with Google Authentication</div>
				<div>2. Create a Project, name it, and assign members</div>
				<div>3. Brainstorm and prepare in the Planning Phase</div>
				<div>4. Create and complete tasks in the Building Phase</div>
				<div>5. Finalize and prepare to present in the Publishing Phase</div>
				<div>
					Bonus: Augment your name, profile photo, or preferred language in the profile section!
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
</div>

<main class="w-screen h-screen p-24 pt-16 grid place-items-center select-none">
	<div>
		<div class="gradient z-20 text-center text-8xl font-bold mb-4 text-primary cursor-default">Cobalt</div>
		<div class="text-center text-2xl font-medium mb-4 text-white/75 cursor-default">
			A project management application tailored for small teams and hackathons
		</div>

		<div
			class="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] scale-[3] -z-50 blur-sm"
		>
			<LedWave width={30} height={10} />
		</div>

		<div class="w-fit mx-auto">
			{#if !$user}
				<Button
					class="flex gap-2 text-md px-3"
					on:click={() => {
						oAuth();
					}}
				>
					<img class="w-5 brightness-[0]" src="/assets/google.png" alt="google logo" />
					Continue with Google
				</Button>
			{:else}
				<a class="flex gap-2 bg-gradient-to-br from-white/10 to-white/15 hover:scale-105 transition-all duration-500 ease-in-out backdrop-blur-md border text-white p-3 rounded-md px-5" href="/projects">
					<BookOpen />
					Continue to Projects
				</a>
			{/if}
		</div>
	</div>
</main>

<style>
	.gradient {
		animation: background-pan 0.5s linear infinite;
		background: linear-gradient(to right, #4d8cf2, #1e4eb4, #0f5df0, #1c79e3);
		background-size: 200%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		white-space: nowrap;
	}
</style>
