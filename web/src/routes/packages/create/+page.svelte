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
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (
			!formattedName ||
			!trimmedShortDesc ||
			!trimmedLongDesc ||
			!trimmedEditCode
		) {
			showErrorDialog('create-package-validation-error', 'Validation Error', 'All fields are required');
			return;
		}

		loading = true;

		try {
			const formData = new FormData();
			formData.append('name', formattedName);
			formData.append('short_description', trimmedShortDesc);
			formData.append('long_description', trimmedLongDesc);
			formData.append('edit_code', trimmedEditCode);

			const response = await fetch('/packages/create', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				// Store the formatted name before clearing form
				const packageName = formattedName;
				showErrorDialog('create-package-success', 'Success', 'Package created successfully!', () => {
					// Clear form
					name = '';
					short_description = '';
					long_description = '';
					edit_code = '';
					// Small delay to allow dialog to close properly before navigation
					setTimeout(() => {
						// Redirect to version creation for the new package
						goto(`/packages/${packageName}/versions/create`);
					}, 200);
				});
			} else {
				const data = await response.json();
				showErrorDialog('create-package-error', 'Error Creating Package', data.error || 'Failed to create package');
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
