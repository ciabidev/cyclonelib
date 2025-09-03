<script lang="ts">
	import { createDialog } from "$lib/state/dialogs";
</script>

<!--bottom navbar-->
<!--acts as a "body" excluding the navbar -->
<!-- Page metadata for discord embed. This is a guide to AO Challenger and a list of all commands. The title is About AO Challenger-->

<div class="page-wrapper">
	<div class="main">
		<h2>Cyclone</h2>
		<p class="long-text">A whirlwind of useful functions for efficient shortcut development</p>
		<p class="long-text">welcome and thanks for downloading!</p>
		<p class="long-text">
			<b>For users:</b> developers use Cyclone to speed up development process and create complex shortcuts
			in a short amount of time. you can ALWAYS check inside Cyclone's code, since its a normal shortcut.
		</p>
		<p class="long-text">When you're ready, tap on <b style="color: #007AFF;">Done</b></p>
		<button class="button button--default" onclick={() => createDialog({
			id: 'test-dialog',
			type: 'small',
			title: 'Test Dialog',
			bodyText: 'This is a test dialog from the cobalt-main dialog system!',
			buttons: [
				{
					text: 'ok',
					main: true,
					action: () => console.log('ok clicked')
				},
				{
					text: 'cancel',
					action: () => console.log('cancel clicked')
				}
			]
		})}>Test Dialog</button>
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
		gap: 1rem;
		display: flex;
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
