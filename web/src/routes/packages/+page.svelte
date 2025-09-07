<script>
	import { onMount } from 'svelte';
	import ProjectCard from '$components/ProjectCard.svelte'; /* the Cyclone website is forked from Ciabi's website, and I run both the Ciabi and Cyclone website. Old names may still be used. */
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/PageContainer.svelte';
	import { showErrorDialog, showNetworkErrorDialog } from '$lib/utils/dialog-helpers';
	// @ts-ignore
	import SearchIcon from '~icons/streamline-flex/magnifying-glass-remix';
	/** @type {Array<{name: string, short_description: string, long_description: string, download_url: string, created_at?: string}>} */
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
				showErrorDialog('load-packages-error', 'Error Loading Packages', 'Failed to load packages. Please try again later.');
				console.error('Failed to fetch packages:', response.status);
			}
		} catch (err) {
			let errorMessage = 'An error occurred while loading packages.';
			if (err instanceof Error && err.name === 'AbortError') {
				errorMessage = 'Request timed out. Please check your connection.';
			}
			showNetworkErrorDialog('load-packages-network-error', 'loading packages');
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
				pkg.download_url.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);
</script>

<PageContainer containerId="packages-page-container" pageId="packages-page">
	<div class="header long-text">
		<h1>packages</h1>
		<p>all of the packages can be found here. anonymous</p>
	</div>
	<Input placeholder="search packages" bind:value={searchQuery} min_width="100%" Icon={SearchIcon} />
	<div class="actions">
		<a class="button button--primary" href="/packages/create">Create Package</a>
	</div>
	<div class="packages">
		{#if loading}
			<p>Loading packages...</p>
		{:else}
			{#each filteredPackages as pkg}
				<ProjectCard
					name={pkg.name}
					description={pkg.short_description}
					img=""
					banner=""
					extra_html={[`<a class="button " href="/packages/${pkg.name}">View Package</a>`]}
				></ProjectCard>
			{:else}
				<p class="long-text">No packages found.</p>
			{/each}
		{/if}
	</div>
</PageContainer>

<style>
	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: 20px;
	}

	.packages {
		justify-content: center;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 15px;
		display: flex;
		width: 100%;
	}

	@media only screen and (max-width: 600px) {
		.packages {
			flex-direction: column;
			gap: 10px;
		}
	}
</style>


