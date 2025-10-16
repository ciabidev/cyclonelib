<script lang="ts">
	import ProjectCard from '$components/misc/ProjectCard.svelte'; /* the Cyclone website is forked from Ciabi's website, and I run both the Ciabi and Cyclone website. Old names may still be used. */
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import type { Package } from '$lib/types/api';
	// @ts-ignore
	import SearchIcon from '~icons/streamline-flex/magnifying-glass-remix';

	let packages = $state<Package[]>([]);
	let searchQuery = $state('');

	// Fetch packages from API
	$effect(() => {
		fetch('/api/packages')
			.then(r => r.json())
			.then(data => {
				packages = data;
			})
			.catch(err => {
				console.error('Failed to fetch packages:', err);
			});
	});

	// Filter packages based on search query
	let filteredPackages = $derived(
		searchQuery.trim() === ''
			? packages
			: packages.filter(
					(pkg:any) =>
						pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						(pkg.short_description && pkg.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
						(pkg.long_description && pkg.long_description.toLowerCase().includes(searchQuery.toLowerCase()))
				)
	);
</script>

<PageContainer containerId="packages-page-container" pageId="packages-page">
	<div class="header paragraph-text">
		<h1>packages</h1>
	</div>
	<Input
		placeholder="search packages"
		bind:value={searchQuery}
		min_width="100%"
		Icon={SearchIcon}
	/>
	<div class="actions">
		<a class="button button--primary" href="/packages/create">Create Package</a>
	</div>
	<div class="packages">
		{#each filteredPackages as pkg}
			<!-- "package" is reserved here-->
			<ProjectCard
				name={pkg.name}
				url=""
				urlshort=""
				description={pkg.short_description}
				img=""
				banner=""
			>
				<a class="button" href="/packages/{pkg.name}">View Package</a>
			</ProjectCard>
		{:else}
			<p class="paragraph-text">No packages found.</p>
		{/each}
	</div>
</PageContainer>

<style>
	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		gap: 1.25rem;
	}

	.packages {
		justify-content: center;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 0.9375rem;
		display: flex;
		width: 100%;
	}

	@media only screen and (max-width: 37.5rem) {
		.packages {
			flex-direction: column;
			gap: 0.625rem;
		}
	}
</style>
