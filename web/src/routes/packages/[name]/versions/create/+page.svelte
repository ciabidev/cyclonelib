<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/PageContainer.svelte';
	import FormField from '$components/FormField.svelte';
	import { showErrorDialog } from '$lib/utils/dialog-helpers';
	import { createDialog } from '$lib/state/dialogs';

	let version_number = $state('');
	let patch_notes = $state('');
	let download_url = $state('');
	let edit_code = $state('');
	let loading = $state(false);

	// Get package name from URL
	let packageName = $page.params.name;

	async function submit() {
		// Trim whitespace from inputs
		const trimmedVersion = String(version_number || '').trim();
		const trimmedNotes = String(patch_notes || '').trim();
		const trimmedUrl = String(download_url || '').trim();
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (!trimmedVersion || !trimmedNotes || !trimmedUrl || !trimmedEditCode) {
			showErrorDialog('create-version-validation-error', 'Validation Error', 'Missing required fields');
			return;
		}

		// Validate download_url contains shortcut_name query parameter
		let url;
		try {
			url = new URL(trimmedUrl);
		} catch (urlError) {
			showErrorDialog('create-version-validation-error', 'Validation Error', 'Invalid URL format. Please enter a valid URL.');
			return;
		}

		const shortcutName = url.searchParams.get('shortcut_name');
		if (!shortcutName) {
			showErrorDialog('create-version-validation-error', 'Validation Error', 'Download URL must include ?shortcut_name= query parameter');
			return;
		}

		loading = true;

		try {
			const response = await fetch(`/api/packages/${packageName}/versions`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					version_number: trimmedVersion,
					patch_notes: trimmedNotes,
					download_url: trimmedUrl,
					edit_code: trimmedEditCode
				})
			});

			if (response.ok) {
				showErrorDialog('create-version-success', 'Success', 'Version created successfully!', () => {
					// Clear form
					version_number = '';
					patch_notes = '';
					download_url = '';
					// Redirect to package page
					setTimeout(() => {
						goto(`/packages/${packageName}`);
					}, 200);
				});
			} else {
				const data = await response.json();
				showErrorDialog('create-version-error', 'Error Creating Version', data.message || 'Failed to create version');
			}
		} catch (err) {
			showErrorDialog('create-version-network-error', 'Network Error', 'A network error occurred while creating the version');
		} finally {
			loading = false;
		}
	}
</script>

<PageContainer containerId="create-version-page-container" pageId="create-version-page">
	<section class="paragraph-text">
		<h1>Create Version for {packageName}</h1>
		<p>Create the first version for your package.</p>
	</section>
	<a class="button " href="/packages/{packageName}">Back to Package</a>

	<div class="form">
		<FormField label="Version Number" id="version_number">
			<Input id="version_number" placeholder="e.g., 1.0.0" bind:value={version_number} />
		</FormField>
		<FormField label="Patch Notes" id="patch_notes">
			<Input
				id="patch_notes"
				placeholder="Describe what's new in this version"
				bind:value={patch_notes}
				long={true}
			/>
		</FormField>
		<FormField label="Download URL" id="download_url" hint="Must include ?shortcut_name= query parameter (your exact Shortcut Name URL-Encoded). See Packages in the docs for more info.">
			<Input
				id="download_url"
				placeholder="Enter Download URL"
				bind:value={download_url}
			/>
		</FormField>
		<FormField label="Edit Code" id="edit_code" required={true} value={edit_code}>
			<Input id="edit_code" placeholder="Enter edit code to confirm changes" bind:value={edit_code} />
		</FormField>
		<button class="button button--primary" onclick={submit}
			>{loading ? 'Creating...' : 'Create Version'}</button
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