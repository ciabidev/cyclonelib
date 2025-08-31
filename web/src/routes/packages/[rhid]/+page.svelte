<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import MainButton from '$components/inputs-and-buttons/MainButton.svelte';

	/** @type {{name: string, description: string, rhid: number} | null} */
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
			<p class="rhid">RoutineHub ID: {packageData.rhid}</p>
		</div>
		<div class="package-content">
			<div class="description">
				<h2>Description</h2>
				<p>{packageData.description}</p>
			</div>
			<div class="actions">
				<MainButton
					content="View on RoutineHub"
					href="https://routinehub.co/shortcut/{packageData.rhid}"
					variant="primary"
				/>
				<MainButton
					content="Edit Package"
					href="/packages/{packageData.rhid}/edit"
					variant="primary"
				/>
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

	.rhid {
		color: var(--text-secondary);
		font-size: 0.9rem;
	}

	.package-content {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.description h2 {
		margin: 0 0 10px 0;
		font-size: 1.5rem;
		font-weight: 500;
	}

	.description p {
		margin: 0;
		line-height: 1.6;
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