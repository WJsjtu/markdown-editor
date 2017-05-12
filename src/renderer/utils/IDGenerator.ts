const ALPHABET: string = '0123456789abcdef';

const IDMap: Map<string, boolean> = new Map();

const generate = (): string => {
    const serial: Array<string> = [];
    for (let i = 0; i < 36; i++) {
        serial[i] = ALPHABET.substr(Math.floor(Math.random() * 0x10), 1);
    }

    // bits 12-15 of the time_hi_and_version field to 0010
    serial[14] = '4';

    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    serial[19] = ALPHABET.substr((parseInt(serial[19], 10) & 0x3) | 0x8, 1);
    serial[8] = serial[13] = serial[18] = serial[23] = "-";
    return serial.join('');
};

export default function IDGenerator(): string {

    let result: string = generate();

    while (IDMap.has(result)) {
        result = generate();
    }

    IDMap.set(result, true);

    return result;
}