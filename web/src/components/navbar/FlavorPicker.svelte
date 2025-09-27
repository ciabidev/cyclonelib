<script>
	import { flavor } from '$lib/state/flavors';
    import PopoverContainer from '$components/misc/PopoverContainer.svelte';
    import FlavorPickerButton from '$components/navbar/FlavorPickerButton.svelte';
    import { flavorPickerVisible } from '$lib/state/flavor-picker-visibility';
	import Carousel from '$components/inputs-and-buttons/Carousel.svelte';
</script>

<div id="flavor-picker">
    <FlavorPickerButton /> 
    <PopoverContainer expanded={$flavorPickerVisible} id="flavor-picker-popover">
        <Carousel items={$flavor.flavors} current={$flavor} visibleItems={3}>
            <div slot="item" let:item let:index>
                <div class="item">
                    <button class="flavor-button" on:click={() => $flavor.set(item)}>
                        {item.name}
                    </button>
                </div>
            </div>
        </Carousel>
    </PopoverContainer>
    
</div>

<style>
      #flavor-picker {
        --holder-padding: 12px;
        position: absolute;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: end;
        gap: 5px;
        pointer-events: none;
        padding: var(--holder-padding);
        width: calc(100% - var(--holder-padding) * 2);
    }
</style>