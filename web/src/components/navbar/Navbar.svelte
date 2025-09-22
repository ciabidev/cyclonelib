<script lang="ts">


  import NavTab from "./NavTab.svelte";

  import NavbarLogo from "./NavbarLogo.svelte";
	  // @ts-ignore
  import InfoIcon from "~icons/basil/info-rect-outline"; /* using Unplugin icons we can load icons at meowbalt speeds! */
  // @ts-ignore (she aint even know it) (WHY DID I WRITE THIS WITHOUT KNOWING WHAT IT MEANT...)
  import StarIcon from "~icons/basil/star-outline";
  import BoxIcon from '~icons/basil/box-outline';
  import MoonIcon from '~icons/basil/moon-outline';
  import SunIcon from '~icons/basil/sun-outline';
  import FluentEmojiFlatIceCream from '~icons/fluent-emoji-flat/ice-cream';
</script>

  <nav class="navbar">
    <NavbarLogo />
    <nav class="navbar-tabs">
        <NavTab name={"about?"} Icon={InfoIcon} path={"/"} />
      <NavTab name={"packages"} Icon={BoxIcon} path={"/packages"} />
      <NavTab name={"test"} Icon={StarIcon} path={"/test"} />
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
    bottom: 0;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
    position: fixed;
  	z-index: 1005;
  	background-color: var(--nav-bg);
  }

  .navbar-tabs {
    align-items: center;
    z-index: 1005;
    height: 100%;
    justify-content: space-evenly;
  }

  .navbar > * {
    z-index: 1505;
  }


    @media screen and (max-width: 535px) {
      .navbar {
        height: var(--mobile-navbar-height);
      }
    }
</style>
