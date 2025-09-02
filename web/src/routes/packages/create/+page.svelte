<script>
	import { goto } from '$app/navigation';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import { createDialog, killDialog } from '$lib/state/dialogs';

	let name = $state('');
	let short_description = $state('');
	let long_description = $state('');
	let rhid = $state('');
	let edit_code = $state('');
	let loading = $state(false);

	async function submit() {
		// Trim whitespace from inputs with null checks and string conversion
		const trimmedName = String(name || '').trim();
		const trimmedShortDesc = String(short_description || '').trim();
		const trimmedLongDesc = String(long_description || '').trim();
		const trimmedRhid = String(rhid || '').trim();
		const trimmedEditCode = String(edit_code || '').trim();

		// Check for empty fields
		if (!trimmedName || !trimmedShortDesc || !trimmedLongDesc || !trimmedRhid || !trimmedEditCode) {
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
						text: 'ok',
						main: true,
						action: () => {}
					}
				]
			});
			return;
		}

		// Validate RHID is a valid number
		const rhidNum = parseInt(trimmedRhid);
		if (isNaN(rhidNum) || rhidNum <= 0) {
			// Clear any existing dialogs first
			killDialog();
			createDialog({
				id: 'create-package-validation-error',
				type: 'small',
				title: 'Validation Error',
				icon: 'warn-red',
				bodyText: 'RoutineHub ID must be a valid positive number',
				buttons: [
					{
						text: 'ok',
						main: true,
						action: () => {}
					}
				]
			});
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/packages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: trimmedName,
					short_description: trimmedShortDesc,
					long_description: trimmedLongDesc,
					rhid: rhidNum,
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
			                text: 'ok',
			                main: true,
			                action: () => {
			                    // Clear form
			                    name = '';
			                    short_description = '';
			                    long_description = '';
			                    rhid = '';
			                    edit_code = '';
			                    // Small delay to allow dialog to close properly before navigation
			                    setTimeout(() => {
			                        goto('/packages');
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
							text: 'ok',
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
				bodyText: 'Network error occurred while creating package',
				buttons: [
					{
						text: 'ok',
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
			</div>
			<div class="field">
				<label for="short_description">Short Description</label>
				<Input id="short_description" placeholder="Enter short description (brief summary)" bind:value={short_description} />
			</div>
			<div class="field">
				<label for="long_description">Long Description</label>
				<Input id="long_description" placeholder="Enter detailed description" bind:value={long_description} long={true} />
			</div>
			<div class="field">
				<label for="rhid">RoutineHub ID</label>
				<Input id="rhid" placeholder="Enter RoutineHub ID (number)" bind:value={rhid} type="number" />
			</div>
			<div class="field">
				<label for="edit_code">Edit Code</label>
				<p style="color: var(--color-error);">This is a secret code that is required to manage your package. Don't forget it and don't share it!</p>
				<Input id="edit_code" placeholder="Enter edit code for future modifications" bind:value={edit_code} />
			</div>
			<button class="button button--primary" onclick={submit}>{loading ? 'Creating...' : 'Create Package'}</button>
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