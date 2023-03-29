<script>
  import { colorScale, patternScale } from "$lib/styles/styles.js";

  export let laag;
</script>

<pattern
  id={laag}
  patternUnits="userSpaceOnUse"
  width="20"
  height="20"
  patternTransform={`scale(0.75) rotate(${patternScale[laag].rotation})`}
>
  <path d={patternScale[laag].path} stroke-width="1.5" stroke={colorScale[laag]} fill="none" />
</pattern>
