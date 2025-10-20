<script lang="ts">
    import {numberWithCommas, round1} from "$lib/utils";

    const {num}: { num: number } = $props();
</script>

<span class="cell">{numberWithCommas(round1(num))}</span>

