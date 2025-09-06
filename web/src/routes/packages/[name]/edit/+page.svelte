<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import { createDialog, killDialog, closeDialogAnimated } from '$lib/state/dialogs';

	/** @type {{name: string, short_description?: string, long_description?: string, download_url: string} | null} */
	let packageData = $state(null);
	let nameParam = $page.params.name;
	let name = $state('');
	let short_description = $state('');
	let long_description = $state('');
	// let download_url = $state(''); // Commented out for versioning system
	let edit_code = $state('');
	let loading = $state(true);
	let updating = $state(false);
	let deleting = $state(false);

	// Format the package name for preview
	let formattedName = $derived(
		name.trim()
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-|-$/g, '') // Remove leading/trailing hyphens
	);

	onMount(async () => {
		try {
			const response = await fetch(`/api/packages/${nameParam}`);
			if (response.ok) {
				packageData = await response.json();
				if (packageData) {
					name = packageData.name;
					short_description = packageData.short_description || '';
					long_description = packageData.long_description || '';
					// download_url = packageData.download_url; // Commented out for versioning system
				}
			} else {
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'load-package-error',
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
		} catch (err) {
			// Clear any existing dialogs first
			killDialog();
			createDialog({
				id: 'load-package-network-error',
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

	async function updatePackage() {
		// Trim whitespace from inputs with null checks and string conversion
		const trimmedName = String(name || '').trim();
		const trimmedShortDesc = String(short_description || '').trim();
		const trimmedLongDesc = String(long_description || '').trim();
		// const trimmedPackageUrl = String(download_url || '').trim(); // Commented out for versioning system
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (!trimmedName || !trimmedShortDesc || !trimmedLongDesc || /* !trimmedPackageUrl || */ !trimmedEditCode) {
			// Clear any existing dialogs first
			killDialog();
			// Add a small delay before creating the error dialog to ensure proper dialog management
			setTimeout(() => {
				createDialog({
					id: 'update-package-validation-error',
					type: 'small',
					title: 'Validation Error',
					icon: 'warn-red',
					bodyText: 'All fields are required',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}, 200);
			return;
		}

		// Validate download_url contains shortcut_name query parameter
		// Commented out for versioning system - will be handled in version creation
		/*
		let url;
		try {
			url = new URL(trimmedPackageUrl);
		} catch (urlError) {
			// Clear any existing dialogs first
			killDialog();
			// Add a small delay before creating the error dialog to ensure proper dialog management
			setTimeout(() => {
				createDialog({
					id: 'update-package-validation-error',
					type: 'small',
					title: 'Validation Error',
					icon: 'warn-red',
					bodyText: 'Invalid URL format. Please enter a valid URL.',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}, 200);
			return;
		}

		const shortcutName = url.searchParams.get('shortcut_name');
		if (!shortcutName) {
			// Clear any existing dialogs first
			killDialog();
			// Add a small delay before creating the error dialog to ensure proper dialog management
			setTimeout(() => {
				createDialog({
					id: 'update-package-validation-error',
					type: 'small',
					title: 'Validation Error',
					icon: 'warn-red',
					bodyText: 'Download URL must include ?shortcut_name= query parameter',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}, 200);
			return;
		}
		*/

		updating = true;

		try {
			const response = await fetch(`/api/packages/${nameParam}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formattedName,
					short_description: trimmedShortDesc,
					long_description: trimmedLongDesc,
					// download_url: trimmedPackageUrl, // Commented out for versioning system
					edit_code: trimmedEditCode
				})
			});

			if (response.ok) {
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'update-package-success',
					type: 'small',
					title: 'Success',
					bodyText: 'Package updated successfully!',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {
								// Small delay to allow dialog to close properly before navigation
								setTimeout(() => {
									goto(`/packages/${nameParam}`);
								}, 200);
							}
						}
					]
				});
			} else {
				const data = await response.json();
				// Clear any existing dialogs first
				killDialog();
				// Add a small delay before creating the error dialog to ensure proper dialog management
				setTimeout(() => {
					createDialog({
						id: 'update-package-error',
						type: 'small',
						title: 'Error Updating Package',
						icon: 'warn-red',
						bodyText: data.message || 'Failed to update package',
						buttons: [
							{
								text: 'continue',
								main: true,
								action: () => {}
							}
						]
					});
				}, 200);
			}
		} catch (err) {
			// Clear any existing dialogs first
			killDialog();
			// Add a small delay before creating the error dialog to ensure proper dialog management
			setTimeout(() => {
				createDialog({
					id: 'update-package-network-error',
					type: 'small',
					title: 'Network Error',
					icon: 'warn-red',
					bodyText: 'Network error occurred while updating package',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}, 200);
		} finally {
			updating = false;
		}
	}

	async function performDelete() {
		deleting = true;

		try {
			const response = await fetch(`/api/packages/${nameParam}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					edit_code
				})
			});

			if (response.ok) {
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'delete-package-success',
					type: 'small',
					title: 'Success',
					bodyText: 'Package deleted successfully!',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {
								// Small delay to allow dialog to close properly before navigation
								setTimeout(() => {
									goto('/packages');
								}, 200);
							}
						}
					]
				});
			} else {
				const data = await response.json();
				// Close the confirmation dialog with animation
				closeDialogAnimated('delete-package-dialog');
				// Add a small delay before creating the error dialog to ensure proper dialog management
				setTimeout(() => {
					createDialog({
						id: 'delete-package-error',
						type: 'small',
						title: 'Error Deleting Package',
						icon: 'warn-red',
						bodyText: data.message || 'Failed to delete package',
						buttons: [
							{
								text: 'continue',
								main: true,
								action: () => {}
							}
						]
					});
				}, 200);
			}
		} catch (err) {
			// Close the confirmation dialog with animation
			closeDialogAnimated('delete-package-dialog');
			// Add a small delay before creating the error dialog to ensure proper dialog management
			setTimeout(() => {
				createDialog({
					id: 'delete-package-network-error',
					type: 'small',
					title: 'Network Error',
					icon: 'warn-red',
					bodyText: 'Network error occurred while deleting package',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}, 200);
		} finally {
			deleting = false;
		}
	}

	function showDeleteDialog() {
		if (!edit_code) {
			// Clear any existing dialogs first
			killDialog();
			// Add a small delay before creating the error dialog to ensure proper dialog management
			setTimeout(() => {
				createDialog({
					id: 'delete-package-edit-code-error',
					type: 'small',
					title: 'Edit Code Required',
					icon: 'warn-red',
					bodyText: 'Edit code is required to delete this package',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {}
						}
					]
				});
			}, 200);
			return;
		}

		// Clear any existing dialogs first
		killDialog();
		createDialog({
			id: 'delete-package-dialog',
			type: 'small',
			title: 'Delete Package',
			icon: 'warn-red',
			bodyText: 'Are you sure you want to delete this package? This action cannot be undone.',
			buttons: [
				{
					text: 'cancel',
					main: false,
					action: () => {
						// Dialog will close automatically
					}
				},
				{
					text: 'Delete',
					color: 'red',
					main: true,
					action: performDelete
				}
			]
		});
	}

	async function deletePackage() {
		showDeleteDialog();
	}
</script>

<div class="page-wrapper">
	<div class="main">
		<h1>Edit Package</h1>
		<p>Modify the package details below.</p>
		<a class="button button--default" href="/packages/{nameParam}">Back to Package</a>

		{#if loading}
			<p>Loading package details...</p>
		{:else if packageData}
			<div class="form">
				<div class="field">
					<label for="name">Package Name</label>
					<Input id="name" placeholder="Enter package name" bind:value={name} />
				{#if formattedName}
					<small class="small-text" style="color: var(--main-color);">
						Name will be: <strong>{formattedName}</strong>
					</small>
				{/if}
				</div>
				<div class="field">
					<label for="short_description">Short Description</label>
					<Input id="short_description" placeholder="Enter short description (brief summary)" bind:value={short_description} />
				</div>
				<div class="field">
					<label for="long_description">Long Description</label>
					<Input id="long_description" placeholder="Enter detailed description" bind:value={long_description} long={true} />
				</div>
				<!-- Download URL field commented out for versioning system -->
				<!--
				<div class="field">
					<label for="download_url">Download URL</label>
					<Input id="download_url" placeholder="Enter Download URL with ?shortcut_name= parameter" bind:value={download_url} />
				</div>
				-->
				<div class="field">
					<label for="edit_code">Edit Code</label>
					<Input id="edit_code" placeholder="Enter edit code to confirm changes" bind:value={edit_code} />
				</div>
				<div class="buttons">
					<button class="button button--primary" onclick={updatePackage}>{updating ? 'Updating...' : 'Update Package'}</button>
					<button class="button button--danger" onclick={deletePackage}>{deleting ? 'Deleting...' : 'Delete Package'}</button>
				</div>
			</div>
		{:else}
			<p>Package not found.</p>
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
		min-height: 100%;
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


	@media only screen and (max-height: 25rem) {
		.page-wrapper {
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			height: max-content;
		}
	}
</style>