function calculate_slope(pointA, pointB) {
    let slope = (pointB.y - pointA.y) / (pointB.x - pointA.x);
    if (slope === 0) {
        slope = EPSILON_ZERO;
    }
    else if (slope === Infinity) {
        slope = EPSILON_INFINITY*canvas.height
    }
    else if (slope === -Infinity) {
        slope = -EPSILON_INFINITY*canvas.height
    }
    return slope;
}

function intersection_with_x_axis(point, slope, line) {
    let x = point.x - point.y / slope
    let y = 0;
    return new Point(x,y, line)
}

function intersection_with_y_axis(point, slope, line) {
    let x = 0;
    let y = point.y - point.x * slope;
    return new Point(x,y, line)
}

function intersection_with_lower_border(point, slope, line) {
    let x = point.x + (canvas.height - point.y) / slope;
    let y = canvas.height
    return new Point(x,y, line);
}

function get_turn(a, b, c) {
    let determinant =
        a.x * (b.y - c.y) - a.y * (b.x - c.x) + (b.x * c.y - c.x * b.y);
    if (determinant < 0) return -1;
    if (determinant > 0) return 1;
    return 0
}

function are_in_region(q, h, points) {
    let q_turn = get_turn(q, h.a, h.b);
    //Check if all the given points are in the region defined by q and h. Returns false if one point is not inside (and not on the bound)
    for (let i = points.length-1; i >= 0; i--) {
        let p_turn = get_turn(points[i], h.a, h.b);
        if (q_turn !== p_turn) { // If they have once a different turn, they are not all in the region
            return false;
        }
    }
    return true;
}

function get_random_point(width, height){
    let x = Math.floor(Math.random()*width);
    let y = Math.floor(Math.random()*height);

    return new Point(x, y);
}


function get_center_of_triangle(a, b, c) {
    return new Point((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3)
}

function longest_increasing_subsequence(sequence) {
    let P = new Array(sequence.length);
    let M = new Array(sequence.length+1);

    let L = 0;
    for (let i = 0; i < sequence.length; i++) {
        let lo = 1
        let hi = L
        while (lo <= hi) {
            let mid = Math.ceil((lo+hi)/2);
            if (sequence[M[mid]] < sequence[i]) {
                lo = mid+1
            } else {
                hi = mid-1
            }
        }
        let newL = lo;
        P[i] = M[newL-1];
        M[newL] = i;

        if (newL > L) {
            L = newL;
        }
    }
    let S = new Array(L);
    let k = M[L];
    for (let i = 0; i < L; i++) {
        S[i] = sequence[k];
        k = P[k];
    }
    return S;
}