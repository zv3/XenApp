let data = {};

const set = (name, value) => {
    data[name] = value;
};

const get = (name) => {
    if (data.hasOwnProperty(name)) {
        return data[name];
    }

    return null;
};

const has = (name) => {
    return data.hasOwnProperty(name);
};

export const objectStore = {
    set, get, has
};