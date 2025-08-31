<div class="logo" aria-label="ciabi.dev logo">
	<img class="cyclone-logo" src="/icons/cyclone.webp" alt="ciabi-logo" />
</div>

<style>
	.logo {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: safe center;
		color: var(--navbar-highlight);
		font-size: 13px;
		padding: 13px 3px;
		opacity: 1;
		min-width: fit-content;
		min-height: 40px;
		text-decoration: none;
	}

	.cyclone-logo {
		width: 50px;
		object-fit: cover;
		height: 50px;
		 user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
	}
	@media screen and (max-width: 600px) {
		.logo {
			display: none;
		}
	}
</style>
