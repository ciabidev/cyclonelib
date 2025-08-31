<script>
	let { Icon, href } = $props();
</script>

<a class="contact" {href} target="_blank" >
	<Icon style=" flex-shrink: 0; font-size: 1.1rem"/>
</a>

<style>
	.contact {
		display: flex;
		justify-content: center;
		align-items: center;
		vertical-align: center;
		flex-direction: row;
		padding: 0.6rem;
		border-radius: var(--border-radius);
		text-decoration: none;
		color: var(--text-color);
		box-shadow: var(--card-stroke) 0 0 0 1px;
		 user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
	}

	.contact:hover {
		background: var(--hover-bg);
	}
</style>
