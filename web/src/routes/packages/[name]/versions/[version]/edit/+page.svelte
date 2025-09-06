<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import { createDialog, killDialog } from '$lib/state/dialogs';

	let version_number = $state('');
	let patch_notes = $state('');
	let download_url = $state('');
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
				killDialog();
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
			killDialog();
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

		if (!trimmedVersion || !trimmedNotes || !trimmedUrl) {
			killDialog();
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
			killDialog();
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
			killDialog();
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
					download_url: trimmedUrl
				})
			});

			if (response.ok) {
				killDialog();
				createDialog({
					id: 'update-version-success',
					type: 'small',
					title: 'Success',
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
				killDialog();
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
			killDialog();
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

<div class="page-wrapper">
	<div class="main">
		<h1>Edit Version {versionParam}</h1>
		<p>Edit the version details below.</p>
		<a class="button button--default" href="/packages/{packageName}">Back to Package</a>

		{#if loading}
			<p>Loading version details...</p>
		{:else}
			<div class="form">
				<div class="field">
					<label for="version_number">Version Number</label>
					<Input id="version_number" placeholder="e.g., 1.0.0" bind:value={version_number} />
				</div>
				<div class="field">
					<label for="patch_notes">Patch Notes</label>
					<Input
						id="patch_notes"
						placeholder="Describe what's new in this version"
						bind:value={patch_notes}
						long={true}
					/>
				</div>
				<div class="field">
					<label for="download_url">Download URL</label>
					<p class="long-text">
						Must include <strong>?shortcut_name=</strong> query parameter (your exact Shortcut Name URL-Encoded).
						Example: https://www.icloud.com/shortcuts/32751811e2f04de99abff36399fa2bd7<strong
							>?shortcut_name=Simple%20Base64</strong
						>
					</p>
					<Input
						id="download_url"
						placeholder="Enter Download URL with ?shortcut_name= parameter"
						bind:value={download_url}
					/>
				</div>
				<button class="button button--primary" onclick={updateVersion}
					>{updating ? 'Updating...' : 'Update Version'}</button
				>
			</div>
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

	@media only screen and (max-height: 25rem) {
		.page-wrapper {
			justify-content: center;
			align-items: center;
			flex-wrap: wrap;
			height: max-content;
		}
	}
</style>