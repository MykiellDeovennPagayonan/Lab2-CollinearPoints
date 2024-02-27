import p5 from "p5";

const width: number = 800;
const height: number = 500;
const padding: number = 50;
let fileName = "input6"; // Default file name

let sketch = async function (p: p5) {
  let result: string[] = [];

  let myLink = document.getElementById('inputButton');
  let fileInput = document.getElementById('fileInput') as HTMLInputElement;

  myLink!.onclick = function () {
    fileName = fileInput!.value;
    console.log(fileName)
    loadFile();
  }

  function loadFile() {
    p.loadStrings(`test-data/${fileName}.txt`, function (data) {
      data.shift();
      data.pop();
      result = data;
      p.setup();
    });
  }

  p.setup = function () {
    p.createCanvas(width, height);

    p.strokeWeight(3);
    p.stroke("blue");

    // x and y axes
    p.line(padding, padding, padding, height - padding);
    p.line(padding, height - padding, width - padding, height - padding);

    // y-axis arrow head
    p.line(padding, padding, padding - 5, padding + 5);
    p.line(padding, padding, padding + 5, padding + 5);

    // x-axis arrow head
    p.line(
      width - padding,
      height - padding,
      width - padding - 5,
      height - padding + 5
    );
    p.line(
      width - padding,
      height - padding,
      width - padding - 5,
      height - padding - 5
    );

    p.strokeWeight(0);
    p.text("(0, 0)", padding + 10, height - 30);
  };

  class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    draw(): void {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(800);
      p.point(this.x, this.y);
    }

    drawTo(that: Point) {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(200);
      p.line(this.x, this.y, that.x, that.y);
    }

    slopeTo(that: Point): number {
      return (that.y - this.y) / (that.x - this.x);
    }
  }

  class LineSegment {
    p: Point;
    q: Point;

    constructor(p: Point, q: Point) {
      // DO NOT MODIFY

      this.p = p;
      this.q = q;
    }

    draw(): void {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(200);
      p.line(this.p.x, this.p.y, this.q.x, this.q.y);
    }

    toString(): string {
      // DO NOT MODIFY
      return `(${this.p.x},${this.p.y}) -> (${this.q.x},${this.q.y})`
    }
  }

  class BruteCollinearPoints {
    collinearPoints: Point[];

    constructor(points: Point[]) {
      let n = points.length;
      this.collinearPoints = []

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          for (let k = j + 1; k < n; k++) {
            for (let l = k + 1; l < n; l++) {
              if (
                points[i].slopeTo(points[j]) ===
                points[j].slopeTo(points[k]) &&
                points[j].slopeTo(points[k]) ===
                points[k].slopeTo(points[l])
              ) {
                if (!this.collinearPoints.includes(points[i])) {
                  this.collinearPoints.push(points[i])
                }
                if (!this.collinearPoints.includes(points[j])) {
                  this.collinearPoints.push(points[j])
                }
                if (!this.collinearPoints.includes(points[k])) {
                  this.collinearPoints.push(points[k])
                }
                if (!this.collinearPoints.includes(points[l])) {
                  this.collinearPoints.push(points[l])
                }
              }
            }
          }
        }
      }
    }

    numberOfSegments(): number {
      return this.collinearPoints.length;
    }

    segments(): LineSegment[] {
      const lineSegments: LineSegment[] = [];

      for (let i = 0; i < this.collinearPoints.length - 1; i++) {
        const startPoint = this.collinearPoints[i];
        const endPoint = this.collinearPoints[i + 1];

        lineSegments.push(new LineSegment(startPoint, endPoint));
      }

      return lineSegments;
    }
  }

  // class FastCollinearPoints {
  //   constructor(points: Point[]) {
  //     // YOUR CODE HERE
  //   }

  //   numberOfSegments(): number {
  //     // YOUR CODE HERE
  //   }

  //   segments(): LineSegment[] {
  //     // let x= new Point(3,2)
  //     // let y= new Point(3,20)
  //     // let x2= new Point(9000,2000)
  //     // let y2= new Point(3000,20000)
  //     // let hi = new LineSegment(x2,y2)
  //     // let hi2 = new LineSegment(x,y)
  //     // return [hi,hi2]
  //   }
  // }

  // Declare your point objects here~
  // const point = new Point(19000, 10000);
  // const point2 = new Point(10000, 10000);

  // from input6.txt
  // const points: Point[] = [
  //   new Point(19000, 10000),
  //   new Point(18000, 10000),
  //   new Point(32000, 10000),
  //   new Point(21000, 10000),
  //   new Point(1234, 5678),
  //   new Point(14000, 10000),
  // ];


  p.draw = function () {
    // Convert each string in the array to a Point object
    const points: Point[] = result.map(pointString => {
      const [x, y] = pointString.trim().split(/\s+/).map(Number);
      return new Point(x, y);
    });
    p.translate(padding, height - padding);
    p.scale(1 / 100, -1 / 100);

    // Call your draw and drawTo here.

    for (const point of points) {
      point.draw();
    }

    const collinear = new BruteCollinearPoints(points);
    for (const segment of collinear.segments()) {
      // console.log(segment.toString());
      segment.draw();
    }
  };
} as any;

new p5(sketch);
