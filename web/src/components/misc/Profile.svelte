<script>
  let { name } = $props();
</script>

<div class="pfp">
  <img src="/pfps/{name}.webp" alt={name} />
</div>
<h1 class="bio-title">{name}<span class="h300"></span></h1>

<style>
  .pfp {
    min-width: 150px;
    min-height: 150px;
    max-width: 150px;
    max-height: 150px;
    border-radius: 360px;
    overflow: hidden;
  }

  .pfp > img {
    width: 150px;
     user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    height: 150px;
  }

  .bio-title {
    color: var(--wheatwhole-color);
     user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    font-size: 30px;
    font-weight: 430;
  }
</style>
