import Sketch from 'react-p5';

function GeoTriangle() {
    let firstPoint: number[];
    let points: number[][]; 
    let k: number[];
    let centre: number[];
    let cRadius: number;
    let hull: Triangle[] = [];
    let perimeter: Triangle[] = [];
    let s: number[][];

    class Triangle {
        point1: number[];
        point2: number[];
        point3: number[];

        constructor(point1: number[], point2: number[], point3: number[]){
            this.point1 = point1;
            this.point2 = point2;
            this.point3 = point3;
        }

        public toString = () : string => {
            return("Triangle:\n" + "  point1: " + this.point1.toString() + "\n  point2: " 
                 + this.point2.toString() + "\n  point3: " + this.point3.toString());
        }

        public draw(p5: any) {
            p5.line(this.point1[0], this.point1[1], this.point2[0], this.point2[1]);
            p5.line(this.point2[0], this.point2[1], this.point3[0], this.point3[1]);
            p5.line(this.point1[0], this.point1[1], this.point3[0], this.point3[1]);
        }
    }

    /**  
     * @returns A random integer between 0 and "max" argument.
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
        return points;
    }

    /**
     * Comparing function, compares the squared distance between some point a
     * and the selected "first" point, with another point, b's, squared distance
     * to the "first" point.
     * Returns as per the Array.prototype.sort documentation specifies.
     * @param a number[] First point to be compared.
     * @param b number[] Second point to be compared
     * @returns -1 if a is closer, 1 if b is closer, 0 if they're the same.
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
     * Sorts points in-place by order of distance from the first point.
     * @param points - Points to sort.
     */
    function sortPointsToFirst(points: number[][]) {
        firstPoint = points.shift() as number[];
        points.sort(comparePoints);
        points.unshift(firstPoint);
    }

    /**
     * Calculates and returns the centre and radius of the circumcircle that 
     * inscribes points a, b, and c.
     * @param a Point a - Array of 2 numebrs.
     * @param b Point b - Array of 2 numebrs.
     * @param c Point c - Array of 2 numebrs.
     * @returns [centre, radiusSquared], describing the centre's x & y, and the radius
     * squared of the circumcircle. 
     */
    function calculateCircumCircle(a: number[], b: number[], 
                                   c: number[]): [number[], number] {
        let tempCentre: number[] = [];
        let radiusSquared: number;
        let abMidpoint: number[] = [Math.min(a[0], b[0])+(Math.abs(a[0]-b[0])/2), 
                                    Math.min(a[1], b[1])+(Math.abs(a[1]-b[1])/2)];
        let bcMidpoint: number[] = [Math.min(b[0], c[0])+(Math.abs(b[0]-c[0])/2), 
                                    Math.min(b[1], c[1])+(Math.abs(b[1]-c[1])/2)];
        let abGradient: number = (b[1]-a[1])/(b[0]-a[0]);
        let bcGradient: number = (c[1]-b[1])/(c[0]-b[0]);
        let abNormal: number = -1/abGradient;
        let bcNormal: number = -1/bcGradient;
        let abYIntersept: number = abMidpoint[1]-abNormal*abMidpoint[0];
        let bcYIntersept: number = bcMidpoint[1]-bcNormal*bcMidpoint[0];
        tempCentre.push(Math.round((bcYIntersept-abYIntersept)/(abNormal-bcNormal)));
        tempCentre.push(Math.round((tempCentre[0]*abNormal + abYIntersept)));
        radiusSquared = (tempCentre[0]-a[0])*(tempCentre[0]-a[0]) + 
                        (tempCentre[1]-a[1])*(tempCentre[1]-a[1]);
        return [tempCentre, Math.floor(Math.sqrt(radiusSquared))];
    }

    /**
     * Calculates the circumcircles inscribed on points x_i and x_j with the 
     * rest of the points, keeps track of the smallest radius and its respective
     * index in the points array. Returning the index corresponding to x_k.
     * @param points Array of points.
     * @returns Index of k.
     */
    function getCAndK(points: number[][]): [number, number[], number] {
        let i = points.shift() as number[];
        let j = points.shift() as number[];
        let smallestRadius: number = 0;
        let smallestCentre: number[] = [0, 0];
        let k = -1;
        for(let idx = 0; idx < points.length; idx++){
            let [tempCentre, radius] = calculateCircumCircle(i, j, points[idx]);
            if(smallestRadius == 0 || radius < smallestRadius){
                smallestRadius = radius;
                smallestCentre = tempCentre
                k = idx;
            }
        }
        points.unshift(j);
        points.unshift(i);
        return [k + 2, smallestCentre, smallestRadius];
    }

    /**
     * Comparing function, compares the squared distance between some point a
     * and the centre of root circumcircle, with another point, b's, squared 
     * distance to centre of root circumcircle.
     * Returns as per the Array.prototype.sort documentation specifies.
     * @param a number[] First point to be compared.
     * @param b number[] Second point to be compared
     * @returns -1 if a is closer, 1 if b is closer, 0 if they're the same.
     */
    function comparePointsToC(a: number[], b: number[]) {
        if(squaredDistance(a, centre) < squaredDistance(b, centre)){
            return -1;
        }else if(squaredDistance(a, centre) > squaredDistance(b, centre)){
            return 1;
        }
        return 0;
    }

    /**
     * Sorts points, excluding x_0, x_j, and x_k, into a new array "s",
     * comparing each points to the circumcircle centre.
     * @param points Points array to be compared.
     */
    function sortPointsToC(points: number[][]) {
        let s = points.slice();
        s.splice(points.indexOf(k), 1);
        s.shift();
        s.shift();
        s.sort(comparePointsToC);
        return s;
    }

    /**  
     * Setup is the first thing called when p5-sketch.js is called.
     */
    const setup = (p5: any, canvasParentRef: any) => {
        var canvas = p5.createCanvas(400, 200);
        canvas.parent(canvasParentRef);
        generatePoints(canvas.width, canvas.height, 6);
        sortPointsToFirst(points);
        //x_i and x_j are the first two points in points array.
        let [kIdx, c, radius] = getCAndK(points);
        k = points[kIdx].slice();
        centre = c;
        cRadius = radius;
        hull.push(new Triangle(firstPoint, points[1], k));
        s = sortPointsToC(points);
        perimeter = hull.slice();
        console.log(perimeter.toString());
        // For each val in S:
        //   find nearest point in PERIMETER
        //   
    }

    /**  
     * Called each new frame the canvas is rendered.
     */
    const draw = (p5: any) => {
        p5.background(200);
        p5.stroke(255,255,255);
        p5.circle(centre[0],centre[1],[cRadius*2])
        //p5.stroke(0,0,0);
        //points.forEach(item => p5.line(firstPoint[0], firstPoint[1], item[0], item[1]));
        p5.stroke(0 ,0 ,0);
        perimeter.forEach(triangle => {
            triangle.draw(p5);
    });
        
    }

    return (
        <Sketch setup={setup} draw={draw} />
    );
}

export default GeoTriangle;