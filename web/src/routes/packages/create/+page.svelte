<script>
	import { goto } from '$app/navigation';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import { createDialog, killDialog } from '$lib/state/dialogs';

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
			!trimmedName ||
			!trimmedShortDesc ||
			!trimmedLongDesc ||
			// !trimmedPackageUrl || // Commented out for versioning system
			!trimmedEditCode
		) {
			// Clear any existing dialogs first
			killDialog();
			createDialog({
				id: 'create-package-validation-error',
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
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'create-package-success',
					type: 'small',
					title: 'Success',
					bodyText: 'Package created successfully!',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {
								// Clear form
								name = '';
								short_description = '';
								long_description = '';
								// download_url = ''; // Commented out for versioning system
								edit_code = '';
								// Small delay to allow dialog to close properly before navigation
								setTimeout(() => {
									// Redirect to version creation for the new package
									goto(`/packages/${$formattedName}/versions/create`);
								}, 200);
							}
						}
					]
				});
			} else {
				const data = await response.json();
				// Clear any existing dialogs first
				killDialog();
				createDialog({
					id: 'create-package-error',
					type: 'small',
					title: 'Error Creating Package',
					icon: 'warn-red',
					bodyText: data.message || 'Failed to create package',
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
				id: 'create-package-network-error',
				type: 'small',
				title: 'Network Error',
				icon: 'warn-red',
				bodyText: 'a network error occurred while creating the package',
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

<div class="page-wrapper">
	<div class="main">
		<h1>Create Package</h1>
		<p>Fill in the details to create a new package.</p>
		<a class="button button--default" href="/packages">Back to Packages</a>

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
				<Input
					id="short_description"
					placeholder="Enter short description (brief summary)"
					bind:value={short_description}
				/>
			</div>
			<div class="field">
				<label for="long_description">Long Description</label>
				<Input
					id="long_description"
					placeholder="Enter detailed description"
					bind:value={long_description}
					long={true}
				/>
			</div>
			<!-- Download URL field commented out for versioning system -->
			<!--
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
			-->
			<div class="field">
				<label for="edit_code">Edit Code</label>
				<p style="color: var(--color-error);" class="long-text">
					This is a secret code that is required to manage your package. Save it somewhere safe and
					don't share it!
				</p>
				<Input
					id="edit_code"
					placeholder="Enter edit code for future modifications"
					bind:value={edit_code}
				/>
			</div>
			<button class="button button--primary" onclick={submit}
				>{loading ? 'Creating...' : 'Create Package'}</button
			>
		</div>
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
