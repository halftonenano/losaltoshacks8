<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import  Plus  from "lucide-svelte/icons/plus";
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { Button } from "$lib/components/ui/button";
  import { cn } from "$lib/utils.js";
  import { tick, onMount } from "svelte";
  import { pb, user } from "$lib/pocketbase";
  import { sync } from "$lib/sync"
  import * as Tooltip from "$lib/components/ui/tooltip";

  let users: { value: string, label: string }[] = [];

  $: {
    users = $sync.users.map(user => ({
      value: user.id,
      label: user.name
    }));
  }


  let open = false;
  let selectedUsers: {value:string, label:string}[] = [];

  export let valuesOnly2: string[] = selectedUsers.map(user => user.value);
  $: valuesOnly2 = selectedUsers.map(user => user.value);

  function toggleUser(user: typeof users[0]) {
    if (valuesOnly2.includes(user.value)) {
      selectedUsers = selectedUsers.filter((f) => f.value !== user.value);
    } else {
      selectedUsers = [...selectedUsers, user];
    }
  }

  function closeAndFocusTrigger(triggerId: string) {
    
    // open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
  let uid = $user?.id;
  onMount(()=>{
    selectedUsers = [...selectedUsers, {value: uid, label: $user?.name}];
  })
  
  $: console.log(selectedUsers);
  let avatars: any[] = [];
  $: avatars = $sync.users.filter(user => valuesOnly2.includes(user.id)).map(user => user);

</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" role="combobox" aria-expanded={open} class="w-fit">
      <Plus size="20"/>
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search user..." />
      <Command.Empty>No user found.</Command.Empty>
      <Command.Group>
        {#each users as user}
          <Command.Item
            value={user.value}
            onSelect={() => {
              if (user.value != uid){
                toggleUser(user);
                closeAndFocusTrigger(ids.trigger);
              }
            }}
          >
          <Check class={cn("mr-2 h-4 w-4", !valuesOnly2.includes(user.value) && "text-transparent")} />
          {user.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>

<div class="">
  <div class="flex pl-4">
    {#each avatars as user}
    <Tooltip.Root>
      <Tooltip.Trigger class="-ml-2">
        <img class="rounded-full aspect-square w-9" src={user.avatar ? pb.files.getUrl(user, user.avatar) : "/assets/default-user.png"} alt="avatar" />
      </Tooltip.Trigger>
      <Tooltip.Content>
        {user.name}
      </Tooltip.Content>
    </Tooltip.Root>
    {/each}
  </div>
</div>