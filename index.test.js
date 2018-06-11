'use strict';

// npm test

var chai = require('chai');
chai.config.includeStack = true;
var expect = chai.expect;
var request = require('request');

const PORT = 80;
const URL = `http://localhost:${PORT}`;

before(function () {
    // Se ejecuta antes de todas las pruebas del bloque
    console.log(`Comenzamos con las pruebas...\n`);
});

after(function () {
    // Se ejecuta después de todas las pruebas del bloque
    console.warn('Pruebas finalizadas!');
});

beforeEach(function () {
    // Se ejecuta antes de cada prueba del bloque
});

afterEach( ()=>  {
    // Se ejecuta después de cada prueba del bloque
});

describe('Status and content',  ()=>  {
    describe('GET /',  ()=>  {
        it('returns status 200',  (done) => {
            request(URL + '/',  (error, response, body) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('returns content: \'Mercado Libre | XMen DNA detector!\'', (done) => {
            request(URL + '/', (error, response, body) => {
                expect(body).to.equal('Mercado Libre | XMen DNA detector!');
                done();
            });
        });
    });

    describe('POST /mutant/', () => {
        const options = {
            uri: URL + '/mutant/',
            method: 'POST',
            json: true,
            body: {}
        };

        const examples = [{
                dna: ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'],
                statusCode: 200,
                message: 'Es un mutante'
            },
            {
                dna: ['ATGC', 'ATGC', 'ATGC', 'GCTA'],
                statusCode: 403,
                message: 'No es un mutante'
            },
            {
                dna: ['ATGC', 'ATGC', 'ATGC', 'GCTA', 'GCTA'],
                statusCode: 403,
                message: 'La cantidad de secuencias deberá ser igual a la longitud de todas las secuencias'
            },
            {
                dna: ['ATGC', 'ATGC', 'ATGC', 'GCTAA'],
                statusCode: 403,
                message: 'Todas las secuencias deben tener la misma longitud'
            },
            {
                dna: ['1TGC', 'ATGC', 'ATGC', 'GCTA'],
                statusCode: 403,
                message: 'Las secuencias admiten únicamente los caracteres \'A\', \'T\', \'C\' y \'G\''
            },
            {
                dna: ['ATGCG', 'AAGTG', 'ATATG', 'AGACG', 'CACCT'],
                statusCode: 200,
                message: 'Es un mutante'
            }
        ];

        for (var index = 0; index < examples.length; index += 1) (function(example, index) {
            context(`Example (${index + 1}): ${JSON.stringify(example.dna)}`, () => {
                it(`returns status ${example.statusCode}`,  (done)=>  {  
                    var o = options;
                    o.body.dna = example.dna;
                    
                    request(o,  (error, response, body) => {
                        expect(response.statusCode).to.equal(example.statusCode);
                        done();
                    });
                });

                it(`returns content: ${example.message}`,  (done)=>  {
                    var o = options;
                o.body.dna = example.dna;

                    request(o,  (error, response, body) => {
                        expect(body).to.equal(example.message);
                        done();
                    });
                });
            });
          })(examples[index], index);
    });
});