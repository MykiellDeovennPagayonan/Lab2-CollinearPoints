import p5 from "p5";

const width: number = 800;
const height: number = 535;
const padding: number = 50;

let sketch = async function (p: p5) {
  let result: string[] = [];

  let myLink = document.getElementById('inputButton');
  let algorithmSelect = document.getElementById('algoSelect') as HTMLSelectElement;
  let fileNameSelect = document.getElementById('fileSelect') as HTMLSelectElement;
  let timeDisplay = document.getElementById('timeDisplay') as HTMLDivElement;
  let fileName = fileNameSelect.value;

  // Inside the onclick handler
  myLink!.onclick = function () {
    fileName = fileNameSelect.value;
    p.loadStrings(`test-data/${fileName}.txt`, function (data) {
      data.shift();
      data.pop();
      result = data;
      p.setup();
      p.redraw();
    });
  };

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
    p.noLoop();
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
      if (this.x === that.x && this.y === that.y) {
        // Degenerate line segment
        return Number.NEGATIVE_INFINITY;
      }

      if (this.x === that.x) {
        // Vertical line
        return Number.POSITIVE_INFINITY;
      }

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

      p.stroke("red");
      p.strokeWeight(200);
      p.line(this.p.x, this.p.y, this.q.x, this.q.y);
    }

    toString(): string {
      // DO NOT MODIFY
      return `(${this.p.x},${this.p.y}) -> (${this.q.x},${this.q.y})`
    }
  }

  class BruteCollinearPoints {
    collinearSegments: LineSegment[];

    constructor(points: Point[]) {
      let n = points.length;
      this.collinearSegments = [];

      if (points === null) {
        throw new Error("Points array cannot be null");
      }

      for (let i = 0; i < n; i++) {
        if (points[i] === null) {
          throw new Error("Point in the array cannot be null");
        }

        for (let j = i + 1; j < n; j++) {
          if (points[i] === points[j]) {
            throw new Error("Repeated points are not allowed");
          }

          for (let k = j + 1; k < n; k++) {
            if (points[i].slopeTo(points[j]) === points[j].slopeTo(points[k])) {
              for (let l = k + 1; l < n; l++) {
                if (points[j].slopeTo(points[k]) === points[k].slopeTo(points[l])) {
                  // Sort the collinear points based on x-coordinate, and then y-coordinate
                  const collinearSet = [points[i], points[j], points[k], points[l]].sort((a, b) => {
                    if (a.x !== b.x) {
                      return a.x - b.x;
                    }
                    return a.y - b.y;
                  });

                  // Create a line segment using the first and last points (endpoints)
                  const newSegment = new LineSegment(collinearSet[0], collinearSet[collinearSet.length - 1]);

                  // Avoid adding duplicate line segments
                  if (!this.collinearSegments.some(segment => segment.toString() === newSegment.toString())) {
                    this.collinearSegments.push(newSegment);
                  }
                }
              }
            }
          }
        }
      }
    }

    numberOfSegments(): number {
      return this.collinearSegments.length;
    }

    segments(): LineSegment[] {
      const lineSegments: LineSegment[] = [];
      console.log(this.collinearSegments);

      for (const collinearSet of this.collinearSegments) {
        // Avoid adding duplicate line segments
        if (!lineSegments.some(segment => segment.toString() === collinearSet.toString())) {
          lineSegments.push(collinearSet);
        }
      }
      return lineSegments;
    }
  }

  class FastCollinearPoints {
    collinearSegments: LineSegment[];

    constructor(points: Point[]) {
      let n = points.length;
      this.collinearSegments = [];

      if (points === null) {
        throw new Error("Points array cannot be null");
      }

      for (let i = 0; i < n; i++) {
        const origin = points[i];
        const slopesMap = new Map();
      
        for (let j = i + 1; j < n; j++) {
          if (i === j) continue;
      
          const slope = origin.slopeTo(points[j]);
          slopesMap.set(slope, slopesMap.get(slope) || []);
          slopesMap.get(slope).push(points[j]);
        }
      
        for (const [slope, collinearPoints] of slopesMap) {
          console.log(origin,slopesMap)
          if (collinearPoints.length >= 3) {
            const collinearSet = [origin, ...collinearPoints];
            collinearSet.sort((a, b) => {
              if (a.x !== b.x) {
                return a.x - b.x;
              }
              return a.y - b.y;
            });
      
            // Avoid duplicates
            const newSegment = new LineSegment(collinearSet[0], collinearSet[collinearSet.length - 1]);
            if (!this.collinearSegments.some(segment => segment.toString() === newSegment.toString())) {
              this.collinearSegments.push(newSegment);
            }
          }
        }
      }

      // for (const slopes of this.slopes) {

      // }
    }

    numberOfSegments(): number {
      return 0;
    }

    segments(): LineSegment[] {

      return this.collinearSegments;
    }
  }

  p.draw = function () {
    // Convert each string in the array to a Point object
    const points: Point[] = result
      .map(pointString => {
        const [x, y] = pointString.trim().split(/\s+/).map(Number);
        if (y === undefined) {
          return null;
        } else {
          return new Point(x, y);
        }
      })
      .filter((value): value is Point => value !== null);

    p.translate(padding, height - padding);
    p.scale(1 / 80, -1 / 80);

    // Call your draw and drawTo here.

    for (const point of points) {
      point.draw();
    }
    const start = performance.now();
    const collinear =
      algorithmSelect.value === 'brute' ?
        new BruteCollinearPoints(points) :
        new FastCollinearPoints(points)
    const end = performance.now();

    timeDisplay.textContent = `Time Executed: ${end - start} ms`;

    for (const segment of collinear.segments()) {
      // console.log(segment.toString());
      segment.draw();
    }
  };
};

new p5(sketch);
