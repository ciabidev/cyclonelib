<script lang="ts">
	import Switcher from '$components/inputs-and-buttons/Switcher.svelte';
	import Input from '$components/inputs-and-buttons/Input.svelte';
	import ProjectCard from '$components/misc/ProjectCard.svelte';
	import { createDialog } from '$lib/state/dialogs';
	import PageContainer from '$components/misc/PageContainer.svelte';
	import Codeblock from '$components/misc/Codeblock.svelte';
	import Navbar from '$components/navbar/Navbar.svelte';
	import NavTab from '$components/navbar/NavTab.svelte';
	import InfoIcon from '~icons/basil/info-rect-outline';
	import StarIcon from '~icons/basil/star-outline';
	import BoxIcon from '~icons/basil/box-outline';
	let testInput = $state('');
	let active1 = $state(0);
	let active2 = $state(0);

	import CarouselContainer from '$components/inputs-and-buttons/CarouselContainer.svelte';
	import { flavors } from '$lib/types/flavor';
	import { flavor_descriptions } from '$lib/types/flavor';

	let flavor_items = flavors.map((flavor) => {
		return {
			title: flavor,
			description: flavor_descriptions[flavor],
			image: '/flavor_icons/' + flavor + '.png'
		};
	});
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
		<button
			class="button"
			onclick={() =>
				createDialog({
					id: 'small-dialog',
					type: 'small',
					title: 'How Insatiable',
					bodyText: 'The more you take, the less you have. You will starve surrounded by gold.',
					emoticon: 'happy',
					buttons: [
						{
							text: 'continue',
							main: true,
							action: () =>
								createDialog({
									id: 'small-dialog-2',
									type: 'small',
									title: 'debug',
									bodyText:'hi',
									emoticon: 'happy',
									buttons: [
										{
											text: 'conte',
											main: true,
											action: () => {}
										}
									]
								})
						}
					]
				})}>test small Dialog</button
		>
	</section>
	<section id="test-picker-dialog">
		<button
			class="button"
			onclick={() =>
				createDialog({
					id: 'picker-dialog',
					type: 'picker',
					items: [
						{ type: 'photo', url: '/emotions/surprised.png' },
						{ type: 'photo', url: '/emotions/unamused.png' },
						{ type: 'photo', url: '/emotions/confused.png' },
						{ type: 'photo', url: '/emotions/angry.png' },
						{ type: 'photo', url: '/emotions/sad.png' },
						{ type: 'photo', url: '/emotions/awkward.png' },
						{ type: 'photo', url: '/emotions/happy.png' },
						{ type: 'photo', url: '/favicon/favicon-96x96.png', text: 'test' }
					],
					buttons: [{ text: 'Continue', main: true, action: () => {} }],
					onSelect: (item) => {
						console.log('Selected item:', item);
						createDialog({
							id: 'selected-item',
							type: 'small',
							title: item.text ?? item.url,
							bodyText: '',
							buttons: [
								{
									text: 'continue',
									main: true,
									action: () => {}
								}
							]
						});
					}
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
			<button class="button" class:active={active1 === 0} onclick={() => (active1 = 0)}>six</button>
			<button class="button" class:active={active1 === 1} onclick={() => (active1 = 1)}
				>seven</button
			>
		</Switcher>
	</section>
	<section id="test-switcher--big">
		<Switcher description="This is a description on a big switcher!" full>
			<button class="button" class:active={active2 === 0} onclick={() => (active2 = 0)}
				>eight</button
			>
			<button class="button" class:active={active2 === 1} onclick={() => (active2 = 1)}>nine</button
			>
			<button class:active={active2 === 2} onclick={() => (active2 = 2)}
				><img src="/emotions/angry.png" alt="surprised" /></button
			>
		</Switcher>
	</section>
	<section id="test-input">
		<Input
			placeholder="test input with description"
			bind:value={testInput}
			description={'your input is: ' + testInput}
		/>
	</section>
	<section id="code-block">
		<Codeblock code={"console.log('hello world')"} language="js" />
	</section>
	<section id="navbar">
		<Navbar test={true}>
			<NavTab name={'about?'} Icon={InfoIcon} path={'/'} />
			<NavTab name={'packages'} Icon={BoxIcon} path={'/packages'} />
			<NavTab name={'test'} Icon={StarIcon} path={'/test'} />
		</Navbar>
	</section>
	<section id="carousel">
		<CarouselContainer id="flavor-picker-carousel" items={flavor_items}></CarouselContainer>
	</section>
</PageContainer>

<style>
	.page-wrapper {
		width: 100%;
		display: flex;
		flex-direction: row;
		/* has to be row so we can horizontally center */
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
