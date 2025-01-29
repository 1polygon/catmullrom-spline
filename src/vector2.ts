export class Vector2 {
    x: number = 0.0;
    y: number = 0.0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }

    sub(v: Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mul(v: Vector2) {
        this.x *= v.x;
        this.y *= v.y;
    }

    dist(v: Vector2): number {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    lerp(p0: Vector2, p1: Vector2, t: number) {
        return new Vector2(
            p0.x * (1 - t) + p1.x * t,
            p0.y * (1 - t) + p1.y * t
        );
    }

    clone() {
        return new Vector2(this.x, this.y);
    }
}