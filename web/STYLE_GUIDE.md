# Style Guide
- Use [MOIST](https://medium.com/@slavik57/why-should-you-write-moist-code-8d127e2c0075) principle whenever possible.
> The MOIST principle (Modularize Only If Something Tangible) is a balanced approach between WET (Write Everything Twice) and DRY (Don’t Repeat Yourself).
>
> WET code creates duplication, extra testing, and bugs spread across multiple places.
> Overly DRY code often leads to premature abstraction, wasted time, complex or inconvenient APIs, and frequent refactoring.
>
> MOIST suggests allowing repetition until clear patterns naturally emerge. Only then should code be modularized—when there are multiple real use cases, a clear API, and a meaningful component name. This avoids unnecessary complexity while still reaping the benefits of reuse.

- Only create Type files for components that involve both typescript filse and svelte files.
- Code should be simple and easy to read
- Use tabs for indentation
- Use camelCase for naming variables, functions, and classes
- Use PascalCase for naming components
- Use kebab-case for naming files
- When creating components avoid hardcoding and make them as reusable as possible
- Keep components as small as possible. If you need to add a lot of functionality, consider breaking it into smaller components
    - If you start repeating yourself a lot, consider using components ._.
- Create seperate container components if its contents may vary a lot in size and form
    - For example Popovers could have anything in them so we use a PopoverContainer element with <slot></slot>.
## CSS
- Use the [BEM](https://en.bem.info/methodology/quick-start/) methodology for naming classes.
- Don't use tailwind css
- Keep your styles accessible
- idk how to put this but use DRY code but for css. for example instead of creating dark variants of every "success" "warning" "error" button, just use a Darkness filter. 
