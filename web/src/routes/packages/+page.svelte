<script lang="ts">
	import ProjectCard from '$components/misc/ProjectCard.svelte'; /* the Cyclone website is forked from Ciabi's website, and I run both the Ciabi and Cyclone website. Old names may still be used. */
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	// @ts-ignore
	import SearchIcon from '~icons/streamline-flex/magnifying-glass-remix';

	let { data } = $props();
	let packages = $derived(data.packages);
	let searchQuery = $state('');

	// Filter packages based on search query
	let filteredPackages = $derived(
		searchQuery.trim() === ''
			? packages
			: packages.filter(
					(pkg:any) =>
						pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						pkg.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
						pkg.long_description.toLowerCase().includes(searchQuery.toLowerCase())
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
