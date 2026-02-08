<script lang="ts">
    import P5 from "p5-svelte"
    import type p5 from "p5"

    const sketch = (p5Instance: p5) => {
        p5Instance.setup = () => {
            const canvas = p5Instance.createCanvas(400, 200)
        }

        p5Instance.draw = () => {
			const background = p5.color(50, 50, 50)
			p5.stroke(background)
			p5.fill(background)
        }

        p5Instance.mouseDragged = () => {
        }
    }
</script>

<div class="flex justify-center items-center p-6">
    <P5 sketch={sketch}/>
</div>
