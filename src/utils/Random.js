const randomString = (length) => {
    return (
        Math.random()
            .toString(36)
            .substring(2, length + 2) +
        Math.random()
            .toString(36)
            .substring(2, length + 2)
    );
};

export { randomString };
