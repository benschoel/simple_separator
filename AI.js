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

    const run = (point) => {};

    const train = () => {};

    return { run, train };
};

export default AI;
