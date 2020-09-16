import {main as getCategorie} from "../src/functions/getCategorie";
import {expect} from "chai";
import * as categorie from "../resources/data/categorie.json";
import {CategoriaRepository} from "../src/repositories/CategoriaRepository";

let event, response, expectedResponse;
describe('Categoria', async () => {
    it('Controllo lista categorie aggioranta', async () => {
        let repo = new CategoriaRepository();
        await repo.aggiornaCategorie(categorie);
        event = {
            "pathParameters": {},
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": "LUCAPIRRONE"
                }
            }
        };
        response = await getCategorie(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: categorie,
        };
        expect(response.body).to.have.deep.members(expectedResponse.body);
    });
});
