<script>
	import Markdown from '$components/Markdown.svelte';
	import ProjectCard from '$components/ProjectCard.svelte';
	import Switcher from '$components/inputs-and-buttons/Switcher.svelte';
	import PageContainer from '$components/PageContainer.svelte';

	let { data } = $props();
	let packageData = $derived(data.pkg);
	let versions = $derived(data.versions || []);
	let activeTab = $state('main-info');
	let name = $state('name');
	let short_description = $state('short_description');
	let long_description = $state('long_description');

</script>

<PageContainer containerId="package-details-page-container" pageId="package-details-page" maxWidth="800px">
	{#if packageData}
		<a class="button " href="/packages">Back to Packages</a>
		<div class="package-header paragraph-text">
			<h1>{name}</h1>
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
					<div class="package-content">
						{#if short_description}
							<div class="short-description paragraph-text">
								<strong>Short Description:</strong> {short_description}
							</div>
						{/if}
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
				</div>
			{/if}
		</div>
	{:else}
		<p>Package not found.</p>
	{/if}
</PageContainer>

<style>
	.package-header {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.package-header h1 {
		margin: 0;
		font-size: 2rem;
		font-weight: 600;
	}

	.package-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.tab-content {
		margin-top: 20px;
	}

	.versions-tab, .main-info-tab {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.versions-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 15px;
	}

	.versions-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
</style>