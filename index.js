const training_data = [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
];

let weights = [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
];
let biases = [Math.random(), Math.random()];

let sigmoid = (x) => 1 / (1 + Math.exp(-x));

let sigmoid_p = (x) => Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2);

const train = () => {
    let lr = 0.1;
    let epochs = 50000;

    for (let e = 0; e < epochs; e++) {
        if (e % 100 === 0) {
            let err = 0;
            for (const point of training_data) {
                let [a, b] = point.slice(0, 2);
                let expected = point[2];
                let z1 = a * weights[0] + b * weights[1] + biases[0];
                let z2 = a * weights[2] + b * weights[3] + biases[0];
                let z1_a = sigmoid(z1);
                let z2_a = sigmoid(z2);
                let z3 = z1_a * weights[4] + z2_a * weights[5] + biases[1];
                let z3_a = sigmoid(z3);

                let cost = Math.pow(z3_a - expected, 2) / 2;
                err += cost;
            }
            console.log(err);
        }

        for (const point of training_data) {
            let [a, b] = point.slice(0, 2);
            let expected = point[2];

            let z1 = a * weights[0] + b * weights[1] + biases[0];
            let z2 = a * weights[2] + b * weights[3] + biases[0];
            let z1_a = sigmoid(z1);
            let z2_a = sigmoid(z2);
            let z3 = z1_a * weights[4] + z2_a * weights[5] + biases[1];
            let z3_a = sigmoid(z3);

            let cost = Math.pow(z3_a - expected, 2) / 2;

            let dcost_dz3a = z3_a - expected;
            let dz3a_dz3 = sigmoid_p(z3);

            // ---------- last layer ----------
            let dz3_dw4 = z1_a;
            let dz3_dw5 = z2_a;
            let dz3_db1 = 1;

            // ---------- first layer ----------
            let dz3_dz1a = weights[4];
            let dz3_dz2a = weights[5];

            let dz1a_dz1 = sigmoid_p(z1);
            let dz2a_dz2 = sigmoid_p(z2);

            let dz1_dw0 = a;
            let dz1_dw1 = b;
            let dz2_dw2 = a;
            let dz2_dw3 = b;
            let dz1_db0 = 1;
            let dz2_db0 = 1;

            //final last layer
            let dcost_dz3 = dcost_dz3a * dz3a_dz3;

            let dcost_dw4 = dcost_dz3 * dz3_dw4;
            let dcost_dw5 = dcost_dz3 * dz3_dw5;
            let dcost_db1 = dcost_dz3 * dz3_db1;

            //final first layer
            const dcost_dz1 = dcost_dz3 * dz3_dz1a * dz1a_dz1;
            const dcost_dz2 = dcost_dz3 * dz3_dz2a * dz2a_dz2;

            let dcost_dw0 = dcost_dz1 * dz1_dw0;
            let dcost_dw1 = dcost_dz1 * dz1_dw1;
            let dcost_dw2 = dcost_dz2 * dz2_dw2;
            let dcost_dw3 = dcost_dz2 * dz2_dw3;
            let dcost_db0 = dcost_dz1 * dz1_db0 + dcost_dz2 * dz2_db0;

            // biases[0] -= dcost_db0 * lr;
            biases[1] -= dcost_db1 * lr;
            weights[0] -= dcost_dw0 * lr;
            weights[1] -= dcost_dw1 * lr;
            weights[2] -= dcost_dw2 * lr;
            weights[3] -= dcost_dw3 * lr;
            weights[4] -= dcost_dw4 * lr;
            weights[5] -= dcost_dw5 * lr;
        }
    }

    for (const point of training_data) {
        let [a, b] = point.slice(0, 2);
        let expected = point[2];

        let z1 = a * weights[0] + b * weights[1] + biases[0];
        let z2 = a * weights[2] + b * weights[3] + biases[0];
        let z1_a = sigmoid(z1);
        let z2_a = sigmoid(z2);
        let z3 = z1_a * weights[4] + z2_a * weights[5] + biases[1];
        let z3_a = sigmoid(z3);

        console.log("Point: " + a + ", " + b);
        console.log("Expected: " + expected + ". Got " + z3_a);
    }

    console.log(weights);
    console.log(biases);
};

document.querySelector("#train-btn").addEventListener("click", () => {
    document.querySelector("#train-btn").style.display = "none";
    document.querySelector("#model").style.display = "block";
    train();
});
