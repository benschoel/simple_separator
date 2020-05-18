import State from "./state";
import AI from "./AI";

//and gate
let data = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
];

const state = State({});
const ai = AI(2);
ai.add(1, "relu");

document.querySelector("#train-btn").addEventListener("click", () => {
    let trainingData = data.map((dataGroup) => {
        return {
            input: dataGroup.slice(0, 2),
            output: [dataGroup[2]],
        };
    });
    ai.train(trainingData, {
        cost: "mse",
        epochs: 100000,
        lr: 0.01,
    });
});

document.querySelector("#run-btn").addEventListener("click", () => {
    for (const point of data) {
        console.log(point);
        console.log(ai.run(point.slice(0, 2)));
    }
    // let dataPoint = data[Math.floor(Math.random() * data.length)];
    // console.log(dataPoint);
    // console.log(ai.run(dataPoint.slice(0, 2)));
});
