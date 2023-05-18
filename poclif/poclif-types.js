class CustomType {
    array = [];
    constructor(array) {
        this.array = array;
    }
}

const poclifTypes = {
    any:        0,
    number:     1,
    string:     2,
    boolean:    3,
    enum:       (array) => {return new CustomType(array)}
}

module.exports = poclifTypes;