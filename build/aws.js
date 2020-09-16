Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCustomResource = exports.executeStateMachine = exports.sendCloudFormationResponse = exports.sts = exports.stepFunctions = exports.ssm = exports.s3 = exports.iam = exports.ec2 = exports.dynamodb = exports.cloudWatchEvents = exports.cloudSearch = exports.cloudFront = exports.batch = exports.apiGateway = void 0;
const aws_sdk_1 = require("aws-sdk");
const stringify = require("json-stable-stringify");
const request_promise_native_1 = require("request-promise-native");
const env_1 = require("./env");
const log_1 = require("./log");
exports.apiGateway = new aws_sdk_1.APIGateway();
exports.batch = new aws_sdk_1.Batch();
exports.cloudFront = new aws_sdk_1.CloudFront();
exports.cloudSearch = new aws_sdk_1.CloudSearch();
exports.cloudWatchEvents = new aws_sdk_1.CloudWatchEvents();
exports.dynamodb = new aws_sdk_1.DynamoDB.DocumentClient();
exports.ec2 = new aws_sdk_1.EC2();
exports.iam = new aws_sdk_1.IAM();
exports.s3 = new aws_sdk_1.S3({ signatureVersion: 'v4' });
exports.ssm = new aws_sdk_1.SSM();
exports.stepFunctions = new aws_sdk_1.StepFunctions();
exports.sts = new aws_sdk_1.STS();
;
;
exports.sendCloudFormationResponse = (event, context, callback) => {
    request_promise_native_1.put(event.ResponseURL, {
        body: stringify({
            Status: event.Status,
            Reason: event.Reason,
            PhysicalResourceId: event.PhysicalResourceId || event.LogicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            Data: event.Data,
        }),
    }).then(() => callback())
        .catch(callback);
};
const sendCloudFormationOnError = (request, err, callback) => {
    if (err) {
        const event = Object.assign(request, {
            Status: 'FAILED',
            Reason: err.message,
        });
        exports.sendCloudFormationResponse(event, null, () => callback(err));
    }
    else {
        callback();
    }
};
exports.executeStateMachine = (event, context, callback) => {
    exports.stepFunctions.startExecution({
        stateMachineArn: process.env[env_1.envNames.stateMachine],
        input: stringify(event),
    }).promise()
        .then(() => callback())
        .catch(callback);
};
exports.setupCustomResource = (request, context, callback) => {
    log_1.log.info(stringify(request));
    process.env[env_1.envNames.stateMachine] = request.ResourceProperties['StateMachine'];
    exports.executeStateMachine(request, null, (err) => {
        sendCloudFormationOnError(request, err, callback);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2F3cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUMwRTtBQUUxRSxtREFBbUQ7QUFDbkQsbUVBQTZDO0FBRTdDLCtCQUFpQztBQUNqQywrQkFBNEI7QUFHZixRQUFBLFVBQVUsR0FBRyxJQUFJLG9CQUFVLEVBQUUsQ0FBQztBQUM5QixRQUFBLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBQ3BCLFFBQUEsVUFBVSxHQUFHLElBQUksb0JBQVUsRUFBRSxDQUFDO0FBQzlCLFFBQUEsV0FBVyxHQUFHLElBQUkscUJBQVcsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsZ0JBQWdCLEdBQUcsSUFBSSwwQkFBZ0IsRUFBRSxDQUFDO0FBQzFDLFFBQUEsUUFBUSxHQUFHLElBQUksa0JBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN6QyxRQUFBLEdBQUcsR0FBRyxJQUFJLGFBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUEsR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7QUFDaEIsUUFBQSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLFFBQUEsR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7QUFDaEIsUUFBQSxhQUFhLEdBQUcsSUFBSSx1QkFBYSxFQUFFLENBQUM7QUFDcEMsUUFBQSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztBQWM1QixDQUFDO0FBTUQsQ0FBQztBQUVXLFFBQUEsMEJBQTBCLEdBQUcsQ0FBQyxLQUFxRCxFQUN2RCxPQUFZLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQzNFLDRCQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUNyQixJQUFJLEVBQUUsU0FBUyxDQUFDO1lBQ2QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixrQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCLElBQUksS0FBSyxDQUFDLGlCQUFpQjtZQUN2RSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDMUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1NBQ2pCLENBQUM7S0FDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3RCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRixNQUFNLHlCQUF5QixHQUFHLENBQUMsT0FBOEIsRUFBRSxHQUFVLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQ25HLElBQUksR0FBRyxFQUFFO1FBQ1AsTUFBTSxLQUFLLEdBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDeEMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPO1NBQ3BCLENBQUMsQ0FBQztRQUNILGtDQUEwQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDOUQ7U0FBTTtRQUNMLFFBQVEsRUFBRSxDQUFDO0tBQ1o7QUFDSCxDQUFDLENBQUM7QUFFVyxRQUFBLG1CQUFtQixHQUFHLENBQUMsS0FBVSxFQUFFLE9BQVksRUFBRSxRQUFrQixFQUFFLEVBQUU7SUFDbEYscUJBQWEsQ0FBQyxjQUFjLENBQUM7UUFDM0IsZUFBZSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBUSxDQUFDLFlBQVksQ0FBQztRQUNuRCxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQztLQUN4QixDQUFDLENBQUMsT0FBTyxFQUFFO1NBQ1QsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3RCLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFVyxRQUFBLG1CQUFtQixHQUFHLENBQUMsT0FBOEIsRUFBRSxPQUFZLEVBQUUsUUFBa0IsRUFBRSxFQUFFO0lBQ3RHLFNBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRWhGLDJCQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFVLEVBQUUsRUFBRTtRQUNoRCx5QkFBeUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=