<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div
{...$$restProps}
class={cn("rounded-lg border text-card-foreground shadow-sm bg-gradient-to-br from-secondary/35 to-secondary/95", className)}
>
	<slot />
</div>
