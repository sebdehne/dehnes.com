<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';

    let {children} = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
</svelte:head>

{@render children?.()}

<style>
    :global(body, html) {
        padding: 5px;
        margin: 0;
        font-family: 'Courier New', monospace;
        font-size: 18px;
        background: #1b262c;
        color: #bbe1fa;
    }

    :global(*) {
        box-sizing: border-box;
    }


</style>