<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import MainButton from '$components/inputs-and-buttons/MainButton.svelte';

	/** @type {{name: string, description: string, rhid: number} | null} */
	let packageData = $state(null);
	let rhidParam = $page.params.rhid;
	let name = $state('');
	let description = $state('');
	let rhid = $state('');
	let edit_code = $state('');
	let loading = $state(true);
	let updating = $state(false);
	let deleting = $state(false);
	let error = $state('');
	let success = $state('');

	onMount(async () => {
		try {
			const response = await fetch(`/api/packages/${rhidParam}`);
			if (response.ok) {
				packageData = await response.json();
				if (packageData) {
					name = packageData.name;
					description = packageData.description;
					rhid = packageData.rhid.toString();
				}
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

	async function updatePackage() {
		if (!name || !description || !rhid || !edit_code) {
			error = 'All fields are required';
			return;
		}
		if (isNaN(parseInt(rhid))) {
			error = 'RoutineHub ID must be a valid number';
			return;
		}

		updating = true;
		error = '';
		success = '';

		try {
			const response = await fetch(`/api/packages/${rhidParam}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					description,
					rhid: parseInt(rhid),
					edit_code
				})
			});

			if (response.ok) {
				success = 'Package updated successfully!';
				// Redirect to package detail page
				goto(`/packages/${rhidParam}`);
			} else {
				const data = await response.json();
				error = data.message || 'Failed to update package';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			updating = false;
		}
	}

	async function deletePackage() {
		if (!edit_code) {
			error = 'Edit code is required to delete';
			return;
		}

		if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
			return;
		}

		deleting = true;
		error = '';
		success = '';

		try {
			const response = await fetch(`/api/packages/${rhidParam}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					edit_code
				})
			});

			if (response.ok) {
				success = 'Package deleted successfully!';
				// Redirect to packages list
				goto('/packages');
			} else {
				const data = await response.json();
				error = data.message || 'Failed to delete package';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			deleting = false;
		}
	}
</script>

<div class="page-wrapper">
	<div class="main">
		<h1>Edit Package</h1>
		<p>Modify the package details below.</p>
		<MainButton content="Back to Package" href="/packages/{rhidParam}" />

		{#if loading}
			<p>Loading package details...</p>
		{:else if packageData}
			<div class="form">
				<div class="field">
					<label for="name">Package Name</label>
					<Input id="name" placeholder="Enter package name" bind:value={name} />
				</div>
				<div class="field">
					<label for="description">Description</label>
					<Input id="description" placeholder="Enter package description" bind:value={description} />
				</div>
				<div class="field">
					<label for="rhid">RoutineHub ID</label>
					<Input id="rhid" placeholder="Enter RoutineHub ID (number)" bind:value={rhid} type="number" />
				</div>
				<div class="field">
					<label for="edit_code">Edit Code</label>
					<Input id="edit_code" placeholder="Enter edit code to confirm changes" bind:value={edit_code} />
				</div>
				<div class="buttons">
					<MainButton
						content={updating ? 'Updating...' : 'Update Package'}
						variant="primary"
						onclick={updatePackage}
					/>
					<MainButton
						content={deleting ? 'Deleting...' : 'Delete Package'}
						variant="danger"
						onclick={deletePackage}
					/>
				</div>
			</div>
		{:else}
			<p>Package not found.</p>
		{/if}

		{#if error}
			<p class="error">{error}</p>
		{/if}
		{#if success}
			<p class="success">{success}</p>
		{/if}
	</div>
</div>

<style>
	.page-wrapper {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		min-height: max-content;
		height: 100%;
		overscroll-behavior: none;
		padding: calc(var(--padding) + 0.9375rem);
	}

	.main {
		width: 100%;
		max-width: 700px;
		gap: 1rem;
		display: flex;
		flex-direction: column;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: bold;
	}

	.buttons {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
	}

	.error {
		color: var(--color-error);
	}

	.success {
		color: var(--color-allgood);
	}

	@media only screen and (max-height: 25rem) {
		.page-wrapper {
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			height: max-content;
		}
	}
</style>