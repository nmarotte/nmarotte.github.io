let preview_line = null;
let preview_intersection_points = null;

function get_mouse_point() {
    return new Point(mouseX, mouseY);
}

function reset_click() {
    canvas.mouseMoved(function () {});
    canvas.mouseClicked(click_line);
}

function preview_next_line() {
    preview_line = new Line(last_click, get_mouse_point());
    preview_line.recolor();
    preview_intersection_points = preview_line.get_all_intersections();
}

function preview_h_line() {
    h = new Line(last_click, get_mouse_point(), 2);
    intersection_points.forEach(point => point.recolor());
    lines.forEach(line => line.recolor());
}

function click_next_line() {
    let line_to_add = new Line(last_click, get_mouse_point());
    add_line(line_to_add);
    preview_line = preview_intersection_points = last_click = null;

    lines.forEach(line => line.refresh_all_intersections());
    reset_click();
}

function click_line() {
    last_click = get_mouse_point();

    canvas.mouseMoved(preview_next_line);
    canvas.mouseClicked(click_next_line);
}

function click_q() {
    q = get_mouse_point();
    q.color = "blue";
    refresh_all_colors();

    reset_click();
}

function click_q_random() {
    q = get_random_point(canvas.width, canvas.height);
    q.color = "blue";

    refresh_all_colors();
}

function click_h() {
    if (last_click === null) { // first click
        h = null; // remove old h
        last_click = get_mouse_point();
        canvas.mouseMoved(preview_h_line);
    } else { // second click, we stop moving h
        last_click = null;
        reset_click();
    }
}

function drop_random_lines(n) {
    for (let i = 0; i < n; i++) {
        let a = get_random_point(canvas.width, canvas.height);
        let b = get_random_point(canvas.width, canvas.height)

        add_line(new Line(a,b));
    }
    refresh_all_colors();
}