<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Card } from '$lib/components/ui/card';
	import * as Command from '$lib/components/ui/command/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { pb, user } from '$lib/pocketbase';
	import { cn } from '$lib/utils.js';
	import Check from 'lucide-svelte/icons/check';
	import Upload from 'lucide-svelte/icons/upload';
	import { tick } from 'svelte';
	import toast from 'svelte-french-toast';
	import LedWave from '$lib/components/LedWave.svelte';

	const languages = [
		{
			value: 'english',
			label: 'english'
		},
		{
			value: 'spanish',
			label: 'spanish'
		},
		{
			value: 'japanese',
			label: 'japanese'
		},
		{
			value: 'french',
			label: 'french'
		},
		{
			value: 'hindi',
			label: 'hindi'
		},
		{
			value: 'german',
			label: 'german'
		},
		{
			value: 'mandarin',
			label: 'mandarin'
		},
		{
			value: 'korean',
			label: 'korean'
		},
		{
			value: 'telegu',
			label: 'telegu'
		},
		{
			value: 'tamil',
			label: 'tamil'
		},
		{
			value: 'vietnamese',
			label: 'vietnamese'
		},
		{
			value: 'russian',
			label: 'russian'
		}
	];

	let open = false;
	let value = '';

	$: selectedValue =
		languages.find((f) => f.value === value)?.label ?? ($user?.language || 'english');

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	async function handleUpdate() {
		toast.success('Profile updated');
		return pb.collection('users').update($user?.id, { language: selectedValue });
	}

	let name = $user?.name ?? '';
	let email = $user?.email ?? '';

	let files: FileList | null = null;
</script>

<Button class='fixed top-8 left-8' on:click={() => history.back()}>{'<-'} Back</Button>

<div class="grid grid-cols-2 px-20 gap-8 pt-20">
	<div>
		{#if $user}
			<div class="flex flex-col gap-4 items-center relative">
        <div class="scale-[2] -z-20 absolute">
          <LedWave width={15} height={10} />
        </div>

				<img
					class="rounded-full aspect-square w-[50%] p-8"
					src={$user.avatar ? pb.files.getUrl($user, $user?.avatar) : "/assets/default-user.png"}
					alt="avatar"
				/>

				<div>
					<label
						for="file-upload"
						class={buttonVariants({ variant: 'outline', class: 'cursor-pointer' })}
					>
						<Upload class="w-4 mr-2" />
						Upload Profile Photo
					</label>
					<input
						id="file-upload"
						type="file"
						accept="image/*"
						bind:files
						on:change={async () => {
							if (!files) return;

							const formData = new FormData();
							formData.append('avatar', files[0]);

							toast.promise(pb.collection('users').update($user?.id, formData), {
								loading: 'Uploading...',
								success: 'Done!',
								error: 'An error occured'
							});
						}}
					/>
				</div>
			</div>
		{/if}
	</div>

  <div>
    <Card class="flex flex-col gap-8 p-10 h-fit relative">
      <div class="flex gap-6 items-center">
        <Label class="text-lg text-primary">Name:</Label>
        <Input class="text-neutral-400 text-md" bind:value={name} placeholder={name} />
  
        <Button
          on:click={async () => {
            try {
              if (name === '' || name === null || name === undefined) {
                toast.error('Invalid name');
                return;
              }
              pb.collection('users').update(`${$user?.id}`, {
                name: name
              });
            } catch (err) {
              toast.error('Something went wrong');
              console.error(err);
            }
            toast.success('Profile updated');
          }}>Save</Button
        >
      </div>
      <div class="flex gap-6 items-center">
        <Label class="text-lg text-primary">Email:</Label>
        <Input class="text-neutral-400 text-md" type="email" bind:value={email} placeholder={email} />
  
        <Button
          on:click={async () => {
            try {
              if (email === '' || email === null || email === undefined || !email.includes('@')) {
                toast.error('Invalid email');
                return;
              }
              pb.collection('users').update(`${$user?.id}`, {
                email: email
              });
            } catch (err) {
              toast.error('Something went wrong');
              console.error(err);
            }
            toast.success('Profile updated');
          }}>Save</Button
        >
      </div>
      <div class="flex gap-6 items-center">
        <Label class="text-lg text-primary">Language:</Label>
        <Popover.Root bind:open let:ids>
          <Popover.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              class="w-fit min-w-48 text-neutral-400 text-md"
            >
              {selectedValue}
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-56 p-0">
            <Command.Root>
              <Command.Input placeholder="Search language..." />
              <Command.Empty>No user found.</Command.Empty>
              <Command.Group>
                {#each languages as language}
                  <Command.Item
                    value={language.value}
                    onSelect={(currentValue) => {
                      value = currentValue;
                      closeAndFocusTrigger(ids.trigger);
                    }}
                  >
                    <Check
                      class={cn('mr-2 h-4 w-4', value !== language.value && 'text-transparent')}
                    />
                    {language.label}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
        <Button
          on:click={() => {
            handleUpdate();
            pb.collection('users').authRefresh();
          }}>Save</Button
        >
      </div>
    </Card>
  </div>
</div>

<style>
	input[type='file'] {
		display: none;
	}
</style>
