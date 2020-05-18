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

const getActivationFunction = (key, prime = false) => {
    const f = {
        sigmoid: (x) => 1 / (1 + Math.exp(-x)),
        relu: (x) => Math.max(x, 0),
    };

    const p = {
        sigmoid: (x) => Math.exp(-x) / Math.pow(1 + Math.exp(-x), 2),
        relu: (x) => (x < 0 ? 0 : 1),
    };

    if (!prime) return f[key];
    else return p[key];
};

const getCostFunction = (key, prime = false) => {
    //y is what the ai predicted, yHat is the actual value
    const f = {
        mse: (y, yHat) => Math.pow(y - yHat, 2),
    };

    const p = {
        mse: (y, yHat) => 2 * (y - yHat),
    };

    if (!prime) return f[key];
    else return p[key];
};

const AI = (inputLen) => {
    let layers = [];

    const add = (size, activation) => {
        /*
            Layer Schema
            size: n,
            weights: [] with length n of arrays with length prior layer size,
            bias: random number,
            activation: name of activation function to use
        */

        let priorLen =
            layers.length === 0 ? inputLen : layers[layers.length - 1].size;

        let layer = { size, activation };
        layer.bias = Math.random();
        layer.weights = Array(size)
            .fill(0)
            .map((_) => arrayOfRandom(priorLen));

        layers.push(layer);
    };

    const train = (training, options) => {
        let { cost, epochs, lr } = {
            ...{
                cost: "mse",
                epochs: 1000,
                lr: 0.1,
            },
            ...options,
        };

        let costFunction = getCostFunction(cost);
        let costFunction_p = getCostFunction(cost, true);

        for (let e = 1; e <= epochs; e++) {
            let derivs = {
                weights: Array(layers.length)
                    .fill(0)
                    .map((_, index) => {
                        let prev = layers[index - 1]
                            ? layers[index - 1].weights
                            : training[0].input;

                        return Array(layers[index].weights.length).fill(
                            Array(prev.length).fill(0)
                        );
                    }),
                biases: Array(layers.length).fill(0),
            };

            if (e % 100 === 0) {
                console.log("Epoch " + e);
                let err = 0;
                for (const data of training) {
                    let pred = run(data.input);
                    let actual = data.output;
                    err += costFunction(pred[0], actual[0]);
                }
                console.log(err);
            }

            for (const data of training) {
                const { zs, as } = run(data.input, true);
                let prediction = as[as.length - 1];
                let actual = data.output;

                const prevd = Array(as.length).fill([]);

                for (let i = as.length - 1; i >= 0; i--) {
                    let layer = layers[i];
                    let activation_p = getActivationFunction(
                        layer.activation,
                        true
                    );

                    let aGroup = as[i];

                    for (let j = 0; j < aGroup.length; j++) {
                        let da_dz = activation_p(zs[i][j]);

                        if (i === as.length - 1) {
                            da_dz *= costFunction_p(prediction[j], actual[j]);
                        }

                        prevd[i][j] = da_dz;

                        let weights = [...layer.weights];

                        for (let k = 0; k < weights.length; k++) {
                            for (let l = 0; l < weights[k].length; l++) {
                                let prior = as[i - 1] ? as[i - 1] : data.input;

                                const dz_dwn = prior[l];
                                let da_dwn = da_dz * dz_dwn;

                                let da_db = da_dz;

                                if (as[i + 1]) {
                                    for (let n = 0; n < as[i + 1].length; n++) {
                                        const specificDcost =
                                            da_dwn *
                                            prevd[i + 1][n] *
                                            layers[i + 1].weights[n][k];

                                        derivs.weights[i][k][
                                            l
                                        ] += specificDcost;

                                        derivs.biases[i] +=
                                            da_db *
                                            prevd[i + 1][n] *
                                            layers[i + 1].weights[n][k];
                                    }
                                } else {
                                    derivs.weights[i][k][l] += da_dwn; //this da goes all the way to top due to checking for previous derivatives
                                    derivs.biases[i] += da_db;
                                }
                            }
                        }
                    }
                }
            }

            //apply calculated derivatives here
            for (let i = 0; i < derivs.weights.length; i++) {
                let layerWeights = derivs.weights[i];
                for (let j = 0; j < layerWeights.length; j++) {
                    for (let k = 0; k < layerWeights[j].length; k++) {
                        layers[i].weights[j][k] =
                            layers[i].weights[j][k] -
                            derivs.weights[i][j][k] * lr;
                    }
                }
            }

            for (let i = 0; i < derivs.biases.length; i++) {
                let d = derivs.biases[i];
                layers[i].bias = layers[i].bias - d * lr;
            }
        }
    };

    const run = (input, returnSubLayers = false) => {
        let v = [...input];
        let zs = [];
        let bs = [];
        let as = [];

        for (let i = 0; i < layers.length; i++) {
            let z = dot(v, layers[i].weights);
            zs.push(z);
            let b = apply(z, (n) => n + layers[i].bias);
            bs.push(b);
            let a = apply(b, getActivationFunction(layers[i].activation));
            as.push(a);
            v = [...a];
        }

        if (returnSubLayers) {
            return {
                zs,
                bs,
                as,
            };
        } else {
            return v;
        }
    };

    return {
        add,
        train,
        run,
    };
};

//---------------   REGRESSION  ---------------
// const AI = (state) => {
//     state.update(
//         "networkParams",
//         (() => {
//             return {
//                 w: 1,
//                 b: 1,
//             };
//         })()
//     );

//     const run = (x) => {
//         let { w, b } = state.get("networkParams");
//         return x * w + b;
//     };

//     const train = () => {
//         let epochs = 500;
//         let lr = 0.03;

//         for (let e = 1; e <= epochs; e++) {
//             let { w, b } = state.get("networkParams");
//             let wnudge = 0;
//             let bnudge = 0;

//             let points = [...state.get("points")]
//                 .sort(() => 0.5 - Math.random())
//                 .slice(0, 10);

//             for (const point of points) {
//                 let actual = point.y;
//                 let z = run(point.x);

//                 let cost = Math.pow(z - actual, 2);
//                 let dcost_dw = 2 * (z - actual) * point.x;
//                 let dcost_db = 2 * (z - actual);

//                 wnudge += dcost_dw;
//                 bnudge += dcost_db;
//             }

//             w = w - wnudge * lr;
//             b = b - bnudge * lr;
//             state.update("networkParams", { w, b });
//         }
//         console.log("done training");
//         console.log(
//             "error of " +
//                 [...state.get("points")].reduce((err, point) => {
//                     err += Math.pow(run(point.x) - point.y, 2);
//                     return err;
//                 }, 0)
//         );
//     };

//     return { run, train };
// };

export default AI;
