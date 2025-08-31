<script>
	import { goto } from '$app/navigation';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import MainButton from '$components/inputs-and-buttons/MainButton.svelte';

	let name = $state('');
	let short_description = $state('');
	let long_description = $state('');
	let rhid = $state('');
	let edit_code = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state('');

	async function submit() {
		if (!name || !short_description || !long_description || !rhid || !edit_code) {
			error = 'All fields are required';
			return;
		}
		if (isNaN(parseInt(rhid))) {
			error = 'RoutineHub ID must be a valid number';
			return;
		}

		loading = true;
		error = '';
		success = '';

		try {
			const response = await fetch('/api/packages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					short_description,
					long_description,
					rhid: parseInt(rhid),
					edit_code
				})
			});

			if (response.ok) {
				success = 'Package created successfully!';
				// Clear form
				name = '';
				short_description = '';
				long_description = '';
				rhid = '';
				edit_code = '';
				// Redirect
				goto('/packages');
			} else {
				const data = await response.json();
				error = data.message || 'Failed to create package';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}
</script>

<div class="page-wrapper">
	<div class="main">
		<h1>Create Package</h1>
		<p>Fill in the details to create a new package.</p>
		<MainButton content="Back to Packages" href="/packages" />

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
			<MainButton
				content={loading ? 'Creating...' : 'Create Package'}
				variant="primary"
				onclick={submit}
			/>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}
		{#if success}
			<p class="success">{success}</p>
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
		min-height: max-content;
		height: 100%;
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

	.error {
		color: var(--color-error);
	}

	.success {
		color: var(--color-allgood);
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