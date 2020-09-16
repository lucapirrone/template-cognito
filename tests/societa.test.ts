import {main as getSocieta} from "../src/functions/getSocieta";
import {expect} from "chai";
import * as societa from "../resources/data/societa.json";
import {SocietaRepository} from "../src/repositories/SocietaRepository";

let event, response, expectedResponse;
describe('Societa', async () => {
    it('Controllo lista società aggioranta', async () => {
        let repo = new SocietaRepository();
        await repo.aggiornaSocieta(societa);

        event = {
            "pathParameters": {},
            "body": {},
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": "LUCAPIRRONE"
                }
            }
        };
        response = await getSocieta(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: societa,
        };
        expect(response.body).to.have.deep.members(expectedResponse.body);
    });
});
