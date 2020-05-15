const State = (defs) => {
    const cbs = {};
    let state = {
        ...(defs || {}),
    };

    const onStateChange = (key) => {
        if (cbs[key]) cbs[key].forEach((cb) => cb(state[key]));
    };

    return {
        get: (id) => {
            if (id) {
                return state[id];
            } else {
                return { ...state };
            }
        },
        set: (vals) => {
            state = {
                ...vals,
            };
            Object.values(cbs).forEach((cb) => cb(state));
        },
        update: (key, val) => {
            state = {
                ...state,
                [key]: val,
            };
            onStateChange(key);
        },
        addListener: (key, cb) => {
            if (!cbs[key]) cbs[key] = [];
            cbs[key].push(cb);
            onStateChange(key);
        },
    };
};

export default State;
