<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/PageContainer.svelte';
	import FormField from '$components/FormField.svelte';
	import { showErrorDialog } from '$lib/utils/dialog-helpers';
	import { createDialog, closeDialogAnimated } from '$lib/state/dialogs';

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
				showErrorDialog('load-package-error', 'Error Loading Package', 'Failed to load package details.');
			}
		} catch (err) {
			showErrorDialog('load-package-network-error', 'Error Loading Package', 'An error occurred while loading package details.');
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
			showErrorDialog('update-package-validation-error', 'Validation Error', 'All fields are required');
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
				showErrorDialog('update-package-success', 'Success', 'Package updated successfully!', () => {
					setTimeout(() => {
						goto(`/packages/${nameParam}`);
					}, 200);
				});
			} else {
				const data = await response.json();
				showErrorDialog('update-package-error', 'Error Updating Package', data.message || 'Failed to update package');
			}
		} catch (err) {
			showErrorDialog('update-package-network-error', 'Network Error', 'Network error occurred while updating package');
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
				showErrorDialog('delete-package-success', 'Success', 'Package deleted successfully!', () => {
					setTimeout(() => {
						goto('/packages');
					}, 200);
				});
			} else {
				const data = await response.json();
				closeDialogAnimated('delete-package-dialog');
				showErrorDialog('delete-package-error', 'Error Deleting Package', data.message || 'Failed to delete package');
			}
		} catch (err) {
			closeDialogAnimated('delete-package-dialog');
			showErrorDialog('delete-package-network-error', 'Network Error', 'Network error occurred while deleting package');
		} finally {
			deleting = false;
		}
	}

	function showDeleteDialog() {
		if (!edit_code) {
			showErrorDialog('delete-package-edit-code-error', 'Edit Code Required', 'Edit code is required to delete this package');
			return;
		}

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

<PageContainer containerId="edit-package-page-container" pageId="edit-package-page">
	<h1>Edit Package</h1>
	<p>Modify the package details below.</p>
	<a class="button " href="/packages/{nameParam}">Back to Package</a>

	{#if loading}
		<p>Loading package details...</p>
	{:else if packageData}
		<div class="form">
			<FormField label="Package Name" id="name">
				<Input id="name" placeholder="Enter package name" bind:value={name} />
				{#if formattedName}
					<small class="small-text" style="color: var(--main-color);">
						Name will be: <strong>{formattedName}</strong>
					</small>
				{/if}
			</FormField>
			<FormField label="Short Description" id="short_description">
				<Input id="short_description" placeholder="Enter short description (brief summary)" bind:value={short_description} />
			</FormField>
			<FormField label="Long Description" id="long_description">
				<Input id="long_description" placeholder="Enter detailed description" bind:value={long_description} long={true} />
			</FormField>
			<!-- Download URL field commented out for versioning system -->
			<!--
			<FormField label="Download URL" id="download_url">
				<Input id="download_url" placeholder="Enter Download URL with ?shortcut_name= parameter" bind:value={download_url} />
			</FormField>
			-->
			<FormField label="Edit Code" id="edit_code">
				<Input id="edit_code" placeholder="Enter edit code to confirm changes" bind:value={edit_code} />
			</FormField>
			<div class="actions">
				<button class="button button--primary" onclick={updatePackage}>{updating ? 'Updating...' : 'Update Package'}</button>
				<button class="button button--danger" onclick={deletePackage}>{deleting ? 'Deleting...' : 'Delete Package'}</button>
			</div>
		</div>
	{:else}
		<p>Package not found.</p>
	{/if}
</PageContainer>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>