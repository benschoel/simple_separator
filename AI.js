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
    return [...arr].map((n) => {
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

const relu = (x) => Math.max(x, 0);

const relu_p = (x) => (x < 0 ? 0 : 1);

const AI = (state) => {
    state.update(
        "networkParams",
        (() => {
            let pseudo = {};
            pseudo.weights = [
                [arrayOfRandom(3), arrayOfRandom(3), arrayOfRandom(3)],
                [arrayOfRandom(3), arrayOfRandom(3)],
            ];
            pseudo.biases = [0, 0];
            return pseudo;
        })()
    );

    const run = (point) => {
        const params = state.get("networkParams");
        const input = [point.x, point.y, point.x * point.y];
        let layer1 = dot(input, params.weights[0]);
        layer1 = apply(layer1, sigmoid);
        let results = dot(layer1, params.weights[1]);
        results = apply(results, sigmoid);

        return results;
    };

    const train = () => {
        const options = state.get("options");
        const epochs = 10000;
        const lr = 0.03;

        for (let epoch = 1; epoch <= epochs; epoch++) {
            let initialWeights = [...state.get("networkParams").weights]; // these are ONLY used to setup nudeges structure, noithign more
            let nudges = [];

            for (let i = 0; i < initialWeights.length; i++) {
                nudges[i] = [];
                for (let j = 0; j < initialWeights[i].length; j++) {
                    nudges[i][j] = [];
                    for (let k = 0; k < initialWeights[i][j].length; k++) {
                        nudges[i][j][k] = 0;
                    }
                }
            }
            initialWeights = null; //don't wanna take any chances here

            let points = state
                .get("points")
                .sort(() => 0.5 - Math.random())
                .slice(0, 25);

            for (const point of points) {
                let targetIndex = options.findIndex(
                    (option) => option.name === point.option
                );

                let weights = [...state.get("networkParams").weights];

                const input = [point.x, point.y, point.x * point.y];
                let z1s = dot(input, weights[0]);
                let a1s = apply(z1s, sigmoid);
                let z2s = dot(a1s, weights[1]);
                let a2s = apply(z2s, sigmoid);

                let actual = a2s.map((val, index) =>
                    index === targetIndex ? 1 : 0
                );

                //costs is in reference to the disparity between actual and expected output, not all points, just all outputs
                let costs = a2s.map((val, index) => {
                    return Math.pow(val - actual[index], 2);
                });

                for (let i = 0; i < costs.length; i++) {
                    let a2 = a2s[i];
                    let z2 = z2s[i];

                    let dcost_da2 = a2 - actual[i]; //why did i think this was wrong, i have no idea
                    let da2_dz2 = sigmoid_p(z2);

                    for (let j = 0; j < weights[1].length; j++) {
                        for (let k = 0; k < weights[1][j].length; k++) {
                            let c = a1s[k];
                            let dz2_dwn = c;
                            let dcost_dwn = dcost_da2 * da2_dz2 * dz2_dwn;
                            nudges[1][j][k] = nudges[1][j][k] + dcost_dwn;
                        }
                    }

                    for (let j = 0; j < weights[0].length; j++) {
                        let z1 = z1s[j];
                        let dz2_da1 = weights[1][i][j]; //weight between next node and node after that

                        for (let k = 0; k < weights[0][j].length; k++) {
                            let da1_dz1 = sigmoid_p(z1);
                            let dz1_dwn = input[k];
                            let dcost_dwn =
                                dcost_da2 *
                                da2_dz2 *
                                dz2_da1 *
                                da1_dz1 *
                                dz1_dwn;

                            nudges[0][j][k] = nudges[0][j][k] + dcost_dwn;
                        }
                    }
                }
            }

            let pseudoParams = { ...state.get("networkParams") };
            let pseudoWeights = [...pseudoParams.weights];

            pseudoWeights = pseudoWeights.map((layerGroup, i) => {
                return layerGroup.map((nodeWeights, j) => {
                    return nodeWeights.map((weight, k) => {
                        let nudge = nudges[i][j][k];

                        return weight - nudge * lr;
                    });
                });
            });

            state.update("networkParams", {
                ...pseudoParams,
                weights: pseudoWeights,
            });
        }

        console.log("done training");
    };

    return { run, train };
};

export default AI;
