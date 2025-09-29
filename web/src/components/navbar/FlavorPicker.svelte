<script>
	import { flavor } from '$lib/state/flavors';
    import { flavors } from '$lib/types/flavor';

    import PopoverContainer from '$components/misc/PopoverContainer.svelte';
    import FlavorPickerButton from '$components/navbar/FlavorPickerButton.svelte';
    import { flavorPickerVisible } from '$lib/state/flavor-picker-visibility';
	import CarouselContainer from '$components/inputs-and-buttons/CarouselContainer.svelte';
    import { flavor_descriptions } from '$lib/types/flavor';

    let flavor_items = flavors.map(flavor => {
        return {
            title: flavor,
            description: flavor_descriptions[flavor],
            image: "/flavor_icons/" + flavor + ".png"
        }
    });
</script>

<div id="flavor-picker">
    <FlavorPickerButton /> 
    <PopoverContainer expanded={$flavorPickerVisible} id="flavor-picker" title="flavors" description="pick your favorite">
        <CarouselContainer onSelect={(item) => {
            flavor.set(item.title);
        } } id="flavor-picker-carousel" items={flavor_items} defaultSelected={flavors.indexOf($flavor)}></CarouselContainer>
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
        z-index: 10;
        pointer-events: none;
        padding: var(--holder-padding);
        width: 100%;
    }

    :global(#flavor-picker-popover) {
        max-width: 600px;
    }
</style>