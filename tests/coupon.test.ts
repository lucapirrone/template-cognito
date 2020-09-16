import {expect} from 'chai';

import {main as addCoupon} from "../src/functions/addCoupon";
import {main as editCoupon} from "../src/functions/editCoupon";
import {main as getCoupon} from "../src/functions/getCoupon";
import {main as getCoupons} from "../src/functions/getCoupons";
import {main as deleteCoupon} from "../src/functions/deleteCoupon";
import {BasicCoupon as BasicCouponAPI} from "../src/interfaces/models/basicCoupon";
import {Societa as SocietaAPI} from "../src/interfaces/models/societa";
import {Categoria as CategoriaAPI} from "../src/interfaces/models/categoria";

let response;
let event, expectedResponse;

let lucapirrone = {
    userCognitoId: "LUCAPIRRONEcognitoId098124",
    coupons: []
};
let nicolacampanile = {
    userCognitoId: "NICCAMPANILEidcognito1236",
    coupons: []
};


/*
Aggiungi lucapirrone.coupon[0] di carrefour 10% categoria supermercato
Aggiungi nicolacampanile.coupon[0] di carrefour categoria supermercato
Aggiungi lucapirrone.coupon[1] di carrefour 20€ categoria supermercato
Aggiungi lucapirrone.coupon[2] di coop 15% categoria supermercato
Aggiungi lucapirrone.coupon[3] di eni 40€ categoria benzina

Modifica lucapirrone.coupon[3] a q8 50€ categoria carburante con 2 parametri aggiuntivi
Modifica non autorizzata nicolacampanile.coupon[0]
Modifica coupon non esistente

Lettura lucapirrone.coupon[1]
Lettura non autorizzata lucapirrone.coupon[2]
Lettura coupon non esistnete

Lettura coupons di lucapirrone
Lettura coupons di nicolacampanile

Eliminazione non autorizzata di lucapirrone.coupon[1]
Eliminazione coupon non esistente
Eliminazione di lucapirrone.coupon[0]
Eliminazione di lucapirrone.coupon[1]
Eliminazione di lucapirrone.coupon[2]
Eliminazione di lucapirrone.coupon[3]
Eliminazione di nicolacampanile.coupon[0]
 */

describe('Coupon', async () => {
    describe('Aggiunta Coupon', async () => {
        it('Aggiungi lucapirrone.coupon[0] di carrefour 10% categoria supermercato', async () => {
            let societa: SocietaAPI = {
                nome: "Carrefour Italia",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Supermercato"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto cliente",
                tipo: "alfanumerico",
                codice: "A4CD8D77S9X990V9",
                importo: 10,
                valuta: "%",
                scadenza: "15/06/2022",
            };

            event = {
                "pathParameters": {},
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await addCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...body,
                    dataCreazione: response.body.dataCreazione,
                    couponId: response.body.couponId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.push(expectedResponse.body);
        });
        it('Aggiungi nicolacampanile.coupon[0] di carrefour categoria supermercato', async () => {
            let societa: SocietaAPI = {
                nome: "Carrefour Italia",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Supermercato"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto cliente",
                tipo: "barcode",
                codice: "23523wfasaf",
                importo: 30,
                valuta: "€"
            };

            event = {
                "pathParameters": {},
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await addCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...body,
                    dataCreazione: response.body.dataCreazione,
                    couponId: response.body.couponId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            nicolacampanile.coupons.push(expectedResponse.body);
        });
        it('Aggiungi lucapirrone.coupon[1] di carrefour 20€ categoria supermercato', async () => {
            let societa: SocietaAPI = {
                nome: "Carrefour Italia",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Supermercato"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto cliente",
                tipo: "qrcode",
                codice: "asd23435",
                importo: 20,
                sitoWeb: "carrefour.it",
                valuta: "€"
            };

            event = {
                "pathParameters": {},
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await addCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...body,
                    dataCreazione: response.body.dataCreazione,
                    couponId: response.body.couponId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.push(expectedResponse.body);
        });
        it('Aggiungi lucapirrone.coupon[2] di coop 15% categoria supermercato', async () => {
            let societa: SocietaAPI = {
                nome: "COOP Roma",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Supermercato"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto cliente",
                note: "Lo devo usare lunedi pomeriggio",
                tipo: "qrcode",
                codice: "789456321",
                importo: 15,
                valuta: "%"
            };

            event = {
                "pathParameters": {},
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await addCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...body,
                    dataCreazione: response.body.dataCreazione,
                    couponId: response.body.couponId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.push(expectedResponse.body);
        });
        it('Aggiungi lucapirrone.coupon[3] di eni 40€ categoria benzina', async () => {
            let societa: SocietaAPI = {
                nome: "Eni",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Benzina"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto gpl",
                note: "Per gpl",
                tipo: "qrcode",
                codice: "5DG17",
                importo: 40,
                valuta: "€"
            };

            event = {
                "pathParameters": {},
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await addCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...body,
                    dataCreazione: response.body.dataCreazione,
                    couponId: response.body.couponId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.push(expectedResponse.body);
        });
    });
    describe('Modifica Coupon', async () => {
        it('Modifica lucapirrone.coupon[3] a q8 50€ categoria carburante con 2 parametri aggiuntivi', async () => {
            let societa: SocietaAPI = {
                nome: "Q8",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Carburante"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto gpl",
                note: "Per gpl",
                tipo: "barcode",
                codice: "5DG17",
                importo: 50,
                valuta: "€",
                parametri: [
                    {
                        key: "Targa",
                        value: "ET677KH"
                    },
                    {
                        key: "Benzinaio",
                        value: "Via Casilina 2548f"
                    }
                ]
            };

            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[3].couponId
                },
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await editCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {
                    ...lucapirrone.coupons[3],
                    ...body,
                    couponId: response.body.couponId
                },
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons[3] = expectedResponse.body;
        });
        it('Modifica non autorizzata nicolacampanile.coupon[0]', async () => {
            let societa: SocietaAPI = {
                nome: "Q8",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Carburante"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto gpl",
                note: "Per gpl",
                tipo: "barcode",
                codice: "5DG17",
                importo: 50,
                valuta: "€",
                parametri: [
                    {
                        key: "Targa",
                        value: "ET677KH"
                    },
                    {
                        key: "Benzinaio",
                        value: "Via Casilina 2548f"
                    }
                ]
            };

            event = {
                "pathParameters": {
                    couponId: nicolacampanile.coupons[0].couponId
                },
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await editCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Modifica coupon non esistente', async () => {
            let societa: SocietaAPI = {
                nome: "Q8",
                logo: "logo",
                colore: "912839"
            };
            let categoria: CategoriaAPI = {
                nome: "Carburante"
            };
            let body: BasicCouponAPI = {
                societa: societa,
                categoria: categoria,
                descrizione: "Buono sconto gpl",
                note: "Per gpl",
                tipo: "barcode",
                codice: "5DG17",
                importo: 50,
                valuta: "€",
                parametri: [
                    {
                        key: "Targa",
                        value: "ET677KH"
                    },
                    {
                        key: "Benzinaio",
                        value: "Via Casilina 2548f"
                    }
                ]
            };

            event = {
                "pathParameters": {
                    couponId: "5f0e2fc539f64b3c94e1baf8"
                },
                "body": {
                    ...body
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await editCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
        });
    });
    describe('Lettura Coupon/Coupons', async () => {
        it('Lettura lucapirrone.coupon[1]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[1].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: lucapirrone.coupons[1],
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Lettura non autorizzata lucapirrone.coupon[2]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[2].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await getCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Lettura coupon non esistente', async () => {
            event = {
                "pathParameters": {
                    couponId: "5f0e2fc539f64b3c94e1baf8"
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
        });

        it('Lettura coupons di lucapirrone', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: lucapirrone.coupons,
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Lettura coupons di nicolacampanile', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: nicolacampanile.coupons,
            };
            expect(response).to.deep.equal(expectedResponse);
        });
    });
    describe('Ricerca Coupon', async () => {
        it('Ricerca coupons carrefour di lucapirrone', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "query": {
                    query: "carrefour"
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: [
                    lucapirrone.coupons[0],
                    lucapirrone.coupons[1]
                ],
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Ricerca coupons supermercato di lucapirrone', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "query": {
                    query: "supermercato"
                },
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: [
                    lucapirrone.coupons[0],
                    lucapirrone.coupons[1],
                    lucapirrone.coupons[2]
                ],
            };
            expect(response).to.deep.equal(expectedResponse);
        });
    });
    describe('Eliminazione Coupon e Lettura', async () => {
        it('Eliminazione non autorizzata di lucapirrone.coupon[1]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[1].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Eliminazione coupon non esistente', async () => {
            event = {
                "pathParameters": {
                    couponId: "5f0e2fc539f64b3c94e1baf8"
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
        });

        it('Eliminazione di lucapirrone.coupon[3]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[3].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.splice(3, 1);
        });
        it('Eliminazione di lucapirrone.coupon[2]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[2].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.splice(2, 1);
        });

        it('Lettura coupons di lucapirrone', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: lucapirrone.coupons,
            };
            expect(response).to.deep.equal(expectedResponse);
        });

        it('Eliminazione di lucapirrone.coupon[1]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[1].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.splice(1, 1);
        });
        it('Eliminazione di lucapirrone.coupon[0]', async () => {
            event = {
                "pathParameters": {
                    couponId: lucapirrone.coupons[0].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
            lucapirrone.coupons.splice(0, 1);
        });
        it('Eliminazione di nicolacampanile.coupon[0]', async () => {
            event = {
                "pathParameters": {
                    couponId: nicolacampanile.coupons[0].couponId
                },
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await deleteCoupon(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: {},
            };
            expect(response).to.deep.equal(expectedResponse);
            nicolacampanile.coupons.splice(0, 1);
        });

        it('Lettura coupons di lucapirrone', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": lucapirrone.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: lucapirrone.coupons,
            };
            expect(response).to.deep.equal(expectedResponse);
        });
        it('Lettura coupons di nicolacampanile', async () => {
            event = {
                "pathParameters": {},
                "body": {},
                "requestContext": {
                    "identity": {
                        "cognitoIdentityId": nicolacampanile.userCognitoId
                    }
                }
            };
            response = await getCoupons(event);
            response.body = JSON.parse(response.body);
            expectedResponse = {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: nicolacampanile.coupons,
            };
            expect(response).to.deep.equal(expectedResponse);
        });
    });
});
