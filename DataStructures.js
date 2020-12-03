class Point {
    constructor(x,y) {
        this.x = x; this.y = y;

        this.color = "black";
        this.recolor();
    }
    display() {
        stroke(this.color);fill(this.color);
        ellipse(this.x, this.y, POINT_RADIUS, POINT_RADIUS);
        reset_stroke();
    }
    recolor() {
        if (this === q) { // This is the q point
            this.color = "black"
            return;
        }

        if (q === null || h === null) {
            this.color = "black";
            return;
        }

        if (this.is_on_same_side(q, h)) {
            this.color = "green";
        } else {
            this.color = "red";
        }
    }

    is_on_same_side(q, h) {
        return get_turn(q, h.a, h.b) === get_turn(this, h.a, h.b);
    }
}

class Line {
    constructor(a, b, thickness=1) {
        this.a = a; this.b = b;
        this.slope = calculate_slope(this.a, this.b);
        this.extendLine();

        this.color = "black";
        this.thickness = thickness;

        this.points = [];
    }
    display() {
        stroke(this.color);fill(this.color);strokeWeight(this.thickness)
        line(this.a.x, this.a.y, this.b.x, this.b.y);
        reset_stroke();
    }
    extendLine(){
        this.a = intersection_with_x_axis(this.a, this.slope);

        this.b = intersection_with_lower_border(this.b, this.slope);
    }
    refresh_all_intersections() {
        this.get_all_intersections();
    }
    get_all_intersections() {
        let intersections = [];
        for (let i = lines.length-1; i >= 0; i--) {
            if (this === lines[i]) {continue;} // Please do not intersect with yourself, thank youuuu
            intersections.push(this.intersects(lines[i]))
        }
        this.points = intersections;
        return this.points;
    }
    recolor(intersections=this.get_all_intersections()) {
        if (q === null || h === null) { // q or h is not defined, so black line
            this.color = "black";
            return;
        }
        for (let i = intersections.length - 1; i >= 0; i--) {
            if (!intersections[i].is_on_same_side(q, h)) {
                this.color = "red"; // We found one red point, so the line is red and we stop
                return;
            }
        }
        this.color = "green"; // We didn't find any red point
    }

    intersects(other) {
        // Calculating using determinant, translated to from math to javascript from source : https://mathworld.wolfram.com/Line-LineIntersection.html
        const x1 = this.a.x; const y1 = this.a.y;
        const x2 = this.b.x; const y2 = this.b.y;

        const x3 = other.a.x; const y3 = other.a.y;
        const x4 = other.b.x; const y4 = other.b.y;

        const xPoint = ((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

        const yPoint = ((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
            ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));


        //Since the division by 0 is allowed in Javascript, if two lines are parallel, the point will have Infinite as x and y
        return new Point(xPoint, yPoint);
    }
}