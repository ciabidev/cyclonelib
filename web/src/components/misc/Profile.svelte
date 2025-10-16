<script>
  let { name } = $props();
</script>

<div class="pfp">
  <img src="/pfps/{name}.webp" alt={name} />
</div>
<h1 class="bio-title">{name}<span class="h300"></span></h1>

<style>
  .pfp {
    min-width: 9.375rem;
    min-height: 9.375rem;
    max-width: 9.375rem;
    max-height: 9.375rem;
    border-radius: 22.5rem;
    overflow: hidden;
  }

  .pfp > img {
    width: 9.375rem;
     user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    height: 9.375rem;
  }

  .bio-title {
    color: var(--wheatwhole-color);
     user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    font-size: 1.875rem;
    font-weight: 430;
  }
</style>
