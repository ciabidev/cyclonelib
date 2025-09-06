<script lang="ts">
	import Switcher from "$components/inputs-and-buttons/Switcher.svelte";
	import { createDialog } from "$lib/state/dialogs";
	import Input from "$components/inputs-and-buttons/Input.svelte";
	import ProjectCard from "$components/ProjectCard.svelte";
	let testInput = $state('');
	let active1 = $state(0);
	let active2 = $state(0);

</script>

<!--bottom navbar-->
<!--acts as a "body" excluding the navbar -->
<!-- Page metadata for discord embed. This is a guide to AO Challenger and a list of all commands. The title is About AO Challenger-->

<div class="page-wrapper">
	<div class="main">
		<section id="test-hero" class="long-text">
			<h2>Loaf-web Test Page</h2>
			<p class="long-text">Test page for the Loaf-web layout</p>
		</section>
		<section id="test-dialog">
			<button class="button button--default" onclick={() => createDialog({
				id: 'test-dialog',
				type: 'small',
				title: 'Test Dialog',
				bodyText: 'This is a test dialog from the cobalt-main dialog system!',
				buttons: [
					{
						text: 'continue',
						main: true,
						action: () => console.log('ok clicked')
					},
					{
						text: 'cancel',
						main: false,
						action: () => console.log('cancel clicked')
					}
				]
			})}>Test Dialog</button>
		</section>
		<section id="test-switcher--defualt">
		<Switcher>
			<button class="button button--default" class:active={active1 === 0} onclick={() => active1 = 0}>six</button>
			<button class="button button--default" class:active={active1 === 1} onclick={() => active1 = 1}>seven</button>
		</Switcher>
		</section>
		<section id="test-switcher--big">
		<Switcher description="This is a description on a big switcher!" full>
			<button class="button button--default" class:active={active2 === 0} onclick={() => active2 = 0}>eight</button>
			<button class="button button--default" class:active={active2 === 1} onclick={() => active2 = 1}>nine</button>
		</Switcher>
		</section>
		<section id="test-input">
			<Input placeholder="test input with description" bind:value={testInput} description={"your input is: " + testInput} />
		</section>
	</div>
</div>

<style>
	.page-wrapper {
		width: 100%;
		display: flex;
		flex-direction: row; /* has to be row so we can horizontally center */
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
		display: flex;
		gap: 2rem;
		flex-direction: column;
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
