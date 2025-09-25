<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import FormField from '$components/misc/FormField.svelte';
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
			createDialog({
				id: 'create-version-validation-error',
				type: 'small',
				title: 'Validation Error',
				icon: 'warn-red',
				bodyText: 'Missing required fields',
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

		// Validate download_url contains shortcut_name query parameter
		let url;
		try {
			url = new URL(trimmedUrl);
		} catch (urlError) {
			createDialog({
				id: 'create-version-validation-error',
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
			createDialog({
				id: 'create-version-validation-error',
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
				createDialog({
					id: 'create-version-success',
					type: 'small',
					title: 'Success',
					icon: 'warn-red',
					bodyText: 'Version created successfully!',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {
								// Clear form
								version_number = '';
								patch_notes = '';
								download_url = '';
								// Redirect to package page
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
					id: 'create-version-error',
					type: 'small',
					title: 'Error Creating Version',
					icon: 'warn-red',
					bodyText: data.message || 'Failed to create version',
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
				id: 'create-version-network-error',
				type: 'small',
				title: 'Network Error',
				icon: 'warn-red',
				bodyText: 'A network error occurred while creating the version',
				buttons: [
					{
						text: 'continue',
						main: true,
						action: () => {}
					}
				]
			});
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