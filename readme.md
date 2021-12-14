# svelte-better-form

## A form management library for Svelte that is very lightweight and simple!;

[![npm](https://img.shields.io/npm/v/svelte-better-form?color=F53B02)](https://www.npmjs.com/package/svelte-better-form)
[![GitHub Repo stars](https://img.shields.io/github/stars/ragokan/svelte-better-form?label=github%20stars)](https://github.com/ragokan/svelte-better-form)

### Why svelte-better-form?

- Very easy, fast, lightweight and powerful!
- Has validation already!

### Create form

```ts
// Simplest
const { values } = createBetterForm({ name: "better" });

// Full example!
const { values, loading, errors, submit, getValue, setValue } = createBetterForm(
  {
    name: "",
    email: "",
    age: null,
  },
  {
    validators: {
      name: [
        requiredValidator("Name is required!"),
        minLengthValidator(8, "Name should be longer than 8!"),
      ],
      email: emailValidator("Must be email!"),
      age: (value) => {
        // you can validate [age] here manually.
        if (value < 10) {
          // return a string if it is invalid.
          return "Your age must be older than 10";
        }
      },
    },
    onSubmit: async () => {
      // When you call submit, this one will be executed if the form is valid.
    },
  }
);
```

### Use Form

```html
<!-- Bind value -->
<input type="text" bind:value="{$values.name}" />

<!-- Use errors  -->
{#if $errors.name}
<p>Error: {$errors.name}</p>
{/if}

<!-- Use loading -->
<button disabled="{$loading}" class="button" on:click="{submit}">Submit</button>
```

Thats all!

### The default validators

- minLengthValidator(minLength, errorMessage)
- maxLengthValidator(maxLength, errorMessage)
- requiredValidator(errorMessage)
- emailValidator(errorMessage)

### Custom Validator

```ts
parameterName: (value) => {
  if(value !== "whatYouWant"){
    return "error text"
  }
 },
```
