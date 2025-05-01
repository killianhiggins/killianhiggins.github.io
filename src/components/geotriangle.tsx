import Sketch from 'react-p5';

function GeoTriangle() {
    let firstPoint: number[];
    let points: number[][]; 

    /**  
     * Returns a random integer between 0 and "max" argument.
     */
    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    /**
     * Generates num number of points for canvas, given width, height, and num.
     * Will never generate points lying on the same verticle or horizontal axis.
     * @returns A generated array of arrays storing a random x and y integer.
     */
    function generatePoints(width: number, height: number, num: number){
        points = [[getRandomInt(1, width-2), getRandomInt(1, height-2)]];
        while(points.length < num){
            let x: number = getRandomInt(1, width-2);
            let y: number = getRandomInt(1, height-2);
            let xPoints: number[] = [];
            let yPoints: number[] = [];
            points.forEach(point => {
                xPoints.push(point[0]);
                yPoints.push(point[1]);
            });
            while(xPoints.includes(x)){
                x = getRandomInt(1, width-2);
            }
            while(yPoints.includes(y)){
                y = getRandomInt(1, height-2);
            }
            points.push([x, y]);
        }
        console.log(points);
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
            return -1;
        }else if(squaredDistance(firstPoint, a) > squaredDistance(firstPoint, b)){
            return 1;
        }
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
    }

    /**
     * 
     * @param a 
     * @param b 
     * @param c 
     * @returns [centre, radiusSquared], describing the centre's x & y, and the radius
     * squared of the circumcircle. 
     */
    function calculateCircumCircle(a: number[], b: number[], 
                                   c: number[]): [number[], number] {
        let centre: number[] = [];
        let radiusSquared: number;
        let abMidpoint: number[] = [Math.min(a[0], b[0])+(Math.abs(a[0]-b[0])/2), 
                                    Math.min(a[1], b[1])+(Math.abs(a[1]-b[1])/2)];
        console.log("MIDPOINT: " + abMidpoint);
        let bcMidpoint: number[] = [Math.min(b[0], c[0])+(Math.abs(b[0]-c[0])/2), 
                                    Math.min(b[1], c[1])+(Math.abs(b[1]-c[1])/2)];
        console.log("MIDPOINT: " + bcMidpoint);
        let abGradient: number = 0;
        let bcGradient: number = 0;

        abGradient = (b[1]-a[1])/(b[0]-a[0]);
        bcGradient = (c[1]-b[1])/(c[0]-b[0]);
        console.log("AB GRADIENT: " + abGradient);

        let abNormal: number;
        let bcNormal: number;
        abNormal = -1/abGradient;
        bcNormal = -1/bcGradient;

        let abYIntersect: number = abMidpoint[1]-abNormal*abMidpoint[0];
        let bcYIntersect: number = bcMidpoint[1]-bcNormal*bcMidpoint[0];

        centre.push(Math.round((abYIntersect-bcYIntersect)/(bcGradient-abGradient)));
        centre.push(Math.round((centre[0]*abNormal + abYIntersect)));

        radiusSquared = (centre[0]-a[0])*(centre[0]-a[0]) + 
                        (centre[1]-a[1])*(centre[1]-a[1]);
        return [centre, Math.floor(Math.sqrt(radiusSquared))];
    }

    /**
     * 
     * @param points 
     */
    function getK(points: number[][]) {
        let i = points.shift() as number[];
        let j = points.shift() as number[];

        let centres: number[][] = [];
        let radSquares: number[] = [];
        for(let idx = 0; idx < points.length; idx++){
            console.log(idx + " " + points[idx].toString());
            let [centre, radSqaured] = calculateCircumCircle(i, j, points[idx]);
            centres.push(centre);
            radSquares.push(radSqaured);
            console.log(radSqaured + " " + centre.toString());
        }
        points.unshift(j);
        points.unshift(i);
    }

    /**  
     * Setup is the first thing called when p5-sketch.js is called.
     */
    const setup = (p5: any, canvasParentRef: any) => {
        var canvas = p5.createCanvas(400, 200);
        canvas.parent(canvasParentRef);
        generatePoints(canvas.width, canvas.height, 5);
        sortPoints(points);
        //x_i and x_j are the first two points in points array.
        getK(points);

    }

    /**  
     * Called each new frame the canvas is rendered.
     */
    const draw = (p5: any) => {
        p5.background(200);
        points.forEach(item => p5.line(firstPoint[0], firstPoint[1], item[0], item[1]));

    }

    return (
        <Sketch setup={setup} draw={draw} />
    );
}

export default GeoTriangle;