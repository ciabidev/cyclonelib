<script lang="ts">
  // @ts-ignore
  import InfoIcon from "~icons/basil/info-rect-outline"; /* using Unplugin icons we can load icons at meowbalt speeds! */
  // @ts-ignore (she aint even know it)
  import StarIcon from "~icons/basil/star-outline";
  // @ts-ignore
  import BoxIcon from '~icons/basil/box-outline';

  import NavTab from "./NavTab.svelte";

  import NavbarLogo from "./NavbarLogo.svelte";
  
</script>

<div class="navbar-container">
  <nav class="navbar">
    <NavbarLogo />
    <nav class="navbar-tabs">
      <NavTab name={"about?"} Icon={InfoIcon} href={"/"} />
      <NavTab name={"packages"} Icon={BoxIcon} href={"/packages"} />
    </nav>
  </nav>
</div>

<style>
  .navbar-container {
    display: flex;
    flex-direction: column;
    position: sticky;
    height: calc(var(--navbar-height));
    bottom: 0;
    width: 100%;
    z-index: 1005;
    background-color: var(--nav-bg);
  }

  .navbar {
    width: fit-content;
    z-index: 100;
    order: 3;
    display: flex;
    overflow-x: auto;
    flex-direction: row;
    width: 100%;
    overflow-y: hidden;
    justify-content: center;
  }

  .navbar-tabs {
    display: flex;
    padding: var(--navbar-inner-padding);
    flex-direction: row;
    align-items: center;
    overflow-x: scroll;
    height: 100%;
    overflow-y: none;
    z-index: 1005;
    justify-content: space-evenly;
  }

  .navbar > * {
    z-index: 1505;
  }
  
    /* cozy navbar */
    .navbar-container:before {
      content: "";
      position: absolute;
      top: -40px;
      left: 0;
      height: 40px;
      width: 40px;
      border-bottom-left-radius: 50%;
      box-shadow: 0 20px 0 0 var(--nav-bg, #000000);
      z-index: 10;
    }

    .navbar-container:after {
      content: "";
      position: absolute;
      top: -40px;
      right: 0;
      height: 40px;
      width: 40px;
      border-bottom-right-radius: 50%;
      box-shadow: 0 20px 0 0 var(--nav-bg, #000000);
      z-index: 10;
    }

    @media screen and (max-width: 600px) {
      .navbar-container {
        height: var(--mobile-navbar-height);
      }

    }
  
    @media screen and (max-height: 400px) {
      .navbar-container {
        height: var(--mobile-navbar-height);
      }
    }
</style>
