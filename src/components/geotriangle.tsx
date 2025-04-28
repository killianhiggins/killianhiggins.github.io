import Sketch from 'react-p5';

function GeoTriangle() {
    let firstPoint: number[];

    /**  
     * Returns a random integer between 0 and "max" argument.
     */
    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * Generates num number of points for canvas, given width, height, and num.
     * @returns A generated array of arrays storing a random x and y integer.
     */
    function generatePoints(width: number, height: number, num: number){
        let points: number[][] = [];
        for(let i = 0; i < num; i++){
            points.push([getRandomInt(1, width-2), getRandomInt(1, height-2)]);
        }
        return points;
    }

    /**
     * Comparing function, compares the squared distance between some point a
     * and the selected "first" point, with another point, b's, squared distance
     * to the "first" point.
     * Returns as per the Array.prototype.sort documentation specifies.
     * @param a number[] First point to be compared.
     * @param b number[] Second point to be compared
     * @returns 1 if a is closer, -1 if b is closer, 0 if they're the same.
     */
    function comparePoints(a: number[], b: number[]) {
        if(squaredDistance(firstPoint, a) < squaredDistance(firstPoint, b)){
            console.log(a + " closer than " + b);
            return -1;
        }else if(squaredDistance(firstPoint, a) > squaredDistance(firstPoint, b)){
            console.log(b + " closer than " + a);
            return 1;
        }
        console.log("a and b equal distance");
        return 0;
    }

    /**
     * Calculates the squared distance between point1 and point2.
     * @param point1 number[]
     * @param point2 number[]
     * @returns Squared distance between point1 and point2.
     */
    function squaredDistance(point1: number[], point2: number[]) {
        let xComponent: number = (point1[0]-point2[0])*(point1[0]-point2[0]);
        let yComponent: number = (point1[1]-point2[1])*(point1[1]-point2[1]);
        return xComponent + yComponent;
    }

    /**
     * Returns sorted points in order of distance from the first point.
     * @param points 
     */
    function sortPoints(points: number[][]) {
        firstPoint = points.shift() as number[];
        points.sort(comparePoints);
        points.unshift(firstPoint);
        // Seems to not order array?????
    }

    /**  
     * Setup is the first thing called when p5-sketch.js is called.
     */
    const setup = (p5: any, canvasParentRef: any) => {
        var canvas = p5.createCanvas(400, 200);
        canvas.parent(canvasParentRef);
        let points = generatePoints(canvas.width, canvas.height, 10);
        console.log(points)
        sortPoints(points);
        console.log(points);
    }

    /**  
     * Called each new frame the canvas is rendered.
     */
    const draw = (p5: any) => {
        let e:any  = p5.color(255, 255, 255);
    }

    return (
        <Sketch setup={setup} draw={draw} />
    );
}

export default GeoTriangle;