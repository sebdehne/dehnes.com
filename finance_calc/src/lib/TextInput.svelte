<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

    const {
		value,
		onChange,
		label,
		pattern,
		error,
        placeholder,
	}: {
        value: string;
        onChange: (value: string) => void;
        label?: string;
        pattern?: RegExp;
        error?: string;
        placeholder?: string;
    } = $props();
	const id = uuidv4();
	let localValue = $state(value);
	let errorText = $state('');
</script>

<div>
    <label for={id}>{label}</label>
    <input
            {id}
            {value}
            {placeholder}
            oninput={(event) => {
		localValue = event.currentTarget.value ?? '';
		if (pattern && !(localValue ?? '').match(pattern)) {
            errorText = error ?? 'Input error';
		} else {
            onChange(localValue);
            errorText = '';
		}
	}}
    />

    {#if errorText}
        <label for={id} class="TextFieldError">{errorText}</label>
    {/if}
</div>


<style>
	.TextFieldError {
        color: red;
	}
</style>
