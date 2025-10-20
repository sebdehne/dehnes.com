<script lang="ts">
    const {text, left = false}: { text: string, left?: boolean } = $props();
</script>

<span class={left ? 'cellLeft' : 'cell'}>
    {text}
</span>

<style>
    .cell {
        text-align: end;
    }
    .cellLeft {
        text-align: start;
    }
</style>