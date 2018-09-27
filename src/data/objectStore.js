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

export const objectStore = {
    set, get
};