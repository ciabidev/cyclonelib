<script>
	import URLButton from '$components/inputs-and-buttons/URLButton.svelte';
	import Codeblock from '$components/Codeblock.svelte';
</script>

<!--bottom navbar-->
<!--acts as a "body" excluding the navbar -->
<!-- Page metadata for discord embed. This is a guide to AO Challenger and a list of all commands. The title is About AO Challenger-->

<div class="page-wrapper">
	<div class="main">
		<h2>Cyclone</h2>
		<p>A whirlwind of useful functions for efficient shortcut development</p>
		<p>welcome and thanks for downloading!</p>
		<p>
			<b>For users:</b> developers use Cyclone to speed up development process and create complex shortcuts
			in a short amount of time. you can ALWAYS check inside Cyclone's code, since its a normal shortcut.
		</p>
		<p>When you're ready, tap on <b>Done</b></p>
		<h2>Cyclone uses:</h2>
		<ul>
			<li>RoutineHub (version management)</li>
			<li>Github (simple hosting)</li>
			<li>ScreenKit (for stylized screens like this)</li>
			<li>Luox Updater by Luox</li>
		</ul>
		<p>If you are using a shortcut by @wheatwhole, my shortcuts use</p>
		<ul>
			<li>Notion (social networking)</li>
		</ul>
		<p><a href="https://discord.gg/2KVKyUeYxU">our official discord</a></p>
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
