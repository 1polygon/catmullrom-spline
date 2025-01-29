import { Vector2 } from "./vector2";

interface ArcSegment {
    alpha: number;
    length: number;
}

interface Arc {
    segments: ArcSegment[];
    length: number;
}

export class CatmullRomSpline {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // Path
    points: Vector2[] = [];
    arcs: Arc[] = [];

    // Current Segment
    index = 0;
    alpha = 0.0;

    running = true;
    samples = 8;
    speed = 2.0;
    constantSpeed = true;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.#resize();
        window.addEventListener("resize", this.#resize.bind(this));
        requestAnimationFrame(this.#tick.bind(this));
    }

    #resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }

    getPoint(index: number) {
        if (index < 0) {
            return this.points[0];
        } else if (index > this.points.length - 1) {
            return this.points[this.points.length - 1];
        } else {
            return this.points[index];
        }
    }

    #tick() {
        if (this.points.length < 2) {
            return;
        }

        if (this.index >= this.points.length) {
            this.index = 0;
            this.alpha = 0.0;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#drawPath();

        const i = this.index;
        const arc = this.arcs[i];
        const p0 = this.getPoint(i - 1);
        const p1 = this.getPoint(i);
        const p2 = this.getPoint(i + 1);
        const p3 = this.getPoint(i + 2);
        const location = new Vector2(0.0, 0.0);

        if (this.constantSpeed) {
            this.alpha += (1.0 / arc.length) * this.speed;
            let arcAlpha = this.#mapToArcAlpha(arc, this.alpha);
            this.#interpolate(p0, p1, p2, p3, arcAlpha, location);
        } else {
            this.alpha += 0.01 * this.speed;
            this.#interpolate(p0, p1, p2, p3, this.alpha, location);
        }

        // Move to next segment
        if (this.alpha >= 1.0) {
            this.alpha = 0.0;
            if (this.index < this.points.length - 2) {
                this.index++;
            } else {
                this.index = 0;
            }
        }

        // Draw moving circle
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(location.x, location.y, 5, 0, 360);
        this.ctx.fill();
        this.ctx.fillText(String(Math.round(this.alpha * 100) / 100), location.x - 10, location.y - 10);

        if (this.running) {
            requestAnimationFrame(this.#tick.bind(this));
        }
    }

    computeArcs() {
        this.arcs = [];
        for (let i = 0; i < this.points.length; i++) {
            this.#computeArc(i, this.samples);
        }
    }

    #computeArc(index: number, samples: number) {
        const temp = this.points[index].clone();

        const p0 = this.getPoint(index - 1);
        const p1 = this.getPoint(index);
        const p2 = this.getPoint(index + 1);
        const p3 = this.getPoint(index + 2);

        const arc: Arc = {
            segments: [],
            length: 0
        };
        this.arcs[index] = arc;

        // Compute lengths
        for (let j = 0; j < samples; j++) {
            const alpha = j / (samples - 1);
            const prev = temp.clone();
            this.#interpolate(p0, p1, p2, p3, alpha, temp);
            const segmentLength = prev.dist(temp);
            arc.length += segmentLength
            arc.segments[j] = {
                alpha: alpha,
                length: arc.length
            };
        }

        // Normalize lengths
        for (const segment of arc.segments) {
            segment.length /= arc.length;
        }

        return arc;
    }

    #mapToArcAlpha(arc: Arc, alpha: number): number {
        let low = 0;
        let high = arc.segments.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const curr = arc.segments[mid];

            if (mid + 1 < arc.segments.length) {
                const next = arc.segments[mid + 1];

                if (alpha >= curr.length && alpha <= next.length) {
                    const t = (alpha - curr.length) / (next.length - curr.length);
                    return curr.alpha + t * (next.alpha - curr.alpha);
                }
            }

            if (alpha < curr.length) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        return 1.0;
    }

    #drawPath() {
        const ctx = this.ctx;

        // Segments
        ctx.strokeStyle = "white";
        const res = this.points[0].clone();
        ctx.beginPath();
        ctx.moveTo(res.x, res.y);
        for (let i = 0; i < this.points.length - 1; i++) {
            const p0 = this.getPoint(i - 1);
            const p1 = this.getPoint(i);
            const p2 = this.getPoint(i + 1);
            const p3 = this.getPoint(i + 2);
            for (let j = 1; j <= this.samples; j++) {
                const alpha = j / this.samples;
                this.#interpolate(p0, p1, p2, p3, alpha, res);
                ctx.lineTo(res.x, res.y);
            }
        }
        ctx.stroke();

        // Points
        ctx.fillStyle = "yellow";
        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, 360);
            ctx.fill();
        }
    }

    #interpolate(p0: Vector2, p1: Vector2, p2: Vector2, p3: Vector2, t: number, result: Vector2) {
        const t2 = t * t;
        const t3 = t2 * t;
        result.x = 0.5 * (
            (2 * p1.x) +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
        );
        result.y = 0.5 * (
            (2 * p1.y) +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
        );
    }
}