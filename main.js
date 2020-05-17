import State from "./state";
import AI from "./AI";

const els = {
    surface: document.querySelector("#surface"),
};

const state = State({
    points: [],
});
const ai = AI(state);

const updateSurface = (params) => {
    document.querySelectorAll(".marker").forEach((marker) => marker.remove());
    let rect = els.surface.getBoundingClientRect();

    for (let i = 0; i < rect.width; i += 2) {
        let m = document.createElement("div");
        m.classList.add("marker");
        m.style.position = "absolute";
        m.style.left = i + "px";
        m.style.bottom = ai.run(i / rect.width) * 100 + "%";
        m.style.height = "2px";
        m.style.width = "2px";
        m.style.backgroundColor = "dodgerblue";
        els.surface.appendChild(m);
    }
};

// ---------- LISTENERS ----------

state.addListener("points", (points) => {
    let priorPoints = [...document.querySelectorAll(".point")];
    priorPoints.forEach((pointEl) => {
        pointEl.remove();
    });

    for (const point of points) {
        let el = document.createElement("div");
        el.classList.add("point");
        el.style.bottom = point.y * 100 + "%";
        el.style.left = point.x * 100 + "%";
        el.style.backgroundColor = "#f6a5ad";
        els.surface.appendChild(el);
    }
});

state.addListener("networkParams", updateSurface);

els.surface.addEventListener("click", (e) => {
    let rect = els.surface.getBoundingClientRect();
    let x = e.pageX - rect.left;
    let y = rect.height - (e.pageY - rect.top);
    let points = [...state.get("points")];
    points.push({
        x: x / rect.width,
        y: y / rect.height,
    });
    state.update("points", points);
});

document.querySelector("#train-btn").addEventListener("click", () => {
    ai.train();
});
