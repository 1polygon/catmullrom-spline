import { CatmullRomSpline } from "./catmullrom";
import { Vector2 } from "./vector2";

export class SplineController {
    spline: CatmullRomSpline;
    draggingPoint = -1;
    dragOffset = new Vector2(0, 0);
    numPoints = 10;
    ui: HTMLElement;

    constructor(spline: CatmullRomSpline) {
        this.spline = spline;
        this.ui = document.createElement("div");
        this.ui.className = "ui";

        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));

        this.addSlider("Points", this.numPoints, 2, 20.0, 1, value => {
            this.numPoints = value;
            this.generatePath();
        });
        this.addSlider("Arc Samples", this.spline.samples, 2, 16, 1, value => {
            this.spline.samples = value;
            this.spline.computeArcs();
        });
        this.addSlider("Follower Speed", this.spline.speed, 0.0, 20.0, 0.1, value => {
            this.spline.speed = value;
        });
        this.addCheckbox("Constant Speed", this.spline.constantSpeed, value => {
            this.spline.constantSpeed = value;
        });

        document.body.appendChild(this.ui);
        this.generatePath();
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.generatePath();
    }

    generatePath() {
        this.spline.points = [];
        for (let i = 0; i < this.numPoints; i++) {
            const x = 50 + (i / (this.numPoints - 1)) * (this.spline.canvas.clientWidth - 100.0);
            this.spline.points.push(new Vector2(x, this.spline.canvas.clientHeight * 0.5 + Math.sin((x / this.spline.canvas.clientWidth) * 20.0) * 150.0));
        }
        if (this.closed) {
            this.spline.points.push(this.spline.points[0]);
        }
        this.spline.computeArcs();
    }

    onMouseDown(e: MouseEvent) {
        const p = new Vector2(e.x, e.y);
        for (let i = 0; i < this.spline.points.length; i++) {
            const point = this.spline.points[i];
            if (point.dist(p) < 10) {
                this.dragOffset.x = point.x - p.x;
                this.dragOffset.y = point.y - p.y;
                this.draggingPoint = i;
                break;
            }
        }
    }

    onMouseUp(e: MouseEvent) {
        if (this.draggingPoint != -1) {
            this.draggingPoint = -1;
            this.spline.computeArcs();
        }
    }

    onMouseMove(e: MouseEvent) {
        if (this.draggingPoint != -1) {
            const point = this.spline.points[this.draggingPoint];
            point.x = e.x;
            point.y = e.y;
            point.add(this.dragOffset);
        }
    }

    addSlider(name: string, value: number, min: number, max: number, steps: number, onChange: () => {}) {
        const prop = document.createElement("div");
        const row = document.createElement("div");
        row.className = "row";
        const title = document.createElement("div");
        title.className = "title";
        title.textContent = name;
        row.appendChild(title);

        const val = document.createElement("div");
        val.className = "value";
        val.textContent = value;
        row.appendChild(val);

        prop.appendChild(row);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.value = value;
        slider.step = steps;
        slider.min = min;
        slider.max = max;
        slider.addEventListener("input", e => {
            val.textContent = e.target.value;
            onChange(e.target.value);
        });
        prop.appendChild(slider);
        this.ui.appendChild(prop);
    }

    addCheckbox(name: string, value: boolean, onChange: () => {}) {
        const prop = document.createElement("div");
        const row = document.createElement("div");
        row.className = "row";
        const title = document.createElement("div");
        title.className = "title";
        title.textContent = name;
        row.appendChild(title);

        prop.appendChild(row);

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = value;
        input.addEventListener("input", e => {
            onChange(e.target.checked);
        });
        prop.appendChild(input);
        this.ui.appendChild(prop);
    }
}