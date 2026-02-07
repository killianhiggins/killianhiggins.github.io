<script lang="ts">
    import P5 from "p5-svelte"

    // Global grid constants & variables.
    const falling = 2
    const stable = 1
    const empty = 0
    const glass = -1
    const squareWidth = 8
    let grid: any
    let cols: number, rows: number
    const randLog: number[] = []

    function make2DArray(cols: number, rows: number) {
        const arr = new Array(cols)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = new Array(rows)
            // Fill the array with 0s
            for (let j = 0; j < arr[i].length; j++) {
                arr[i][j] = 0
            }
        }
        return arr
    }

    function initGrid(width: number, height: number, squareWidth: number) {
        cols = width / squareWidth
        rows = height / squareWidth
        grid = make2DArray(cols, rows)
    }

    function setStableLeftEdge(i: number, j: number, grid: any, nextGrid: any) {
        const stateR = grid[i+1][j]
        const stateBR = grid[i+1][j+1]
        const stateAR = grid[i+1][j-1]
        const below = grid[i][j+1]

        if(stateBR !== empty && stateR === empty && stateAR === empty
                && below === stable && nextGrid[i+1][j] === empty){
            nextGrid[i+1][j] = stable
        }else if(grid[i][j+1] === empty){
            nextGrid[i][j+1] = falling
        }else{
            if(!tryMoveRight(i, j, stateR, nextGrid)){
                nextGrid[i][j] = stable
            }
        }
    }


    function setStableRightEdge(i: number, j: number, grid: any, nextGrid: any) {
        const stateL = grid[i-1][j]
        const stateBL = grid[i-1][j+1]
        const stateAL = grid[i-1][j-1]
        const below = grid[i][j+1]

        if(stateBL !== empty && stateL === empty && stateAL === empty
                && below === stable && nextGrid[i-1][j] === empty){
            nextGrid[i-1][j] = stable
        }else if(grid[i][j+1] === empty){
            nextGrid[i][j+1] = falling
        }else{
            if(!tryMoveLeft(i, j, stateL, nextGrid)){
                nextGrid[i][j] = stable
            }
        }
    }

    function tryMoveLeft(i: number, j: number, stateL: number, nextGrid: any) {
        if(stateL === empty && nextGrid[i-1][j] === empty){
            nextGrid[i-1][j] = stable
            nextGrid[i][j] = empty
            return true
        }else{
            nextGrid[i][j] = stable
            return false
        }
    }

    function tryMoveRight(i: number, j: number, stateR: number, nextGrid: any) {
        if(stateR === empty && nextGrid[i+1][j] === empty){
            nextGrid[i+1][j] = stable
            nextGrid[i][j] = empty
            return true
        }else{
            nextGrid[i][j] = stable
            return false
        }
    }

    function setStableMiddle(i: number, j: number, grid: any, nextGrid: any) {
        const stateL = grid[i-1][j]
        const stateR = grid[i+1][j]
        const below = grid[i][j+1]

        if(below === empty){
            if(nextGrid[i][j+1] === empty){
                nextGrid[i][j+1] = stable
            }else{
                nextGrid[i][j] = falling
            }
            return
        }

        if(stateL === empty || stateR === empty){
            const randInt = getRandomInt(2)

            randLog.push(randInt)

            const c: number[] = []
            randLog.forEach(ele => {
                c[ele] = (c[ele] || 0) + 1
            })
            //console.log(c)

            // Try to go Right
            if(randInt === 1){
                if(!tryMoveRight(i, j, stateR, nextGrid)){
                    //tryMoveLeft(i, j, stateL, nextGrid)
                }
            }else{ // Try to go Left
                if(!tryMoveLeft(i, j, stateL, nextGrid)){
                    //tryMoveRight(i, j, stateR, nextGrid)
                }
            }
        }else{
            nextGrid[i][j] = stable
        }
    }

    function setStableLiquid(i: number, j: number, grid: any, nextGrid: any) {
        if(j+1 > rows){
            nextGrid[i][j] = stable
            return
        }
        // Left Edge
        if(i-1 < 0){
            setStableLeftEdge(i, j, grid, nextGrid)
        // Right Edge
        }else if(i+1 >= cols){
            setStableRightEdge(i, j, grid, nextGrid)
        // Middle
        }else{
            setStableMiddle(i, j, grid, nextGrid)
        }
    }

    function setFallingLiquid(i: number, j: number, grid: any, nextGrid: any) {
        if(j+1 >= rows){
            nextGrid[i][j] = stable
        }
        let freefallFlag = true
        for( let k = j+1; k <= rows; k++){
            if(grid[i][k] === empty){
                freefallFlag = true
                break
            }else{
                freefallFlag = false
            }
        }
        if(!freefallFlag){
            nextGrid[i][j] = stable
            //console.log("freefalling pixel")
        }else{
            if(nextGrid[i][j+1] === empty){
                nextGrid[i][j+1] = stable
            }else{
                nextGrid[i][j] = stable
            }
        }
    }

    function checkForCapillary(i: number, j: number, grid: any) {
        // Catch left-edge edge case. 
        if(i - 1 < 0 || i - 2 < 0){
            return false
        }

        if(grid[i-1][j] === empty && grid[i-2][j] === glass){
            return true
        }
        return false
    }

    function setGlass(i: number, j: number, grid: any, nextGrid: any) {
        nextGrid[i][j] = grid[i][j]
    }

    function applyCapillaryAction(i: number, j: number, grid: any, nextGrid: any) {
        if(j-1 < 0 || j+1 >= rows){
            return false
        }

        if(grid[i][j-1] === empty && grid[i][j+1] === stable
        && grid[i-1][j+1] === stable && grid[i+1][j+1] === stable){
            nextGrid[i][j] = stable
            nextGrid[i][j+1] = empty
            return true   
        }else if(grid[i][j+1] === stable && grid[i-1][j+1] === glass 
                && grid[i+1][j+1] === glass && grid[i][j+2] === stable){
            nextGrid[i][j] = stable
            nextGrid[i][j+1] = empty
            return true
        }else if(grid[i][j+1] === empty && grid[i-1][j+1] === glass 
                && grid[i+1][j+1] === glass && grid[i][j+2] === stable){
            nextGrid[i][j] = stable
            nextGrid[i][j+1] = empty
            return true
        }
        return false
    }

    function getNextGrid() {
        const nextGrid = make2DArray(cols, rows)
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                const state = grid[i][j]
                switch(state){
                    case stable:
                        setStableLiquid(i, j, grid, nextGrid)
                        break
                    case falling:
                        setFallingLiquid(i, j, grid, nextGrid)
                        break
                    case glass:
                        setGlass(i, j, grid, nextGrid)
                        if(checkForCapillary(i, j, grid)){
                            applyCapillaryAction(i-1, j, grid, nextGrid)
                        }
                        break
                }
            }
        }
        return nextGrid
    }

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max + 1)
    }

    function withinCols(i: number) {
        return i >= 0 && i <= cols - 1
    }

    function withinRows(j: number) {
        return j >= 0 && j <= rows - 1
    }

    function initGlass() {
        for(let i = rows - 15; i < rows - 5; i++){
            grid[25][i] = glass
            grid[27][i] = glass
        }
    }

    const sketch = (p5) => {
        p5.setup = () => {
            const canvas = p5.createCanvas(400, 200)
            initGrid(canvas.width, canvas.height, squareWidth)
            initGlass()
            getNextGrid()
        }

        p5.draw = () => {
            const waterColour = p5.color(50, 100, 255)
            const waterfallColour =p5.color(80, 150, 255)
            const tankColour = p5.color(50, 50, 50)
            const glassColour = p5.color(100, 100, 100)
            for (let i = 0; i < cols; i++){
                for (let j = 0; j < rows; j++){
                    if(grid[i][j] === stable){
                        p5.stroke(waterColour)
                        p5.fill(waterColour)
                    }else if(grid[i][j] === falling){
                        p5.stroke(waterfallColour)
                        p5.fill(waterfallColour)
                    }else if(grid[i][j] === empty){
                        p5.stroke(tankColour)
                        p5.fill(tankColour)
                    }else if(grid[i][j] === glass){
                        p5.stroke(glassColour)
                        p5.fill(glassColour)
                    }else{
                        p5.stroke(255)
                        p5.fill(180)
                    }
                    const x = i * squareWidth
                    const y = j * squareWidth
                    p5.square(x, y, squareWidth)
                }
            }
            grid = getNextGrid()
        }

        p5.mouseDragged = () => {
            const mouseCol = p5.floor(p5.mouseX / squareWidth)
            const mouseRow = p5.floor(p5.mouseY / squareWidth)
            const mSize = 20
            const colStart = mouseCol
            const rowStart = mouseRow
            for(let i = colStart; i < colStart + mSize; i++){
                for(let j = rowStart; j < rowStart + mSize; j++){
                    if (withinCols(colStart) && withinRows(rowStart)
                        && grid[colStart][rowStart] === empty) {
                        grid[colStart][rowStart] = falling
                    }
                }
            }
        }
    }
</script>

<div class="flex justify-center items-center p-6">
    <P5 sketch={sketch}/>
</div>
