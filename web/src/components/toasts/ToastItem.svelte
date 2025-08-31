<script>
	let { content } = $props();
</script>

<div class="toast">
	{content}
</div>

<style>
	@keyframes toastdone {
  0%   {transform: scale(0)}
  25%   {transform: scale(0.5)}
  50%  {transform: scale(1.015)}
  100% {transform: scale(1.0)}
}
	.toast {
		background-color: var(--bg-color);
		padding: 0.5rem 1.9rem;
		box-shadow: var(--toast-shadow);
		border-radius: 0.5rem;
		width: fit-content;
		height: fit-content;
		transition: all 0.2s var(--actions-and-stuff-ahh-transition);
		animation: toastdone 300ms forwards;
	}
</style>
