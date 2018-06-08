"use strict";

class Genoma {

    /**
     * Constant: min length
     *
     * @readonly
     * @static
     */
    static get MIN_LENGTH() {
        return 4;
    }

    /**
     * Creates an instance of Genoma.
     */
    constructor() {

    }

    /**
     * Valid DNA.
     *
     * @param {Array} dna DNA
     * @throws {Error}
     */
    _validDna(dna) {
        if (!Array.isArray(dna)) {
            throw new Error('DNA inválido');
        }

        if (dna.length < Genoma.MIN_LENGTH) {
            throw new Error('La cantidad de secuencias y su longitud deben ser al menos ' + Genoma.MIN_LENGTH);
        }

        let len = 0;

        dna.forEach(secuencia => {
            secuencia = String(secuencia);
            let u = secuencia.replace(/[^ATCG]/, '.');

            if (u.indexOf('.') !== -1) {
                throw new Error('Las secuencias admiten únicamente los caracteres \'A\', \'T\', \'C\' y \'G\'');
            }

            if (secuencia.length < Genoma.MIN_LENGTH) {
                throw new Error('La cantidad de secuencias y su longitud deben ser al menos ' + Genoma.MIN_LENGTH);
            }

            if (len > 0 && len !== secuencia.length) {
                throw new Error('Todas las secuencias deben tener la misma longitud');
            }

            len = secuencia.length;
        });

        if (dna.length !== len) {
            throw new Error('La cantidad de secuencias deberá ser igual a la longitud de todas las secuencias');
        }

    }

    /**
     * Is mutant?
     *
     * @param {Array} dna DNA
     * @returns {Boolean} 
     * @throws {Error}
     */
    isMutant(dna) {
        this._validDna(dna);

        let length = dna.length;

        let o = length - Genoma.MIN_LENGTH;
        
        let ob = [];
        let obi = [];

        for (let u = -o; u <= o; u++) {
            if (u < 0) {
                ob.push({char: dna[0][-u], count: 0});
                obi.push({char: dna[-u][length - 1], count: 0});
            } else if (u === 0) {
                ob.push({char: dna[0][0], count: 0});
                obi.push({char: dna[0][length - 1], count: 0});
            } else {
                ob.push({char: dna[u][0], count: 0});
                obi.push({char: dna[u][length - 1], count: 0});
            }
        }

        for (let i = 0; i < length; i++) {
            let o1 = {char: dna[i][0], count: 0};
            let o2 = {char: dna[0][i], count: 0};

            for (let j = 0; j < length; j++) {
                if (o1.char === dna[i][j]) {
                    o1.count++;
                } else {
                    o1.char = dna[i][j];
                    o1.count = 1;
                }

                if (o1.count === Genoma.MIN_LENGTH) {
                    return true;
                }

                if (o2.char === dna[j][i]) {
                    o2.count++;
                } else {
                    o2.char = dna[j][i];
                    o2.count = 1;
                }

                if (o2.count === Genoma.MIN_LENGTH) {
                    return true;
                }

                if (i === j) {
                    if (i === length - 1) {
                        if (ob[o].char === dna[i][j]) {
                            ob[o].count++;
                        } else {
                            ob[o].char = dna[i][j];
                            ob[o].count = 1;
                        }

                        if (ob[o].count === Genoma.MIN_LENGTH) {
                            return true;
                        }

                        if (obi[o].char === dna[i][0]) {
                            obi[o].count++;
                        } else {
                            obi[o].char = dna[i][0];
                            obi[o].count = 1;
                        }

                        if (obi[o].count === Genoma.MIN_LENGTH) {
                            return true;
                        }
                    } else {
                        for (let u = -o; u <= o; u++) {
                            let c = u + o;
                            let odna;
                            let odnai;

                            if (u < 0) {
                                odna = dna[i][j - u];
                                odnai = dna[i][(length - 1) - (j - u)];
                            } else if (u === 0) {  
                                odna = dna[i][j];
                                odnai = dna[i][(length - 1) - j];
                            } else {
                                odna = dna[i + u][j];
                                odnai = dna[i + u][(length - 1) - j];
                            }

                            if (ob[c].char === odna) {
                                ob[c].count++;
                            } else {
                                ob[c].char = odna;
                                ob[c].count = 1;
                            }

                            if (ob[c].count === Genoma.MIN_LENGTH) {
                                return true;
                            }

                            if (obi[c].char === odnai) {
                                obi[c].count++;
                            } else {
                                obi[c].char = odnai;
                                obi[c].count = 1;
                            }

                            if (obi[c].count === Genoma.MIN_LENGTH) {
                                return true;
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

}

module.exports = Genoma;