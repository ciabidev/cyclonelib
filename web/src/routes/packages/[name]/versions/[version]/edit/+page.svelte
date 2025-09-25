<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/PageContainer.svelte';
	import FormField from '$components/FormField.svelte';
	import { createDialog } from '$lib/state/dialogs';
	
	let version_number = $state('');
	let patch_notes = $state('');
	let download_url = $state('');
	let edit_code = $state('');
	let loading = $state(true);
	let updating = $state(false);

	// Get parameters from URL
	let packageName = $page.params.name;
	let versionParam = decodeURIComponent($page.params.version);

	onMount(async () => {
		try {
			const response = await fetch(`/api/packages/${packageName}/versions/${encodeURIComponent(versionParam)}`);
			if (response.ok) {
				const versionData = await response.json();
				version_number = versionData.version_number;
				patch_notes = versionData.patch_notes;
				download_url = versionData.download_url;
			} else {
				createDialog({
					id: 'load-version-error',
					type: 'small',
					title: 'Error Loading Version',
					icon: 'warn-red',
					bodyText: 'Failed to load version details.',
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
				id: 'load-version-network-error',
				type: 'small',
				title: 'Error Loading Version',
				icon: 'warn-red',
				bodyText: 'An error occurred while loading version details.',
				buttons: [
					{
						text: 'continue',
						main: true,
						action: () => {}
					}
				]
			});
			console.error('Error fetching version:', err);
		} finally {
			loading = false;
		}
	});

	async function updateVersion() {
		const trimmedVersion = String(version_number || '').trim();
		const trimmedNotes = String(patch_notes || '').trim();
		const trimmedUrl = String(download_url || '').trim();
		const trimmedEditCode = String(edit_code || '').trim();

		if (!trimmedVersion || !trimmedNotes || !trimmedUrl || !trimmedEditCode) {
			createDialog({
				id: 'update-version-validation-error',
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
			return;
		}

		let url;
		try {
			url = new URL(trimmedUrl);
		} catch (urlError) {
			createDialog({
				id: 'update-version-validation-error',
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
				id: 'update-version-validation-error',
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

		updating = true;

		try {
			const response = await fetch(`/api/packages/${packageName}/versions/${encodeURIComponent(versionParam)}`, {
				method: 'PATCH',
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
					id: 'update-version-success',
					type: 'small',
					title: 'Success',
					icon: 'warn-red',
					bodyText: 'Version updated successfully!',
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
					id: 'update-version-error',
					type: 'small',
					title: 'Error Updating Version',
					icon: 'warn-red',
					bodyText: data.message || 'Failed to update version',
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
				id: 'update-version-network-error',
				type: 'small',
				title: 'Network Error',
				icon: 'warn-red',
				bodyText: 'A network error occurred while updating the version',
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
</script>

<PageContainer containerId="edit-version-page-container" pageId="edit-version-page">
	<section class="paragraph-text">	
		<h1>Edit Version {versionParam}</h1>
		<p>Edit the version details below.</p>
	</section>
	<a class="button " href="/packages/{packageName}">Back to Package</a>

	{#if loading}
		<p>Loading version details...</p>
	{:else}
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
			<FormField label="Download URL" id="download_url" hint="Must include ?shortcut_name= query parameter (your exact Shortcut Name URL-Encoded). Example: https://www.icloud.com/shortcuts/32751811e2f04de99abff36399fa2bd7?shortcut_name=Simple%20Base64">
				<Input
					id="download_url"
					placeholder="Enter Download URL with ?shortcut_name= parameter"
					bind:value={download_url}
				/>
			</FormField>
			<FormField label="Edit Code" id="edit_code">
				<Input id="edit_code" placeholder="Enter edit code to confirm changes" bind:value={edit_code} />
			</FormField>
			<button class="button button--primary" onclick={updateVersion}
				>{updating ? 'Updating...' : 'Update Version'}</button
			>
		</div>
	{/if}
</PageContainer>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>