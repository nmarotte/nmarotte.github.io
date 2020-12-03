let canvas;

let intersection_points = [];
let lines = [];

let last_click = null;
let q = null;
let q_turn = -1;
let h = null;

function setup() {
    canvas = createCanvas(document.getElementById("canvasContainer").offsetWidth, windowHeight)
    canvas.parent("canvasContainer");
    canvas.mouseClicked(click_line);

    background(200)

}

function draw() {
    background(200);

    q?.display();
    h?.display();

    lines.forEach(line => line.display());
    intersection_points.forEach(point => point.display());
    preview_line?.display(); // does nothing if preview_line is null
    preview_intersection_points?.forEach(point => point.display());
}

function reset_stroke() {
    stroke("black")
    strokeWeight(1)
}

function add_line(line) {
    let intersections = line.get_all_intersections();
    line.recolor(intersections);


    lines.push(line);
    intersection_points.push(...intersections);
}

function refresh_all_colors() {
    intersection_points.forEach(point => point.recolor());
    lines.forEach(line => line.recolor()) ;
}

function find_best_h() {
    intersection_points[0].color = "blue";
    let bestCounter = Infinity; let bestH = null;

    for (let i = intersection_points.length-1; i >= 0; i--) {
        let counters = [0,0];
        let h_lines = [new Line(q, intersection_points[i], 2), new Line(q, intersection_points[i], 2)];

        // We create a h line shifted every so slightly in the two direction
        h_lines[0].a.x += EPSILON_ZERO;
        h_lines[0].b.x += EPSILON_ZERO;

        h_lines[1].a.x -= EPSILON_ZERO;
        h_lines[1].b.x -= EPSILON_ZERO;
        for (let j = lines.length-1; j >= 0; j--) {
            const line_to_test = lines[j];
            for (const h_lines_key in h_lines) {
                if (are_in_region(q, h_lines[h_lines_key], line_to_test.points)) {
                    counters[h_lines_key] += 1;
                }
            }

        }
        for (const counters_key in counters) {
            if (counters[counters_key] < bestCounter) {
                bestCounter = counters[counters_key];
                bestH = h_lines[counters_key];
            }
        }
    }
    h = bestH;
    refresh_all_colors();

}

function count_nb_green_lines() {
    let counter = 0;
    lines.forEach(line => {if (line.color === "green") { counter += 1;}});
    return counter
}