<script lang="ts">
	import Markdown from '$components/misc/Markdown.svelte';
	import ProjectCard from '$components/misc/ProjectCard.svelte';
	import Switcher from '$components/inputs-and-buttons/Switcher.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import type { Package } from '$lib/types/api';
	let { data } = $props();

	let packageData: Package | null = $derived(data.pkg as Package | null);
	let versions = $derived(data.versions || []);
	let activeTab = $state('main-info');
	let name = $derived(packageData?.name || '');
	let short_description = $derived(packageData?.short_description || '');
	let long_description = $derived(packageData?.long_description || '');

</script>

<PageContainer containerId="package-details-page-container" pageId="package-details-page" maxWidth="50rem">
	{#if packageData}
		<a class="button " href="/packages">Back to Packages</a>
		<div class="package-header">
			<h1>{name}</h1>
			{#if short_description}
				<div class="short-description paragraph-text">
					{short_description}
				</div>
			{/if}
		</div>

		<Switcher full={true}>
			<button
				class="button "
				class:active={activeTab === 'main-info'}
				onclick={() => activeTab = 'main-info'}
			>
				Main Info
			</button>
			<button
				class="button "
				class:active={activeTab === 'versions'}
				onclick={() => activeTab = 'versions'}
			>
				Versions
			</button>
		</Switcher>

		<div class="tab-content">
			{#if activeTab === 'versions'}
				<div class="versions-tab">
					<div class="versions-header">
						<h2>Versions</h2>
						<div class="actions">
							<a class="button button--primary" href="/packages/{name}/versions/create">Create Version</a>
						</div>
					</div>
					<div class="versions-list">
						{#each versions as version}
							<ProjectCard
								name="Version {version.version_number}"
								url=""
								urlshort=""
								description={version.patch_notes}
							>
							<div class="actions">
								<a class="button " href="/packages/{name}/versions/{encodeURIComponent(version.version_number)}/edit">Edit Version</a>
								<a class="button button--primary" href={version.download_url}>Download Shortcut</a>
							</div>
						</ProjectCard>
						{:else}
							<p>No versions found. <a href="/packages/{name}/versions/create">Create the first version</a></p>
						{/each}
					</div>
				</div>
			{:else if activeTab === 'main-info'}
				<div class="main-info-tab">
					{#if long_description}
						<div class="long-description paragraph-text">
							<h1>Detailed Description</h1>
							<Markdown source={long_description} />
						</div>
					{/if}
					<div class="actions">
						<a class="button button--primary" href="/packages/{name}/edit">Edit Package</a>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<p>Package not found.</p>
	{/if}
</PageContainer>

<style>

	.package-header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 600;
	}

	.versions-tab, .main-info-tab {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.versions-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: .9375rem;
	}

	.versions-list {
		display: flex;
		flex-direction: column;
		gap: .9375rem;
	}
</style>