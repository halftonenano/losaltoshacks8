<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { pb } from '$lib/pocketbase';

	async function oAuth() {
		await pb.collection('users').authWithOAuth2({ provider: 'google' })
	}
</script>

<Button
	class="flex gap-2"
	on:click={() => {oAuth()}}
>
	<img class="w-5 brightness-[0]" src="/assets/google.png" alt="google logo" />
	Continue with Google
</Button>
