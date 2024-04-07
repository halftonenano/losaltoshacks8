<script lang="ts">
	export let color: string;
	export let size = 50;

	export let progress: number;

	const background = `radial-gradient(#020817 40%, transparent 55%),
    conic-gradient(${color} 0deg ${progress * 360}deg, transparent ${progress * 360}deg 360deg)`;
</script>

<div
	class="progress-circle"
	style="--background: {background}; width: {size}px; height: {size}px;"
></div>

<style>
	.progress-circle {
		background: var(--background);
		border-radius: 50%;
		transition: all 500ms ease-in;
		will-change: transform;
	}
</style>
