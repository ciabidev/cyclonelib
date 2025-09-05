<script lang="ts">
  // @ts-ignore
  import InfoIcon from "~icons/basil/info-rect-outline"; /* using Unplugin icons we can load icons at meowbalt speeds! */
  // @ts-ignore (she aint even know it)
  import StarIcon from "~icons/basil/star-outline";
  // @ts-ignore
  import BoxIcon from '~icons/basil/box-outline';
  // @ts-ignore
  import MoonIcon from '~icons/basil/moon-outline';
  // @ts-ignore
  import SunIcon from '~icons/basil/sun-outline';

  import NavTab from "./NavTab.svelte";

  import NavbarLogo from "./NavbarLogo.svelte";

</script>

<div class="navbar-container">
  <nav class="navbar">
    <NavbarLogo />
    <nav class="navbar-tabs">
      <NavTab name={"about?"} Icon={InfoIcon} path={"/"} />
      <NavTab name={"packages"} Icon={BoxIcon} path={"/packages"} />
    </nav>
  </nav>
</div>

<style>
  .navbar, .navbar-tabs, .navbar-container {
    display: flex;
    flex-direction: row;    
  }

  
  .navbar-container {
  	position: fixed;
  	height: var(--navbar-height);
  	bottom: 0;
  	width: 100%;
  	z-index: 1005;
  	background-color: var(--nav-bg);
  }

  .navbar {
    z-index: 100;
    overflow-x: auto;
    width: 100%;
    overflow-y: hidden;
    justify-content: center;
  }

  .navbar-tabs {
    display: flex;
    flex-direction: row;
    padding: var(--navbar-inner-padding);
    align-items: center;
    z-index: 1005;
    justify-content: space-evenly;
  }

  .navbar > * {
    z-index: 1505;
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
