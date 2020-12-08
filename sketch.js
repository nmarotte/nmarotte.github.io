let canvas;

let intersection_points = [];
let lines = [];

let last_click = null;
let q = null;
let h = null;

let text_on_canvas = lines.length + " lines. µ = 0"

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
    intersection_points.forEach(point => point.display());
    preview_line?.display(); // does nothing if preview_line is null
    preview_intersection_points?.forEach(point => point.display());


    text(text_on_canvas, 10,10, 50,50);
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
}

function refresh_all_colors() {
    intersection_points.forEach(point => point.recolor());
    lines.forEach(line => line.recolor()) ;
}

function find_best_h() {
    let bestCounter = Infinity; let bestH = null;

    for (let i = intersection_points.length-1; i >= 0; i--) {
        let counters = [0,0,0,0];
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

        for (let j = lines.length-1; j >= 0; j--) {
            const line_to_test = lines[j]

            //Check for the 4 lines and count their region
            for (let k = 0; k < 4; k++) {
                if (are_in_region(q, h_lines[k], line_to_test.points)) {
                    counters[k] += 1;
                }
            }

        }
        // Updating the counters with the minimal value and line
        for (let k = 0; k < 4; k++) {
            if (counters[k] < bestCounter) {
                bestCounter = counters[k];
                bestH = h_lines[k];
            }
        }
    }
    text_on_canvas = lines.length + " lines. µ = " + bestCounter;
    h = bestH;
    refresh_all_colors();

}

function count_nb_green_lines() {
    let counter = 0;
    lines.forEach(line => {if (line.color === "green") { counter += 1;}});
    return counter
}