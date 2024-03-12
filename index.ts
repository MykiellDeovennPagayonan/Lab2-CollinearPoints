import p5 from "p5";

const width: number = 800;
const height: number = 535;
const padding: number = 50;

let sketch = async function (p: p5) {
  let result: string[] = [];

  let loadFile = document.getElementById('inputButton');
  let algorithmSelect = document.getElementById('algoSelect') as HTMLSelectElement;
  let fileNameSelect = document.getElementById('fileSelect') as HTMLSelectElement;
  let timeDisplay = document.getElementById('timeDisplay') as HTMLDivElement;
  let fileName = fileNameSelect.value;

  // Inside the onclick handler
  loadFile!.onclick = function () {
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
      } else if (this.x === that.x) {
        // Vertical line
        return Number.POSITIVE_INFINITY;
      }

      return (that.y - this.y) / (that.x - this.x);
    }

    compareTo(other: Point): number {
      if (this.y < other.y || (this.y === other.y && this.x < other.x)) {
        return -1; // this is less than other
      } else if (this.x === other.x && this.y === other.y) {
        return 0; // this is equal to other
      } else {
        return 1; // this is greater than other
      }
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

      const p = JSON.stringify(this.p);
      const q = JSON.stringify(this.q);
      return `${p} -> ${q}`;
    }
  }

  class BruteCollinearPoints {
    collinearSegments: LineSegment[];
    lineSegments: LineSegment[] = [];

    constructor(points: Point[]) {
      let n = points.length;
      this.collinearSegments = [];
      this.lineSegments = [];

      if (points === null) {
        throw new Error("Points array cannot be null");
      }

      // sort the points according to x values
      // if same x values, sort by y instead
      points.sort((a, b) => a.x - b.x || a.y - b.y);

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
                  const segment = new LineSegment(points[i], points[l]);

                  this.collinearSegments.push(segment);
                }
              }
            }
          }
        }
      }
    }

    numberOfSegments(): number {
      return this.lineSegments.length;
    }

    segments(): LineSegment[] {
      // prevent duplicate segments
      for (const collinearSet of this.collinearSegments) {
        if (!this.lineSegments.some(segment => segment.toString() === collinearSet.toString())) {
          this.lineSegments.push(collinearSet);
        }
      }
      return this.lineSegments;
    }
  }

  class FastCollinearPoints {
    collinearSegments: LineSegment[];

    constructor(points: Point[]) {
      if (points === null) {
        throw new Error("Points array cannot be null");
      }

      this.collinearSegments = [];
      const n = points.length;

      for (let i = 0; i < n; i++) {
        const origin = points[i];
        // sort points by its slope based on the origin
        const sortedPoints = this.mergeSort(points, origin);

        let count = 1;
        let j = 1;

        while (j < n) {
          // Find consecutive points with the same slope
          while (j < n && origin.slopeTo(sortedPoints[j - 1]) === origin.slopeTo(sortedPoints[j])) {
            count++;
            j++;
          }

          // 4 or more points  with same slope, it pushes to collinearsegments array
          if (count >= 3) {
            const segmentPoints = [origin, ...sortedPoints.slice(j - count, j)];
            // sort the segment points by coordinates (reference is null)
            const sortedSegmentPoints = this.mergeSort(segmentPoints, null);
            const minPoint = sortedSegmentPoints[0];
            const maxPoint = sortedSegmentPoints[sortedSegmentPoints.length - 1];

            this.collinearSegments.push(new LineSegment(minPoint, maxPoint));
          }

          count = 1;
          j++;
        }
      }
    }

    mergeSort(arr: Point[], reference: Point | null): Point[] {
      if (arr.length <= 1) return arr;

      const mid = Math.floor(arr.length / 2);
      const left = this.mergeSort(arr.slice(0, mid), reference);
      const right = this.mergeSort(arr.slice(mid), reference);

      // if reference is null, it uses merge by coordinates
      return reference ? this.mergeBySlope(left, right, reference) : this.mergeByCoordinates(left, right);
    }

    mergeBySlope(left: Point[], right: Point[], reference: Point): Point[] {
      let sortedArr: Point[] = [];

      while (left.length && right.length) {
        const leftSlope = left[0].slopeTo(reference);
        const rightSlope = right[0].slopeTo(reference);

        if (leftSlope < rightSlope) {
          sortedArr.push(left.shift()!);
        } else {
          sortedArr.push(right.shift()!);
        }
      }

      return [...sortedArr, ...left, ...right];
    }

    mergeByCoordinates(left: Point[], right: Point[]): Point[] {
      let sortedArr: Point[] = [];

      while (left.length && right.length) {
        if (left[0].compareTo(right[0]) < 0) {
          sortedArr.push(left.shift()!);
        } else {
          sortedArr.push(right.shift()!);
        }
      }

      return [...sortedArr, ...left, ...right];
    }

    numberOfSegments(): number {
      return this.collinearSegments.length;
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

    for (const segment of collinear.segments()) {
      console.log(segment.toString());
      segment.draw();
    }

    const end = performance.now();

    timeDisplay.textContent = `Time Executed: ${end - start} ms`;
  };
};

new p5(sketch);
