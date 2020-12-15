let canvas;

let intersection_points = [];
let lines = [];

let last_click = null;
let q = null;
let h = null;

let show_intersections = true;

function setup() {
    intersection_points = [];
    lines = [];
    last_click = q = h = null;

    canvas = createCanvas(document.getElementById("canvasContainer").offsetWidth, windowHeight)
    canvas.parent("canvasContainer");
    canvas.mouseClicked(click_line);

    background(200)

}

function draw() {
    background(200);
    reset_stroke();

    q?.display();
    h?.display();

    lines.forEach(line => line.display());
    preview_line?.display(); // does nothing if preview_line is null
    if (show_intersections === true) {
        intersection_points.forEach(point => point.display());
        preview_intersection_points?.forEach(point => point.display());
    }


    text_on_canvas = lines.length + " lines. µ = " + count_nb_green_lines();
    //text(text_on_canvas, 10,10, 50,50);
}

function windowResized() {
    resizeCanvas(document.getElementById("canvasContainer").offsetWidth, windowHeight);
}

function reset_stroke() {
    fill("black");
    stroke("black")
    strokeWeight(0)
}

function add_line(line) {
    let intersections = line.get_all_intersections();
    line.recolor(intersections);


    lines.push(line);
    intersection_points.push(...intersections);
    document.getElementById("nb_lines").value = lines.length;
}

function refresh_all_colors() {
    reset_stroke();
    if (show_intersections) {
        intersection_points.forEach(point => point.recolor());
    }
    lines.forEach(line => line.recolor()) ;
}

function find_subset() {
    let lines_copy = [[], []];
    lines.forEach((line, i) => {
        let slope = calculate_slope(line.a, line.b);
        if (slope > calculate_slope(h.a, h.b)) {
            lines_copy[0].push([i, line])
        } else {
            lines_copy[1].push([i, line]);
        }
    });
    // Sorting the lines by increasing slope in 2 halves like the function -1/x
    lines_copy[0].sort(([i, line_a], [j, line_b]) => calculate_slope(line_a.a, line_a.b) - calculate_slope(line_b.a, line_b.b))
    lines_copy[1].sort(([i, line_a], [j, line_b]) => calculate_slope(line_a.a, line_a.b) - calculate_slope(line_b.a, line_b.b))

    // Now sorting according to their intersection
    lines_copy[0].sort(([i, line_a], [j, line_b]) => line_a.intersects(h).y - line_b.intersects(h).y)
    lines_copy[1].sort(([i, line_a], [j, line_b]) => line_a.intersects(h).y - line_b.intersects(h).y)

    // Now we find the longest subsequence of slopes
    let sequence = concat(lines_copy[1], lines_copy[0]); // This list is sorted by intersection with h
    let subsequence = longest_increasing_subsequence(sequence);


    // updating information with best one
    lines.forEach(line => line.color = "red");
    subsequence.forEach(pair => lines[pair[0]].color = "green");
    document.getElementById('muLH').value = subsequence.length;
    document.getElementById("thval").value = Math.sqrt(lines.length/3);

    return subsequence;
}

function find_best_h() {
    let best_length = Infinity; let best_h = null; let best_subsequence = [];
    if (q === null) {
        click_q_random()
    }
    if (h === null) {
        h = new Line(get_random_point(canvas.width, canvas.height), get_random_point(canvas.width, canvas.height), 2);
    }

    for (let i = intersection_points.length-1; i >= 0; i--) {
        let h_lines = [new Line(q, intersection_points[i], 2), new Line(q, intersection_points[i], 2),
                       new Line(q, intersection_points[i], 2), new Line(q, intersection_points[i], 2)];

        // We create a line shifted ever so slightly in the two direction, and another one that stands in between
        // See Resources/4possibleConfig.gif
        // Having 4 lines is necessary when n = 2 and n = 3
        h_lines[0].a.x += EPSILON_ZERO;
        h_lines[0].b.x += EPSILON_ZERO;

        h_lines[1].a.x += EPSILON_ZERO;
        h_lines[1].a.x -= EPSILON_ZERO;

        h_lines[2].a.x -= EPSILON_ZERO;
        h_lines[2].a.x += EPSILON_ZERO;

        h_lines[3].a.x -= EPSILON_ZERO;
        h_lines[3].b.x -= EPSILON_ZERO;
        //Check for the 4 lines and count their region
        for (let k = 0; k < 4; k++) {
            h = h_lines[k];
            let subsequence = find_subset()
            if (subsequence.length < best_length) {
                best_subsequence = subsequence;
                best_length = best_subsequence.length;
                best_h = h;
            }
        }
    }
    if (best_h !== null) {
        h = best_h;
    }

    // updating information with best one
    lines.forEach(line => line.color = "red");
    best_subsequence.forEach(pair => lines[pair[0]].color = "green");
    document.getElementById('muLH').value = best_subsequence.length;
    document.getElementById("thval").value = Math.sqrt(lines.length/3);

    return best_subsequence;
}

function find_best_q() {
    let longest_subsequence = [];
    let current_longest_subsequence = [];
    let best_h = null;
    let best_q = null;

    for (let i = 0; i < intersection_points.length-2; i++) {
        for (let j = i+1; j < intersection_points.length-1; j++) {
            for (let k = j+1; k < intersection_points.length; k++) {
                q = get_center_of_triangle(intersection_points[i], intersection_points[j], intersection_points[k]);
                current_longest_subsequence = find_best_h();
                if (current_longest_subsequence.length > longest_subsequence.length) { // Maximizing µ for q
                    longest_subsequence = current_longest_subsequence
                    best_h = h;
                    best_q = q;
                }
            }
        }
    }
    q = best_q
    h = best_h;
    lines.forEach(line => line.color = "red");
    longest_subsequence.forEach(pair => lines[pair[0]].color = "green");

    return longest_subsequence.length
}

function count_nb_green_lines() {
    let counter = 0;
    lines.forEach(line => {if (line.color === "green") { counter += 1;}});
    return counter
}