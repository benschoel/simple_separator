import State from "./state";
import AI from "./AI";

const els = {
    selector: document.querySelector("#selector"),
    surface: document.querySelector("#right"),
};

const state = State({
    options: [
        {
            name: "A",
            color: "#f6a5ad",
        },
        {
            name: "B",
            color: "#a8a8fd",
        },
    ],
    selected: "",
    points: [],
    networkParams: {},
    isShowingMarkers: false,
});
const ai = AI(state);

const updateSurface = (params) => {
    let rect = els.surface.getBoundingClientRect();
    let markers = [...document.querySelectorAll(".marker")];
    markers.forEach((markerEl) => markerEl.remove());

    if (!state.get("isShowingMarkers")) return;

    const options = [...state.get("options")];
    // const markerSize = 10;
    // for (let i = 0; i < rect.width; i += markerSize) {
    //     for (let j = 0; j < rect.height; j += markerSize) {
    //         const el = document.createElement("div");
    //         el.classList.add("marker");
    //         el.style.top = j + "px";
    //         el.style.left = i + "px";
    //         el.style.height = markerSize + "px";
    //         el.style.width = markerSize + "px";

    //         let lineValue = lineFunc(i, weight, bias);
    //         let thisValue = rect.height - j;

    //         if (thisValue < lineValue) {
    //             el.style.backgroundColor = options[0].color;
    //         } else {
    //             el.style.backgroundColor = options[1].color;
    //         }

    //         els.surface.appendChild(el);
    //     }
    // }
};

// ---------- LISTENERS ----------
state.addListener("options", (options) => {
    els.selector.innerHTML = "";
    const generator = (option) => {
        return () => {
            state.update("selected", option.name);
        };
    };
    for (var i = 0; i < options.length; i++) {
        const c = document.createElement("div");
        c.innerHTML = options[i].name;
        c.classList.add("id");
        c.addEventListener("click", generator(options[i]));
        els.selector.appendChild(c);
    }
    state.update("selected", options[0].name);
});

state.addListener("selected", (selected) => {
    const options = [...state.get("options")];
    let optionEls = [...document.querySelectorAll(".id")];

    optionEls.forEach((optionEl) => {
        if (optionEl.innerHTML === selected) {
            optionEl.classList.add("selected");
            optionEl.style.backgroundColor = options.find(
                (option) => option.name === optionEl.innerHTML
            ).color;
        } else {
            optionEl.classList.remove("selected");
            optionEl.style.backgroundColor = "";
        }
    });
});

state.addListener("points", (points) => {
    const options = [...state.get("options")];
    let priorPoints = [...document.querySelectorAll(".point")];
    priorPoints.forEach((pointEl) => {
        pointEl.remove();
    });

    for (const point of points) {
        let el = document.createElement("div");
        el.innerHTML = point.option;
        el.classList.add("point");
        el.style.top = point.y * 100 + "%";
        el.style.left = point.x * 100 + "%";
        el.style.backgroundColor = options.find(
            (option) => option.name === point.option
        ).color;
        els.surface.appendChild(el);
    }
});

state.addListener("networkParams", updateSurface);
state.addListener("isShowingMarkers", () => {
    updateSurface(state.get("networkParams"));
});

els.surface.addEventListener("click", (e) => {
    let rect = els.surface.getBoundingClientRect();
    let x = (e.pageX - rect.left) / rect.width;
    let y = e.pageY / rect.height;
    let option = state.get("selected");
    let points = [...state.get("points")];
    points.push({
        x,
        y,
        option,
    });
    state.update("points", points);
});

els.selector.addEventListener("click", (e) => e.stopPropagation());

document
    .querySelector("#show-marker-checkbox")
    .addEventListener("change", (e) => {
        state.update("isShowingMarkers", e.target.checked);
    });

document
    .querySelector("#train-btn")
    .addEventListener("click", () => ai.train());
