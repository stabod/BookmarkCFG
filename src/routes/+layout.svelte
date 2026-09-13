<script>
	import favicon from '$lib/assets/star.png';
	import '$lib/style.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
