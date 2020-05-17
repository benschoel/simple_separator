import State from "./state";
import AI from "./AI";

const els = {
    surface: document.querySelector("#surface"),
};

const state = State({
    points: [],
    networkParams: {},
});
const ai = AI(state);

const updateSurface = (params) => {
    let rect = els.surface.getBoundingClientRect();
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
        el.style.bottom = point.y + "px";
        el.style.left = point.x + "px";
        el.style.backgroundColor = "#f6a5ad";
        els.surface.appendChild(el);
    }
});

state.addListener("networkParams", updateSurface);
state.addListener("isShowingMarkers", () => {
    updateSurface(state.get("networkParams"));
});

els.surface.addEventListener("click", (e) => {
    let rect = els.surface.getBoundingClientRect();
    let x = e.pageX - rect.left;
    let y = rect.height - (e.pageY - rect.top);
    let points = [...state.get("points")];
    points.push({
        x,
        y,
    });
    state.update("points", points);
});

document
    .querySelector("#train-btn")
    .addEventListener("click", () => ai.train());
