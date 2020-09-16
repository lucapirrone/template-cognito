var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._preSignUp = exports.preSignUp = exports.getClient = exports.createClient = exports.verifyUserAttribute = exports.updateUser = exports.getUser = exports.listUser = exports.createUser = exports.deleteResourceServer = exports.createResourceServer = exports.updateUserPoolClient = exports.deleteUserPoolDomain = exports.createUserPoolDomain = exports.updateUserPool = exports.createUserPool = exports.cognito = void 0;
const aws_sdk_1 = require("aws-sdk");
const crypto_1 = require("crypto");
const apig_1 = require("./apig");
const env_1 = require("./env");
exports.cognito = new aws_sdk_1.CognitoIdentityServiceProvider();
exports.createUserPool = (request, context, callback) => {
    Promise.resolve()
        .then(() => exports.cognito.createUserPool(JSON.parse(request)).promise())
        .then(data => data.UserPool.Id)
        .then(id => callback(null, {
        Id: id,
        Arn: getUserPoolArn(id),
    }))
        .catch(callback);
};
const getUserPoolArn = (userPoolId) => [
    'arn', 'aws', 'cognito-idp', process.env['AWS_REGION'],
    process.env[env_1.envNames.accountId], `userpool/${userPoolId}`
].join(':');
exports.updateUserPool = (request, context, callback) => {
    Promise.resolve()
        .then(() => {
        const config = JSON.parse(request.ResourceProperties.Config);
        delete config.PoolName;
        delete config.Schema;
        delete config.AliasAttributes;
        delete config.UsernameAttributes;
        config.UserPoolId = request.PhysicalResourceId;
        return exports.cognito.updateUserPool(config).promise();
    })
        .then(() => callback(null, {
        Arn: getUserPoolArn(request.PhysicalResourceId),
    }))
        .catch(callback);
};
;
exports.createUserPoolDomain = (request, context, callback) => {
    Promise.resolve()
        .then(() => getDomain(request))
        .then(domain => exports.cognito.createUserPoolDomain(domain).promise()
        .then(() => callback(null, domain)))
        .catch(callback);
};
const getDomain = (request) => ({
    Domain: request.Domain.replace(/\./g, '-'),
    UserPoolId: request.UserPoolId,
});
exports.deleteUserPoolDomain = (request, context, callback) => {
    Promise.resolve()
        .then(() => getDomain(request))
        .then(domain => exports.cognito.deleteUserPoolDomain(domain).promise())
        .then(() => callback())
        .catch(callback);
};
exports.updateUserPoolClient = (request, context, callback) => {
    Promise.resolve()
        .then(() => JSON.parse(request))
        .then(request => exports.cognito.updateUserPoolClient(request).promise())
        .then(() => callback())
        .catch(callback);
};
exports.createResourceServer = (request, context, callback) => {
    Promise.resolve()
        .then(() => exports.cognito.createResourceServer({
        UserPoolId: request.UserPoolId,
        Identifier: request.Identifier,
        Name: request.Identifier,
        Scopes: [{
                ScopeName: 'invoke',
                ScopeDescription: 'Invoke ' + request.Identifier,
            }],
    }).promise())
        .then(() => callback(null, {
        Scope: `${request.Identifier}/invoke`,
    }))
        .catch(callback);
};
exports.deleteResourceServer = (request, context, callback) => {
    Promise.resolve()
        .then(() => exports.cognito.deleteResourceServer({
        UserPoolId: request.UserPoolId,
        Identifier: request.Identifier,
    }).promise())
        .then(() => callback())
        .catch(callback);
};
exports.createUser = (request, context, callback) => {
    apig_1.validate(request, 'POST', '/users')
        .then(() => {
        const tempPass = generatePassword();
        const newPass = generatePassword();
        return adminCreateUser(request.body.email, tempPass, request.body.name)
            .then(data => data.User.Username)
            .then(userId => adminInitiateAuth(userId, tempPass)
            .then(data => adminRespondToAuthChallenge(userId, newPass, data.Session))
            .then(() => apig_1.respond(callback, request, {
            id: userId,
            email: request.body.email,
            name: request.body.name,
        })));
    })
        .catch(err => {
        if (err.code === 'UsernameExistsException') {
            err = new apig_1.ApiError('Conflict', ['User with this email already exists'], 409);
        }
        apig_1.respondWithError(callback, request, err);
    });
};
const generatePassword = () => {
    return Buffer.alloc(256).map(() => {
        while (true) {
            const char = 0x21 + (crypto_1.randomBytes(1)[0] & 0x7f);
            if (char < 0x7f && char !== 0x3c && char !== 0x3e && char !== 0x26) {
                return char;
            }
        }
    }).toString();
};
const adminCreateUser = (email, password, name) => {
    return exports.cognito.adminCreateUser({
        UserPoolId: process.env[env_1.envNames.userPoolId],
        Username: email,
        TemporaryPassword: password,
        UserAttributes: [{
                Name: 'email',
                Value: email,
            }, {
                Name: 'email_verified',
                Value: 'true',
            }, {
                Name: 'name',
                Value: name,
            }],
    }).promise();
};
const adminInitiateAuth = (username, password) => {
    return exports.cognito.adminInitiateAuth({
        UserPoolId: process.env[env_1.envNames.userPoolId],
        ClientId: process.env[env_1.envNames.authClientId],
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    }).promise();
};
const adminRespondToAuthChallenge = (username, password, session) => {
    return exports.cognito.adminRespondToAuthChallenge({
        UserPoolId: process.env[env_1.envNames.userPoolId],
        ClientId: process.env[env_1.envNames.authClientId],
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
            USERNAME: username,
            NEW_PASSWORD: password,
        },
        Session: session,
    }).promise();
};
exports.listUser = (request, context, callback) => {
    apig_1.validate(request, 'GET', '/users')
        .then(() => getUserByAttribute('email', request.queryStringParameters.email))
        .then(user => apig_1.respond(callback, request, {
        id: user.Username,
        email: getUserAttribute(user.Attributes, 'email'),
        name: getUserAttribute(user.Attributes, 'name'),
    }))
        .catch(err => apig_1.respondWithError(callback, request, err));
};
const getUserAttribute = (attributes, attributeName) => attributes.filter(attribute => attribute.Name === attributeName)[0].Value;
exports.getUser = (request, context, callback) => {
    apig_1.validate(request, 'GET', '/users/{user_id}')
        .then(() => exports.cognito.adminGetUser({
        UserPoolId: process.env[env_1.envNames.userPoolId],
        Username: request.pathParameters.user_id,
    }).promise())
        .then(user => apig_1.respond(callback, request, {
        id: user.Username,
        email: getUserAttribute(user.UserAttributes, 'email'),
        name: getUserAttribute(user.UserAttributes, 'name'),
    }))
        .catch(err => {
        if (err.code === 'UserNotFoundException') {
            err = new apig_1.ApiError('Not Found', ['User not found'], 404);
        }
        apig_1.respondWithError(callback, request, err);
    });
};
exports.updateUser = (request, context, callback) => {
    apig_1.validate(request, 'PATCH', '/users/{user_id}')
        .then(() => request.requestContext.authorizer.accessToken)
        .then(accessToken => updateUserAttributes(accessToken, request.body)
        .then(data => (!data.CodeDeliveryDetailsList && request.body.email) ?
        getAttributeVerificationCode(accessToken, 'email') : {}))
        .then(() => apig_1.respond(callback, request, Object.assign({
        id: request.pathParameters.user_id,
    }, request.body)))
        .catch(err => {
        if (err.code === 'AliasExistsException') {
            err = new apig_1.ApiError('Conflict', ['User with this email already exists'], 409);
        }
        else if (err.code === 'UserNotFoundException') {
            err = new apig_1.ApiError('Not Found', ['User not found'], 404);
        }
        apig_1.respondWithError(callback, request, err);
    });
};
const updateUserAttributes = (accessToken, attributes) => {
    return exports.cognito.updateUserAttributes({
        AccessToken: accessToken,
        UserAttributes: Object.keys(attributes).map(attribute => ({
            Name: attribute,
            Value: attributes[attribute],
        })),
    }).promise();
};
const getAttributeVerificationCode = (accessToken, attribute) => {
    return exports.cognito.getUserAttributeVerificationCode({
        AccessToken: accessToken,
        AttributeName: attribute,
    }).promise();
};
exports.verifyUserAttribute = (request, context, callback) => {
    apig_1.validate(request, 'POST', '/users/{user_id}/verification')
        .then(() => exports.cognito.verifyUserAttribute({
        AccessToken: request.requestContext.authorizer.accessToken,
        AttributeName: request.body.attribute,
        Code: request.body.code,
    }).promise())
        .then(() => apig_1.respond(callback, request))
        .catch(err => {
        if (err.code === 'CodeMismatchException') {
            err = new apig_1.ApiError('Forbidden', ["Provided code doesn't match the expected value"], 403);
        }
        else if (err.code === 'ExpiredCodeException') {
            err = new apig_1.ApiError('Forbidden', ["Provided code has expired"], 403);
        }
        else if (err.code === 'UserNotFoundException') {
            err = new apig_1.ApiError('Not Found', ["User not found"], 404);
        }
        apig_1.respondWithError(callback, request, err);
    });
};
exports.createClient = (request, context, callback) => {
    apig_1.validate(request, 'POST', '/clients')
        .then(() => createUserPoolClient(request.body.email, request.body.name))
        .then(data => data.UserPoolClient)
        .then(client => apig_1.respond(callback, request, {
        id: client.ClientId,
        secret: client.ClientSecret,
        email: request.body.email,
        name: request.body.name,
    }))
        .catch(err => {
        if (err.code === 'LimitExceededException') {
            err = new apig_1.ApiError('Too Many Requests', [
                'Exceeded the maximum number of clients per user pool. ' +
                    'Please contact your system administrator to increase this limit.',
            ], 429);
        }
        apig_1.respondWithError(callback, request, err);
    });
};
const createUserPoolClient = (email, name) => {
    return exports.cognito.createUserPoolClient({
        UserPoolId: process.env[env_1.envNames.userPoolId],
        ClientName: `${email}, ${name}`,
        AllowedOAuthFlowsUserPoolClient: true,
        AllowedOAuthFlows: ['client_credentials'],
        AllowedOAuthScopes: [`${process.env[env_1.envNames.apiDomain]}/invoke`],
        GenerateSecret: true,
    }).promise();
};
exports.getClient = (request, context, callback) => {
    apig_1.validate(request, 'GET', '/clients/{client_id}')
        .then(() => describeUserPoolClient(request.pathParameters.client_id))
        .then(data => data.UserPoolClient)
        .then(client => {
        if (!/, /.test(client.ClientName)) {
            throw new apig_1.ApiError('Not Found', ['Client not found'], 404);
        }
        apig_1.respond(callback, request, {
            id: request.pathParameters.client_id,
            email: client.ClientName.split(/, /)[0],
            name: client.ClientName.split(/, (.+)/)[1],
        });
    })
        .catch(err => {
        if (err.code === 'ResourceNotFoundException') {
            err = new apig_1.ApiError('Not Found', ['Client not found'], 404);
        }
        apig_1.respondWithError(callback, request, err);
    });
};
const describeUserPoolClient = (clientId) => {
    return exports.cognito.describeUserPoolClient({
        UserPoolId: process.env[env_1.envNames.userPoolId],
        ClientId: clientId,
    }).promise();
};
exports.preSignUp = (newUser, context, callback) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (newUser.request.userAttributes.hasOwnProperty("email")) {
            console.log("Richiesta di registrazione per: ", newUser.request.userAttributes.email);
            let existingUser = yield getUserByAttribute('email', newUser.request.userAttributes.email);
            if (existingUser) {
                callback("EmailAlreadyExists");
                throw new apig_1.ApiError("Esiste già un account con questo indirizzo email");
            }
            else {
                return newUser;
            }
        }
    }
    catch (err) {
        console.log("Errore verificato: ", err);
        callback(err);
    }
});
exports._preSignUp = (newUser, context, callback) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (newUser.request.userAttributes.hasOwnProperty("email")) {
            console.log("Richiesta di registrazione per: ", newUser.request.userAttributes.email);
            if (newUser.triggerSource === 'PreSignUp_ExternalProvider') {
                console.log("Richiesta di registrazione tramite provider esterno");
                let existingUser = yield getUserNativeByAttribute('email', newUser.request.userAttributes.email);
                if (existingUser) {
                    console.log("L'utente con email " + newUser.request.userAttributes.email + " è già registrato");
                    if (existingUser.Enabled && existingUser.UserStatus === 'CONFIRMED' &&
                        getUserAttribute(existingUser.Attributes, 'email_verified') === 'true') {
                        console.log("L'utente con email " + newUser.request.userAttributes.email + " è attivo");
                        yield linkUsers(newUser.userName, existingUser.Username);
                        return newUser;
                    }
                    else {
                        console.log("L'utente con email " + newUser.request.userAttributes.email + " non è ancora stato attivato");
                        throw new apig_1.ApiError(`invalid state for ${existingUser.Username}`);
                    }
                }
                else {
                    console.log("L'utente con email " + newUser.request.userAttributes.email + " non è già registrato");
                    var paramsSignUp = {
                        ClientId: env_1.envNames.clientId,
                        Password: generatePassword(),
                        Username: newUser.request.userAttributes.email
                    };
                    var paramsConfirm = {
                        UserPoolId: env_1.envNames.userPoolId,
                        Username: newUser.request.userAttributes.email
                    };
                    let signUpResponse = yield exports.cognito.signUp(paramsSignUp);
                    console.log("Risposta signup", signUpResponse);
                    let newNativeUser = yield signUpResponse.send();
                    let confirmSignUpResponse = yield exports.cognito.adminConfirmSignUp(paramsConfirm);
                    yield confirmSignUpResponse.send();
                    console.log("L'utente con email " + newUser.request.userAttributes.email + " è stato registrato correttamente: ", newNativeUser);
                    if (newNativeUser.UserConfirmed) {
                        console.log("Registrazione nuovo utente confermato");
                        let existingUser = yield getUserNativeByAttribute('email', newUser.request.userAttributes.email);
                        console.log("Il nuovo utente è il seguente: ", existingUser);
                        yield linkUsers(newUser.userName, existingUser.Username);
                        return newUser;
                    }
                    else {
                        console.log("Registrazione nuovo utente non confermato");
                    }
                }
            }
            else {
                return newUser;
            }
        }
    }
    catch (err) {
        console.log("Errore verificato: ", err);
    }
});
const getUserNativeByAttribute = (attributeName, attributeValue) => {
    return exports.cognito.listUsers({
        UserPoolId: env_1.envNames.userPoolId,
        Filter: `${attributeName} = "${attributeValue}"`,
    }).promise()
        .then(data => {
        const user = data.Users.filter(user => user.UserStatus !== 'EXTERNAL_PROVIDER')[0];
        if (user == null) {
            return null;
        }
        return user;
    });
};
const getUserByAttribute = (attributeName, attributeValue) => {
    return exports.cognito.listUsers({
        UserPoolId: env_1.envNames.userPoolId,
        Filter: `${attributeName} = "${attributeValue}"`,
    }).promise()
        .then(data => {
        const user = data.Users[0];
        if (user == null) {
            return null;
        }
        return user;
    });
};
const linkUsers = (externalUsername, internalUsername) => {
    return exports.cognito.adminLinkProviderForUser({
        UserPoolId: env_1.envNames.userPoolId,
        SourceUser: {
            ProviderName: externalUsername.split('_')[0],
            ProviderAttributeName: 'Cognito_Subject',
            ProviderAttributeValue: externalUsername.split('_')[1],
        },
        DestinationUser: {
            ProviderName: 'Cognito',
            ProviderAttributeValue: internalUsername,
        },
    }).promise();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Z1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFDQUF5RDtBQUN6RCxtQ0FBcUM7QUFJckMsaUNBQWdGO0FBRWhGLCtCQUFpQztBQUtwQixRQUFBLE9BQU8sR0FBRyxJQUFJLHdDQUE4QixFQUFFLENBQUM7QUFFL0MsUUFBQSxjQUFjLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBWSxFQUFFLFFBQWtCLEVBQUUsRUFBRTtJQUNsRixPQUFPLENBQUMsT0FBTyxFQUFFO1NBQ2QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLGVBQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2pFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1NBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDekIsRUFBRSxFQUFFLEVBQUU7UUFDTixHQUFHLEVBQUUsY0FBYyxDQUFDLEVBQUUsQ0FBQztLQUN4QixDQUFDLENBQUM7U0FDRixLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDO0FBRUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxVQUFrQixFQUFFLEVBQUUsQ0FBQztJQUM3QyxLQUFLLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztJQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxZQUFZLFVBQVUsRUFBRTtDQUMxRCxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVDLFFBQUEsY0FBYyxHQUFHLENBQUMsT0FBOEIsRUFBRSxPQUFZ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