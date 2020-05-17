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
            return {
                w: 1,
                b: 1,
            };
        })()
    );

    const run = (x) => {
        let { w, b } = state.get("networkParams");
        return x * w + b;
    };

    const train = () => {
        let epochs = 500;
        let lr = 0.03;

        for (let e = 1; e <= epochs; e++) {
            let { w, b } = state.get("networkParams");
            let wnudge = 0;
            let bnudge = 0;

            let points = [...state.get("points")]
                .sort(() => 0.5 - Math.random())
                .slice(0, 10);

            for (const point of points) {
                let actual = point.y;
                let z = run(point.x);

                let cost = Math.pow(z - actual, 2);
                let dcost_dw = 2 * (z - actual) * point.x;
                let dcost_db = 2 * (z - actual);

                wnudge += dcost_dw;
                bnudge += dcost_db;
            }

            w = w - wnudge * lr;
            b = b - bnudge * lr;
            state.update("networkParams", { w, b });
        }
        console.log("done training");
        console.log(
            "error of " +
                [...state.get("points")].reduce((err, point) => {
                    err += Math.pow(run(point.x) - point.y, 2);
                    return err;
                }, 0)
        );
    };

    return { run, train };
};

export default AI;
