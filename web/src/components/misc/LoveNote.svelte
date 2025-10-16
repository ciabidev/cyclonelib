<script>
  // @ts-ignore
  import HeartSolid from '~icons/basil/heart-solid';
</script>

<div class="lovenote-container">
  <HeartSolid style="color: red; min-width: 0.9375rem; min-height: 0.9375rem; max-width: 0.9375rem; max-height: 0.9375rem;" />
  
  <div class="subtext lovenote">made with love by the ciabi development team (me 😢)</div>
</div>

<style>
  .lovenote-container {
    bottom: calc(var(--navbar-height) + 0.625rem);
    order: 2;
    z-index: 50;
    position: fixed;
    justify-content: center;
    align-items: center;
    width: 100%;
    display: flex;
    flex-direction: row;
    vertical-align: middle;
    gap: 0.625rem;
  }

  .lovenote {
    font-size: 0.8125rem;
  }

  /* .lovenote::after {
    content: "made with love by the ciabi development team (me 😢)";
  } */

  @media only screen and (max-width: 37.5rem) {
    /* lazy ahh coding */
    /* .lovenote::after {
      content: "made with love by the ciabi team (me 😢)";
    } */

    .lovenote-container {
      bottom: calc(var(--mobile-navbar-height) + 0.9375rem);
    }
  }
</style>
