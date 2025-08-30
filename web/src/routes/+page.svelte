<script>
	import URLButton from '$components/inputs-and-buttons/URLButton.svelte';
	import Codeblock from '$components/Codeblock.svelte';
	import UrlButton from '$components/inputs-and-buttons/URLButton.svelte';
</script>

<!--bottom navbar-->
<!--acts as a "body" excluding the navbar -->
<!-- Page metadata for discord embed. This is a guide to AO Challenger and a list of all commands. The title is About AO Challenger-->
<svelte:head>
	<title>Cyclone</title>
	<meta name="title" content="Cyclone" />
	<meta name="description" content="all about Cyclone" />
	<meta
		name="keywords"
		content="Cyclone, iOS shortcuts, RoutineHub, Shortcuts, Developer Utilities, Packages, Functions"
	/>
	<meta name="author" content="wheatwhole" />
</svelte:head>

<div class="page-wrapper">
	<div class="main">
		<a href="https://wheatwhole.github.io">????</a>
		<URLButton url="https://routinehub.co/shortcut/19577" name="Get Cyclone" img="icons/cyclone.webp" urlshort="routinehub.co/shortcut/19577" />
		<h2 id="-build-better-and-faster">⏩ Build Better and Faster</h2>
		<p>
			Cyclone is the ultimate power-up for Apple Shortcuts.<br />Install it once and get a bunch of
			new actions. Soon you’ll be able to make <strong>Custom Functions</strong> to speed up any shortcut
			you create.
		</p>
		<p>It’s fully released and updated regularly.<br />💬 Found a bug or got an idea? <a href="https://tally.so/r/mVXylJ">Send it here</a> – we actually read them.
		</p>
		<h2 id="-why-cyclone">🌀 Why Cyclone</h2>
		<p><a href="https://routinehub.co/shortcut/22695">Demo Shortcut</a></p>
		<p>Here’s what you get:</p>
		<ul>
			<li>
				⬆️ <strong>Auto-Updater</strong> – keep your shortcuts on the latest version with an easy update
				screen
			</li>
			<li>
				🖼️ <strong>Styled Menus</strong> – menus with images, descriptions, and a polished look
			</li>
			<li>
				🎴 <strong>Styled Screens</strong> – markdown-powered screens with custom colors and layouts
			</li>
			<li>
				🌎 <strong>Global Variables</strong> – save info between runs, and share it with other shortcuts
				if they use the same ProjectName
			</li>
			<li>
				🧠 <strong>Better Dictionaries &amp; Lists</strong> – merge, edit, and manage dictionaries and
				lists without hassle
			</li>
			<li>🔒 <strong>Encryption</strong> – lock sensitive info with a password</li>
			<li>
				⚡ <strong>Fast Performance</strong> – loads in under 2 seconds and only runs what’s needed
			</li>
		</ul>
		<h2 id="-coming-soon">🔮 Coming Soon</h2>
		<ul>
			<li>
				🌸 <strong>AI Actions</strong> – free, private AI tools via
				<a href="https://pollinations.ai">Pollinations.ai</a>
			</li>
			<li>🌧️ <strong>CyCloud Hosting</strong> – store text online and use it anywhere</li>
			<li>📦 <strong>Build Functions</strong> – turn repetitive steps into reusable blocks</li>
		</ul>
		<h2>How to start:</h2>
		<ol>
			<li><a href="https://routinehub.co/shortcut/19577">Install Cyclone</a></li>
			<li>Run Cyclone once</li>
			<li><a href="https://cyclone.fibery.io/@public">Read the quick guide</a></li>
		</ol>
		<p>Join our
			<a href="https://discord.com/invite/UYgGdEwGsK">Discord</a> to see what others are building or
			share your own shortcuts (13+ only).
		</p>
		<h2 id="-support-cyclone-for-free">💖 Support Cyclone for Free</h2>
		<p>
			Leave a ❤️ on our <a href="https://routinehub.co/shortcut/19577">RoutineHub page</a> or add this
			badge to your shortcut’s description:
		</p>
<Codeblock code="[![This shortcut uses or supports Cyclone](https://i.imgur.com/6RCqPh6.jpeg)](https://routinehub.co/shortcut/19577)" language="markdown" />
		<p>
			<a href="https://routinehub.co/shortcut/19577"
				><img
					src="https://i.imgur.com/6RCqPh6.jpeg"
					alt="This shortcut uses or supports Cyclone"
				/></a
			>
		</p>
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
