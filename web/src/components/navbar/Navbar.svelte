<script lang="ts">

  import NavbarLogo from "./NavbarLogo.svelte";

  let { test = false } = $props();
</script>

  <nav class="navbar" class:test={test}>
    <NavbarLogo />
    <nav class="navbar-tabs">
      <slot></slot>
    </nav>
  </nav>

<style>
  .navbar, .navbar-tabs {
    display: flex;
    flex-direction: row;    
  }

  .navbar {
    z-index: 100;
    overflow-x: auto;
    width: 100%;
    height: 100%;
    max-height: calc(var(--navbar-height));
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
  	z-index: 1;
  	background-color: var(--nav-bg);
  }

  .navbar:not(.test) {
    bottom: 0;
    position: fixed;
  }

  .navbar-tabs {
    align-items: center;
    z-index: 1005;
    height: 100%;
    justify-content: space-evenly;
  }

  .navbar > * {
    z-index: 2;
  }


    @media screen and (max-width: 600px) {
      .navbar {
        height: var(--mobile-navbar-height);
      }
    }

    @media screen and (max-height: 500px) {
      .navbar {
        height: var(--mobile-navbar-height);
      }
    }
</style>
