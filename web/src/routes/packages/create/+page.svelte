<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import FormField from '$components/misc/FormField.svelte';
	import { createDialog } from '$lib/state/dialogs';

	let name = $state('');

	let short_description = $state('');
	let long_description = $state('');
	let edit_code = $state('');
	let loading = $state(false);

// If the incoming URL contains edit_code or shortcut_url, prefill/remember them.
let incomingShortcutUrl = '';

$effect(() => { if (page && page.url) {
	const paramName = page.url.searchParams.get('name');
	const paramShortDescription = page.url.searchParams.get('short_description');
	const paramLongDescription = page.url.searchParams.get('long_description');
	const paramEdit = page.url.searchParams.get('edit_code');
	const paramShortcut = page.url.searchParams.get('shortcut_url');

	if (paramName) name = paramName;
	if (paramShortDescription) short_description = paramShortDescription;
	if (paramLongDescription) long_description = paramLongDescription;
	if (paramEdit) edit_code = paramEdit;
	if (paramShortcut) incomingShortcutUrl = paramShortcut;
} })

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
		const trimmedShortDesc = String(short_description || '').trim();
		const trimmedLongDesc = String(long_description || '').trim();
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (
			!formattedName ||
			!trimmedEditCode
		) {
			createDialog({
				id: 'create-package-validation-error',
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
		}

		loading = true;

		try {
			const response = await fetch('/api/packages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formattedName,
					short_description: trimmedShortDesc,
					long_description: trimmedLongDesc,
					edit_code: trimmedEditCode
				})
			});

			if (response.status === 200) {
				const packageName = formattedName;
				const forwardEdit = edit_code;
				const forwardShortcut = incomingShortcutUrl;
				const qs = new URLSearchParams();
				if (forwardEdit) qs.set('edit_code', forwardEdit);
				if (forwardShortcut) qs.set('shortcut_url', forwardShortcut);
				qs.set('patch_notes', 'Initial version');
				const q = qs.toString();
				// Clear form
				name = '';
				short_description = '';
				long_description = '';
				edit_code = '';
				createDialog({
					id: 'create-package-success',
					type: 'small',
					title: 'success!',
					icon: 'warn-red',
					bodyText: 'package created successfully!',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () => {
								// Capture forwarding params before we clear the form
								// Small delay to allow dialog to close properly before navigation
								setTimeout(() => {									
									goto(`/packages/${packageName}/versions/create${q ? `?${q}` : ''}`);
								}, 200);
							}
						}
					]
				});
				setTimeout(() => {
					goto(`/packages/${packageName}/versions/create${q ? `?${q}` : ''}`);
				}, 200);
			} else {
				const data = await response.json();
				createDialog({
					id: 'create-package-error',
					type: 'small',
					title: 'error creating package',
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
			createDialog({
				id: 'create-package-network-error',
				type: 'small',
				title: 'network error?',
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

<PageContainer containerId="create-package-page-container" pageId="create-package-page">
	<section class="paragraph-text">
		<h1>Create Package</h1>
		<p>Fill in the details to create a new package.</p>
	</section>
	<a class="button" href="/packages">Back to Packages</a>

	<div class="form">
		<FormField label="Package Name" id="name" required={true} value={name}>
			<Input id="name" placeholder="Enter package name" bind:value={name} />
			{#if formattedName}
				<small class="subtext" style="color: var(--main-color);">
					Name will be: <strong>{formattedName}</strong>
				</small>
			{/if}
		</FormField>
		<FormField
			label="Short Description"
			id="short_description"
			value={short_description}
		>
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
		<FormField
			label="Edit Code"
			id="edit_code"
			required={true}
			value={edit_code}
			hint="This is a secret code that is required to manage your package. Save it somewhere safe and don't share it!"
		>
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
