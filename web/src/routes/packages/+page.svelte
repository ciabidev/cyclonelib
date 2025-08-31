<script>
	import { onMount } from 'svelte';
	import ProjectCard from '$components/ProjectCard.svelte'; /* the Cyclone website is forked from Ciabi's website, and I run both the Ciabi and Cyclone website. Old names may still be used. */
	import MainButton from '$components/inputs-and-buttons/MainButton.svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	// @ts-ignore
	import SearchIcon from '~icons/streamline-flex/magnifying-glass-remix';
/** @type {Array<{name: string, description: string, rhid: number, created_at?: string}>} */
	let packages = $state([]);
	let searchQuery = $state('');
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

			const response = await fetch('/api/packages', {
				signal: controller.signal
			});
			clearTimeout(timeoutId);

			if (response.ok) {
				packages = await response.json();
				// Sort by created_at descending (newest first), handle missing created_at as oldest
				packages.sort((a, b) => {
					const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
					const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
					return bDate - aDate;
				});
			} else {
				error = 'Failed to load packages. Please try again later.';
				console.error('Failed to fetch packages:', response.status);
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				error = 'Request timed out. Please check your connection.';
			} else {
				error = 'An error occurred while loading packages.';
				console.error('Error fetching packages:', err);
			}
		} finally {
			loading = false;
		}
	});

	// Filter packages based on search query
	let filteredPackages = $derived(
		searchQuery.trim() === ''
			? packages
			: packages.filter(pkg =>
				pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);
</script>

<div class="projects-page-wrapper">
	<main class="header">
		<h1>packages</h1>
		<p>all of the packages can be found here. anonymous</p>
	</main>
	<div class="search-container">
		<Input placeholder="search packages" width="60%" min_width="500px" bind:value={searchQuery} Icon={SearchIcon} />
	</div>
	<div class="options">
		<MainButton content="Create Package" href="/packages/create" variant="primary" />
	</div>
	<div class="projects">
		{#if loading}
			<p>Loading packages...</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else}
			{#each filteredPackages as pkg}
				<ProjectCard
					name={pkg.name}
					description={pkg.description}
					url={`https://routinehub.co/shortcut/${pkg.rhid}`}
					urlshort={`routinehub.co/shortcut/${pkg.rhid}`}
					img=""
					banner=""
					tiny={`RoutineHub ID: ${pkg.rhid}`}
					rhid={pkg.rhid}
				></ProjectCard>
			{:else}
				<p>No packages found.</p>
			{/each}
		{/if}
	</div>
</div>

<style>
	.projects-page-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: max-content;
		height: 100%;
		gap: 20px;
		overscroll-behavior: none;
		padding: calc(var(--padding) + 15px);
	}

	.options {
		display: flex;
		flex-direction: row;
		gap: 20px;
	}

	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: 20px;
	}

	.search-container {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.projects {
		justify-content: center;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 15px;
		display: flex;
		max-width: 100%;
		width: 100%;
	}

	.error {
		color: red;
		text-align: center;
		font-weight: bold;
	}

	@media only screen and (max-height: 400px) {
		.projects-page-wrapper {
			justify-content: center;
			align-items: center;
			height: max-content;
		}
	}
</style>

