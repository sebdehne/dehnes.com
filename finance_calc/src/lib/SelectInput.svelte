<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';

    const id = uuidv4();
    const {options, label, value, onChange}: {
        value: string;
        label: string;
        onChange: (v: string) => void;
        options: string[];
    } = $props();
</script>

<label for={id}>{label}</label>
<select id={id} onchange={(v) => onChange(v.currentTarget.value)}>
    {#each options as o (o)}
        {#if value === o}
            <option value={o} selected>{o}</option>
        {:else}
            <option value={o}>{o}</option>
        {/if}
    {/each}
</select>
