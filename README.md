# aws-update-gravatar

An AWS Lambda function to update your Gravatar icon

---

## Checklist

1. Gravatar account
    - must have 2 or more images
2. AWS account
    - sign in as an IAM user
    - must have access key ID and secret access key
    - configure AWS CLI
3. AWS Lambda function named `update-gravatar`
    - set Timeout to 30 seconds
    - must have IAM role assigned that includes:
      - `SecretsManagerReadWrite`
      - `CloudWatchLogsFullAccess`
      - `AmazonEventBridgeFullAccess`
4. AWS Secrets Manager secret named `demo/gravatar-login`
    - type: Other
    - key: email, value: your Gravatar email address
    - key: password, value: your Gravatar password

5. Node.js 12.x
    - must match the Lambda function's runtime

## Installation

```sh
$ git clone https://github.com/mrtillman/aws-update-gravatar.git
$ cd aws-update-gravatar
$ npm install
```

## Usage

```sh
# zip code + dependencies
$ npm run zip

# deploy to AWS Lambda
$ npm run deploy
```

### EventBridge Rule

|Setting|Description|
|---|---|
|Event schedule | `cron(0 10 * * ? *)`|
|Target | Lambda function: `update-gravatar`|

### SNS Topic

|Setting|Description|
|---|---|
|Endpoint|Your email address|
|Name| `gravatar-updates`|
|Protocol|Email|
|Type| Standard|

### CloudWatch Alarm

|Setting|Description|
|---|---|
|FunctionName|update-gravatar|
|Metric name|Errors|
|Notification Action|When in alarm, send message to topic "gravatar-updates"|
|Statistic|Sum|
|Threshold|Errors >= 1 for 1 datapoints within 5 minutes|
|Type|Metric|

## Sources

[Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)

[What Is AWS Secrets Manager?](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)

[Building Lambda functions with Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)

[Tutorial: Using AWS Lambda with scheduled events](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-tutorial.html)

[Creating a rule for an AWS service](https://docs.aws.amazon.com/eventbridge/latest/userguide/create-eventbridge-rule.html)

[Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html)

[Using Amazon CloudWatch Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)


## License

[MIT](https://github.com/mrtillman/aws-update-gravatar/blob/main/LICENSE)