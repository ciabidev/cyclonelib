<script>
  // @ts-ignore
  import HeartSolid from '~icons/basil/heart-solid';
</script>

<div class="lovenote-container">
  <HeartSolid style="color: red; min-width: 15px; min-height: 15px; max-width: 15px; max-height: 15px;" />
  
  <div class="small-text lovenote">made with love by the ciabi development team (me 😢)</div>
</div>

<style>
  .lovenote-container {
    bottom: calc(var(--navbar-height) + 10px);
    order: 2;
    z-index: 50;
    position: fixed;
    justify-content: center;
    align-items: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    vertical-align: middle;
    gap: 10px;
  }

  .lovenote {
    font-size: 13px;
  }

  /* .lovenote::after {
    content: "made with love by the ciabi development team (me 😢)";
  } */

  @media only screen and (max-width: 600px) {
    /* lazy ahh coding */
    /* .lovenote::after {
      content: "made with love by the ciabi team (me 😢)";
    } */

    .lovenote-container {
      bottom: calc(var(--mobile-navbar-height) + 15px);
    }
  }
</style>
