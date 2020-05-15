const dot = (arr1, arr2) => {
    let toReturn = [];

    for (let i = 0; i < arr2.length; i++) {
        let n = 0;
        for (let j = 0; j < arr1.length; j++) {
            n += arr1[j] * arr2[i][j];
        }
        toReturn.push(n);
    }

    return toReturn;
};

const apply = (arr, func) => {
    return arr.map((n) => {
        return func(n);
    });
};

const arrayOfRandom = (len) => {
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.random());
    }
    return arr;
};

const sigmoid = (x) => 1 / (1 + Math.exp(-x));

const sigmoid_p = (x) => Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2);

const AI = (state) => {
    state.update(
        "networkParams",
        (() => {
            let pseudo = {};
            pseudo.weights = [
                [arrayOfRandom(2), arrayOfRandom(2), arrayOfRandom(2)],
                [arrayOfRandom(3), arrayOfRandom(3)],
            ];
            pseudo.biases = arrayOfRandom(2);
            return pseudo;
        })()
    );

    const run = (point) => {
        const params = state.get("networkParams");
        const input = [point.x, point.y];
        let layer1 = dot(input, params.weights[0]);
        layer1 = apply(layer1, (n) => n + params.biases[0]);
        layer1 = apply(layer1, sigmoid);
        let results = dot(layer1, params.weights[1]);
        results = apply(results, (n) => n + params.biases[1]);
        results = apply(results, sigmoid);
        return results;
    };

    const train = (epochs = 50, lr = 0.01) => {
        const points = state.get("points");
        const options = state.get("options");
        const params = state.get("networkParams");

        for (let epoch = 1; epoch <= epochs; epoch++) {
            if (epoch % 10 === 0) {
                console.log("Currently on epoch: " + epoch);
            }

            let point = points[Math.floor(Math.random() * points.length)];

            let input = [point.x, point.y];
            let z1s = dot(input, params.weights[0]);
            let b1s = apply(z1s, (n) => n + params.biases[0]);
            let a1s = apply(b1s, sigmoid);
            let z2s = dot(a1s, params.weights[1]);
            let b2s = apply(z2s, (n) => n + params.biases[1]);
            let a2s = apply(b2s, sigmoid);

            let predictions = a2s;
            let target_index = options.findIndex(
                (option) => option.name === point.option
            );

            let actual_values = [];
            for (let i = 0; i < predictions.length; i++) {
                actual_values.push(0);
            }
            actual_values[target_index] = 1;

            for (let i = 0; i < predictions.length; i++) {
                let cost = Math.pow(predictions[i] - actual_values[i], 2);
                console.log(cost);
                let a2 = a2s[i];
                let b2 = b2s[i];
                let z2 = z2s[i];

                let dcost_da2 = 2 * (a2s[i] - actual_values[i]);
                let da2_dz2 = sigmoid_p(z2);

                let dcost_dz2 = dcost_da2 * da2_dz2;

                let pseudo = [...params.weights];
                let weights1 = [...pseudo[0]];
                let weights2 = [...pseudo[1]];

                let bridgeIndex = i % predictions.length;

                for (let j = 0; j < weights1.length; j++) {
                    const nextNodeIndex = j;
                    const wbridge = weights2[bridgeIndex][nextNodeIndex];
                    const dz2_da1 = wbridge;

                    const z1 = z1s[nextNodeIndex];
                    const da1_dz1 = sigmoid_p(z1);

                    let dcost_dz1 = dcost_dz2 * dz2_da1 * da1_dz1;

                    for (let k = 0; k < weights1[j].length; k++) {
                        const valIndex = k % weights1[j].length;
                        const n = input[valIndex];
                        const dz1_dwn = n;
                        const dcost_dwn = dcost_dz1 * dz1_dwn;
                    }
                }
            }
        }
    };

    return { run, train };
};

export default AI;
