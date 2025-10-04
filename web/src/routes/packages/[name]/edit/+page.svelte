<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import FormField from '$components/misc/FormField.svelte';
	import { createDialog } from '$lib/state/dialogs';

	/** @type {{name: string, short_description?: string, long_description?: string, download_url: string} | null} */
	let packageData = $state(null);
	let packageName = page.params.name;
	let name = $state('');
	let short_description = $state('');
	let long_description = $state('');
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
			const response = await fetch(`/api/packages/${packageName}`);
			if (response.ok) {
				packageData = await response.json();
				if (packageData) {
					name = packageData.name;
					short_description = packageData.short_description || '';
					long_description = packageData.long_description || '';
				}
			} else {
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
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (!trimmedName || !trimmedEditCode) {
			createDialog({
				id: 'update-package-validation-error',
				type: 'small',
				title: 'Validation Error',
				icon: 'warn-red',
				bodyText: 'Required fields are missing',
				buttons: [
					{
						text: 'continue',
						main: true,
						action: () => {}
					}
				]
			});
			return;
		}

		updating = true;

		try {
			const response = await fetch(`/api/packages/${packageName}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formattedName,
					short_description: trimmedShortDesc,
					long_description: trimmedLongDesc,
					edit_code: trimmedEditCode
				})
			});

			if (response.ok) {
				createDialog({
					id: 'update-package-success',
					type: 'small',
					title: 'Success',
					icon: 'warn-red',
					bodyText: 'Package updated successfully!',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {
								setTimeout(() => {
									goto(`/packages/${packageName}`);
								}, 200);
							}
						}
					]
				});
			} else {
				const data = await response.json();
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
			}
		} catch (err) {
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
		} finally {
			updating = false;
		}
	}

	async function performDelete() {
		   deleting = true;

		   try {
			   const response = await fetch(`/api/packages/${packageName}`, {
				   method: 'DELETE',
				   headers: { 'Content-Type': 'application/json' },
				   body: JSON.stringify({
					   edit_code
				   })
			   });

			   if (response.ok) {
				   createDialog({
					   id: 'delete-package-success',
					   type: 'small',
					   title: 'Success',
					   icon: 'warn-red',
					   bodyText: 'Package deleted successfully!',
					   buttons: [
						   {
							   text: 'continue',
							   main: true,
							   action: () => {
								   setTimeout(() => {
									   goto('/packages');
								   }, 200);
								   deleting = false;
							   }
						   }
					   ]
				   });
			   } else {
				   const data = await response.json();
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
							   action: () => { deleting = false; }
						   }
					   ]
				   });
			   }
		   } catch (err) {
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
						   action: () => { deleting = false; }
					   }
				   ]
			   });
		   }
	}

	function showDeleteDialog() {
		if (!edit_code) {
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
					text: 'delete',
					color: 'red',
					main: false,
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
	<section class="paragraph-text">
		<h1>Edit Package</h1>
		<p>Modify the package details below.</p>
	</section>
	<a class="button " href="/packages/{packageName}">Back to Package</a>

	{#if loading}
		<p>Loading package details...</p>
	{:else if packageData}
		<div class="form">
			<FormField label="Package Name" id="name">
				<Input id="name" placeholder="Enter package name" bind:value={name} />
				{#if formattedName}
					<small class="subtext" style="color: var(--main-color);">
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