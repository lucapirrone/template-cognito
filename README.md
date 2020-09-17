Configurazione AWS Cognito
Prima di rilasciare questo servizio su aws, bisogna aver rilasciato il servizio api contenente l'API Gateway (template-serverless-api)

Configurazione Facebook Developer
1 Aggiungere una nuova app su facebook developer con il Login Facebook
2 Impostazioni del client OAuth ->  URI di reindirizzamento OAuth validi
https://dominio.eu-central-1.amazoncognito.com/oauth2/idpresponse
https://couponkeeper.auth.eu-central-1.amazoncognito.com/oauth2/idpresponse
3 Impostazioni di Base -> Domini app
dominio.eu-central-1.amazoncognito.com
couponkeeper.auth.eu-central-1.amazoncognito.com
4 In Facebook Login aggiungere sito web tramite Avvio Rapido -> WWW ed utilizzare come URL del sito
https://dominio.eu-central-1.amazoncognito.com/oauth2/idpresponse
https://couponkeeper.auth.eu-central-1.amazoncognito.com/oauth2/idpresponse
