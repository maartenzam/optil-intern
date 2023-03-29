<script>
	export let x;
	export let y;
</script>

<circle cx={x} cy={y} r={12} fill="black" stroke="white" stroke-width={2} />
<text {x} y={y + 6} fill={'white'}>!</text>

<style>
	text {
		text-anchor: middle;
		font-size: 16px;
		font-weight: bold;
	}
</style>
