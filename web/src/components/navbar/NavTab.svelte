<script lang="ts">
  let { Icon, href, name } = $props();
  import { fly } from "svelte/transition";
  import { page } from "$app/state";

  let tabPath = $derived(href.split("/")[1]);

  let currentPage = $derived(page.url.pathname.split("/")[1]);

  let isTabCurrentPage = $derived(tabPath === currentPage);

  let tab!: HTMLElement;

  const scrollToTab = (ele: HTMLElement) => {
    if (ele) {
      console.log("ele exists");
      ele.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      });
    }
  };

  $effect(() => {
    if (isTabCurrentPage && tab) {
      console.log("scrolling");
      scrollToTab(tab);
    } else {
      if (!tab) {
        console.log("tab does not exist");
      }
      if (!isTabCurrentPage) {
        console.log("tab path is not the same as the current page; not");
      }
    }
  });

  let clicked = $state(false);
</script>

<a
  role="tab"
  id="tab"
  draggable="false"
  class:active={isTabCurrentPage}
  {href}
  aria-selected={isTabCurrentPage}
  bind:this={tab}
>
  <Icon style="font-size: var(--icon-size-mobile); " class="icon" />
  <span>{name}</span>
</a>

<style lang="css">
  /* the .active class is enabled when the path of the tab is = to the path of the current page, meaning the tab is active. The :active selector is only when the element itself is active. */
  @keyframes afterClick {
    0% {
      transform: scale(0.85);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  a[role="tab"] {
    transition: transform 250ms cubic-bezier(0.33, 1, 0.68, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--navbar-highlight);
    height: 100%;
    /* dark: color: black; */
    font-size: var(--navbar-font-size);
    padding: var(--navbar-tab-padding);
    opacity: 0.75;
    text-decoration: none;
     user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    min-width: 90px;
     user-select: none;
  -webkit-user-select: none;  /* Safari / iOS */
  -ms-user-select: none; 
    border-radius: var(--border-radius);
  }

  /* shrinks down for a little then scales back up once it gains the .active class */
  a[role="tab"]:active:hover:not(.active) {
    transform: scale(0.85, 0.85);
  }

  a[role="tab"].active {
    animation: 0.3s afterClick cubic-bezier(0.33, 1, 0.68, 1);
    background: var(--main-color);
    opacity: 1;
    cursor: default;
  }

@media not all and (hover: none) {
   a[role="tab"]:hover:not(.active) {
    background: var(--nav-hover-bg)
  }
}

 @media only screen and (max-width: 600px) {
   a[role="tab"] {
     padding: 3px 1px;
     height: fit-content;
   }

   .icon {
     font-size: var(--icon-size-mobile) !important;
   }
 }

 @media only screen and (min-width: 601px) {
   .icon {
     font-size: var(--icon-size-desktop) !important;
   }
 }

  
</style>
