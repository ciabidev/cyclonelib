<script>
	import { goto } from '$app/navigation';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/PageContainer.svelte';
	import FormField from '$components/FormField.svelte';
	import { showErrorDialog } from '$lib/utils/dialog-helpers';
	import { createDialog } from '$lib/state/dialogs';

	let name = $state('');

	let short_description = $state('');
	let long_description = $state('');
	// let download_url = $state(''); // Commented out for versioning system
	let edit_code = $state('');
	let loading = $state(false);

	// Format the package name for preview
	let formattedName = $derived(
		name
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-|-$/g, '') // Remove leading/trailing hyphens
	);

	async function submit() {
		// Trim whitespace from inputs with null checks and string conversion
		const trimmedName = String(name || '').trim();
		const trimmedShortDesc = String(short_description || '').trim();
		const trimmedLongDesc = String(long_description || '').trim();
		// const trimmedPackageUrl = String(download_url || '').trim(); // Commented out for versioning system
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (
			!formattedName ||
			!trimmedShortDesc ||
			!trimmedLongDesc ||
			// !trimmedPackageUrl || // Commented out for versioning system
			!trimmedEditCode
		) {
			showErrorDialog('create-package-validation-error', 'Validation Error', 'All fields are required');
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
			createDialog({
				id: 'create-package-validation-error',
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
			return;
		}

		const shortcutName = url.searchParams.get('shortcut_name');
		if (!shortcutName) {
			// Clear any existing dialogs first
			killDialog();
			createDialog({
				id: 'create-package-validation-error',
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
			return;
		}
		*/

		loading = true;

		try {
			const response = await fetch('/api/packages', {
				method: 'POST',
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
				// Store the formatted name before clearing form
				const packageName = formattedName;
				showErrorDialog('create-package-success', 'Success', 'Package created successfully!', () => {
					// Clear form
					name = '';
					short_description = '';
					long_description = '';
					// download_url = ''; // Commented out for versioning system
					edit_code = '';
					// Small delay to allow dialog to close properly before navigation
					setTimeout(() => {
						// Redirect to version creation for the new package
						goto(`/packages/${packageName}/versions/create`);
					}, 200);
				});
			} else {
				const data = await response.json();
				showErrorDialog('create-package-error', 'Error Creating Package', data.message || 'Failed to create package');
			}
		} catch (err) {
			showErrorDialog('create-package-network-error', 'Network Error', 'a network error occurred while creating the package');
		} finally {
			loading = false;
		}
	}
</script>

<PageContainer containerId="create-package-page-container" pageId="create-package-page">
	<h1>Create Package</h1>
	<p>Fill in the details to create a new package.</p>
	<a class="button " href="/packages">Back to Packages</a>

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
			<Input
				id="short_description"
				placeholder="Enter short description (brief summary)"
				bind:value={short_description}
			/>
		</FormField>
		<FormField label="Long Description" id="long_description">
			<Input
				id="long_description"
				placeholder="Enter detailed description"
				bind:value={long_description}
				long={true}
			/>
		</FormField>
		<!-- Download URL field commented out for versioning system -->
		<!--
		<FormField label="Download URL" id="download_url" hint="Must include ?shortcut_name= query parameter (your exact Shortcut Name URL-Encoded). Example: https://www.icloud.com/shortcuts/32751811e2f04de99abff36399fa2bd7?shortcut_name=Simple%20Base64">
			<Input
				id="download_url"
				placeholder="Enter Download URL with ?shortcut_name= parameter"
				bind:value={download_url}
			/>
		</FormField>
		-->
		<FormField label="Edit Code" id="edit_code" hint="This is a secret code that is required to manage your package. Save it somewhere safe and don't share it!">
			<Input
				id="edit_code"
				placeholder="Enter edit code for future modifications"
				bind:value={edit_code}
			/>
		</FormField>
		<button class="button button--primary" onclick={submit}
			>{loading ? 'Creating...' : 'Create Package'}</button
		>
	</div>
</PageContainer>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
