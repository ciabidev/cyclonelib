<script lang="ts">
	import Switcher from "$components/inputs-and-buttons/Switcher.svelte";
	import Input from "$components/inputs-and-buttons/Input.svelte";
	import ProjectCard from "$components/ProjectCard.svelte";
	import { pickerDialog, smallDialog } from "$lib/utils/dialog-helpers.ts";
	import PageContainer from "$components/PageContainer.svelte";
	import Codeblock from "$components/Codeblock.svelte";
	let testInput = $state('');
	let active1 = $state(0);
	let active2 = $state(0);

</script>

<!--bottom navbar-->
<!--acts as a "body" excluding the navbar -->
<!-- Page metadata for discord embed. This is a guide to AO Challenger and a list of all commands. The title is About AO Challenger-->

<PageContainer containerId="test-page-container" pageId="test-page">
		<section id="test-hero" class="paragraph-text">
			<h1>Loaf-web Test Page</h1>
			<p class="paragraph-text">Test page for the Loaf-web layout</p>
		</section>
		<h1>Components</h1>
		<section id="test-dialog">
			<button class="button " onclick={() => smallDialog('small-dialog', 'How Insatiable', 'The more you take, the less you have. You will starve surrounded by gold.')}>test small Dialog</button>
		</section>
		<section id="test-picker-dialog">
			<button class="button" onclick={() => pickerDialog('picker-dialog', [
				{ type: 'photo', url: '/emotions/surprised.png' },
				{ type: 'photo', url: '/emotions/happy.png' },
			], [
				{ text: 'Continue', main: true, action: () => {} }
			], (item) => {
				console.log('Selected item:', item);
				alert(`Selected: ${item.url}`);
			})}>test picker Dialog</button>
		</section>
		<section id="test-project-card">
			<ProjectCard
				name="Test Project"
				url="https://github.com/wheatwhole/cyclone"
				urlshort="github.com/wheatwhole/cyclone"
				description="This is a test project card"
			>
				<div class="actions">
					<button class="button button--primary">Test </button>
				</div>
			</ProjectCard>
		</section>
		<section id="test-switcher--defualt">
		<Switcher>
			<button class="button " class:active={active1 === 0} onclick={() => active1 = 0}>six</button>
			<button class="button " class:active={active1 === 1} onclick={() => active1 = 1}>seven</button>
		</Switcher>
		</section>
		<section id="test-switcher--big">
		<Switcher description="This is a description on a big switcher!" full>
			<button class="button" class:active={active2 === 0} onclick={() => active2 = 0}>eight</button>
			<button class="button" class:active={active2 === 1} onclick={() => active2 = 1}>nine</button>
			<button class:active={active2 === 2} onclick={() => active2 = 2}><img src="/emotions/surprised.png" alt="surprised"  /></button>
		</Switcher>
		</section>
		<section id="test-input">
			<Input placeholder="test input with description" bind:value={testInput} description={"your input is: " + testInput} />
		</section>
		<section id="code-block">
			<Codeblock code={"console.log('hello world')"} language="js" />
		</section>
	</PageContainer>

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
