<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Markdown from '$components/Markdown.svelte';
	import ProjectCard from '$components/ProjectCard.svelte';
	import Switcher from '$components/inputs-and-buttons/Switcher.svelte';
	import { createDialog, killDialog } from '$lib/state/dialogs';

	/** @type {{name: string, short_description?: string, long_description?: string, download_url: string} | null} */
	let packageData = $state(null);
	let versions = $state([]);
	let loading = $state(true);
	let activeTab = $state('versions');

	onMount(async () => {
		try {
			const response = await fetch(`/api/packages/${$page.params.name}`);
			if (response.ok) {
				packageData = await response.json();
			} else {
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'load-package-details-error',
					type: 'small',
					title: 'Error Loading Package',
					icon: 'warn-red',
					bodyText: 'Failed to load package details.',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}

			// Load versions
			const versionsResponse = await fetch(`/api/packages/${$page.params.name}/versions`);
			if (versionsResponse.ok) {
				versions = await versionsResponse.json();
			}
		} catch (err) {
			// Clear any existing dialogs first
			killDialog();
			createDialog({
				id: 'load-package-details-network-error',
				type: 'small',
				title: 'Error Loading Package',
				icon: 'warn-red',
				bodyText: 'An error occurred while loading package details.',
				buttons: [
					{
						text: 'continue',
						main: true,
						action: () => {}
					}
				]
			});
			console.error('Error fetching package:', err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="package-details-wrapper">
	{#if loading}
		<p>Loading package details...</p>
	{:else if packageData}
		<a class="button button--default" href="/packages">Back to Packages</a>
		<div class="package-header">
			<h1>{packageData.name}</h1>
		</div>

		<Switcher full={true}>
			<button
				class="button button--secondary"
				class:active={activeTab === 'versions'}
				onclick={() => activeTab = 'versions'}
			>
				Versions
			</button>
			<button
				class="button button--secondary"
				class:active={activeTab === 'main-info'}
				onclick={() => activeTab = 'main-info'}
			>
				Main Info
			</button>
		</Switcher>

		<div class="tab-content">
			{#if activeTab === 'versions'}
				<div class="versions-tab">
					<div class="versions-header">
						<h2>Versions</h2>
						<a class="button button--primary" href="/packages/{packageData.name}/versions/create">Create Version</a>
					</div>
					<div class="versions-list">
						{#each versions as version}
							<ProjectCard
								name="Version {version.version_number}"
								description={version.patch_notes}
								url={version.download_url}
								urlshort={version.shortcut_name}
							>
						<div class="version-options">
							<a class="button button--default" href="/packages/{packageData.name}/versions/{encodeURIComponent(version.version_number)}/edit">Edit Version</a>
							<a class="button button--primary" href={version.download_url}>Download Shortcut</a>
						</div>
						</ProjectCard>
						{:else}
							<p>No versions found. <a href="/packages/{packageData.name}/versions/create">Create the first version</a></p>
						{/each}
					</div>
				</div>
			{:else if activeTab === 'main-info'}
				<div class="main-info-tab">
					<div class="package-content">
						{#if packageData.short_description}
							<div class="short-description long-text">
								<strong>Short Description:</strong> {packageData.short_description}
							</div>
						{/if}
						{#if packageData.long_description}
							<div class="long-description long-text">
								<h1>Detailed Description</h1>
								<Markdown source={packageData.long_description} />
							</div>
						{/if}
						<div class="actions">
							<a class="button button--primary" href="/packages/{packageData.name}/edit">Edit Package</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<p>Package not found.</p>
	{/if}
</div>

<style>
	.package-details-wrapper {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: calc(var(--padding) + 15px);
		display: flex;
		flex-direction: column;
		gap: 20px;
		min-height: 100%;
	}

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

	.version-options {
		display: flex;
		gap: 15px;
		flex-direction: row;
	}
	.package-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.actions {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
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