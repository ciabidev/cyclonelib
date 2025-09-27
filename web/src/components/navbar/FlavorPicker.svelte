<script>
	import { flavor } from '$lib/state/flavors';
    import { flavors } from '$lib/types/flavor';

    import PopoverContainer from '$components/misc/PopoverContainer.svelte';
    import FlavorPickerButton from '$components/navbar/FlavorPickerButton.svelte';
    import { flavorPickerVisible } from '$lib/state/flavor-picker-visibility';
	import CarouselContainer from '$components/inputs-and-buttons/CarouselContainer.svelte';
    
    let flavor_items = flavors.map(flavor => {
        return {
            title: flavor,
            description: "",
            image: "/flavor_icons/" + flavor + ".png"
        }
    });
</script>

<div id="flavor-picker">
    <FlavorPickerButton /> 
    <PopoverContainer expanded={$flavorPickerVisible} id="flavor-picker-popover">
        <CarouselContainer id="flavor-picker-carousel" items={flavor_items}></CarouselContainer>
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
    }
</style>