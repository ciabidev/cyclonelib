<script>
	import { onMount } from 'svelte';
	import ProjectCard from '$components/ProjectCard.svelte'; /* the Cyclone website is forked from Ciabi's website, and I run both the Ciabi and Cyclone website. Old names may still be used. */
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import { createDialog, killDialog } from '$lib/state/dialogs';
	// @ts-ignore
	import SearchIcon from '~icons/streamline-flex/magnifying-glass-remix';
	/** @type {Array<{name: string, short_description: string, long_description: string, rhid: number, created_at?: string}>} */
	let packages = $state([]);
	let searchQuery = $state('');
	let loading = $state(true);

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
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'load-packages-error',
					type: 'small',
					title: 'Error Loading Packages',
					icon: 'warn-red',
					bodyText: 'Failed to load packages. Please try again later.',
					buttons: [
						{
							text: 'ok',
							main: true,
							action: () => {}
						}
					]
				});
				console.error('Failed to fetch packages:', response.status);
			}
		} catch (err) {
			// Clear any existing dialogs first
			killDialog();
			let errorMessage = 'An error occurred while loading packages.';
			if (err instanceof Error && err.name === 'AbortError') {
				errorMessage = 'Request timed out. Please check your connection.';
			}
			createDialog({
				id: 'load-packages-error',
				type: 'small',
				title: 'Error Loading Packages',
				icon: 'warn-red',
				bodyText: errorMessage,
				buttons: [
					{
						text: 'ok',
						main: true,
						action: () => {}
					}
				]
			});
			console.error('Error fetching packages:', err);
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
				pkg.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				pkg.long_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				String(pkg.rhid).includes(searchQuery)
			)
	);
</script>

<div class="page-wrapper">
	<div class="header long-text">
		<h1>packages</h1>
		<p>all of the packages can be found here. anonymous</p>
	</div>
	<div class="search-container">
		<Input placeholder="search packages" bind:value={searchQuery} min_width="100%" Icon={SearchIcon} />
	</div>
	<div class="options">
		<a class="button button--primary" href="/packages/create">Create Package</a>
	</div>
	<div class="projects">
		{#if loading}
			<p>Loading packages...</p>
		{:else}
			{#each filteredPackages as pkg}
				<ProjectCard
					name={pkg.name}
					description={pkg.short_description}
					url={`https://routinehub.co/shortcut/${pkg.rhid}`}
					urlshort={`routinehub.co/shortcut/${pkg.rhid}`}
					img=""
					banner=""
					tiny={`RoutineHub ID: ${pkg.rhid}`}
					extra_html={[`<a class="button button--default" href="/packages/${pkg.rhid}">View Package</a>`]}
				></ProjectCard>
			{:else}
				<p class="long-text">No packages found.</p>
			{/each}
		{/if}
	</div>
</div>

<style>
	.page-wrapper {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100%;
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
		max-width: 700px;
		gap: 20px;
	}

	.search-container {
		display: flex;
		justify-content: center;
		max-width: 750px;
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


	@media only screen and (max-height: 400px) {
		.page-wrapper {
			justify-content: center;
			align-items: center;
			height: max-content;
		}
	}
</style>


