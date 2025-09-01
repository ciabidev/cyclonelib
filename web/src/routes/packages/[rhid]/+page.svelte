<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Markdown from '$components/Markdown.svelte';

	/** @type {{name: string, short_description?: string, long_description?: string, rhid: number} | null} */
	let packageData = $state(null);
	let loading = $state(true);
	let error = $state('');

	onMount(async () => {
		try {
			const response = await fetch(`/api/packages/${$page.params.rhid}`);
			if (response.ok) {
				packageData = await response.json();
			} else {
				error = 'Failed to load package details.';
			}
		} catch (err) {
			error = 'An error occurred while loading package details.';
			console.error('Error fetching package:', err);
		} finally {
			loading = false;
		}
	});
</script>

<div class="package-details-wrapper">
	{#if loading}
		<p>Loading package details...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if packageData}
		<div class="package-header">
			<h1>{packageData.name}</h1>
		</div>
		<div class="package-content">
			{#if packageData.short_description}
				<div class="short-description">
					<b>Short Description:</b> {packageData.short_description}
				</div>
			{/if}
			{#if packageData.long_description}
				<div class="long-description">
					<h1>Detailed Description</h1>
					<Markdown source={packageData.long_description} />
				</div>
			{/if}
			<div class="actions">
				<a class="button button--primary" href="https://routinehub.co/shortcut/{packageData.rhid}">View on RoutineHub</a>
				<a class="button button--primary" href="/packages/{packageData.rhid}/edit">Edit Package</a>
			</div>
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


	.package-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.short-description h2 {
		margin: 0 0 10px 0;
		font-size: 1.5rem;
		font-weight: 500;
	}

	.short-description p {
		margin: 0;
		line-height: 1.6;
	}

	.long-description h2 {
		margin: 0 0 10px 0;
		font-size: 1.5rem;
		font-weight: 500;
	}

	.actions {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
	}

	.error {
		color: red;
		text-align: center;
		font-weight: bold;
	}
</style>