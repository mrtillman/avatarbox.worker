# avatarbox.worker

avatar icon updater for [avatarbox.io](https://avatarbox.io)

---

## Description

**avatarbox.worker** is a Lambda function that consumes messages from the `avbx-worker-queue` that [avatarbox.publisher](https://github.com/mrtillman/avatarbox.publisher) writes to. Upon receiving a message, this function updates a single Gravatar icon.

## Checklist

1. EventBridge Pre-Warm Rule
    - To avoid [cold start issues](https://github.com/mrtillman/avatarbox.worker/wiki/Resolving-Cold-Start-Issues), trigger `avbx-worker` periodically.
3. Same KMS Symmetric Key from [avatarbox.sdk](https://github.com/mrtillman/avatarbox.sdk)
4. Same SQS URL from *avatarbox.sdk*
5. AWS Lambda function named `avbx-worker`
    - set Timeout to 30 seconds
    - assign the `AvbxWorkerRole` which includes the following IAM policies:
      - `AmazonS3FullAccess`
      - `AmazonSQSFullAccess`
      - `AmazonDynamoDBFullAccess`
      - `AWSLambdaBasicExecutionRole`
      - `CloudWatchFullAccess`

5. Lambda environment variables:

    ```sh
    KMS_KEY_ID={YOUR-KMS-KEY-ID}
    REGION=us-east-1
    QUEUE_URL={YOUR-SQS-QUEUE-URL}
    ```

## Installation

```sh
$ git clone https://github.com/mrtillman/avatarbox.worker.git
$ cd avatarbox.worker && npm install
```

## Usage

```sh
# zip code + dependencies
$ npm run zip
```

Upload `avbx-worker.zip` to S3, and retain the S3 URI so you can define the `avbx-worker` Lambda function.

### SNS Topic

|Setting|Description|
|---|---|
|Endpoint|Your email address|
|Name| `avatarbox`|
|Protocol|Email|
|Type| Standard|

### CloudWatch Alarm

|Setting|Description|
|---|---|
|FunctionName|avbx-worker|
|Metric name|Errors|
|Notification Action|When in alarm, send message to topic "avatarbox"|
|Statistic|Sum|
|Threshold|Errors >= 1 for 1 datapoints within 5 minutes|
|Type|Metric|

## License

[MIT](https://github.com/mrtillman/avatarbox.worker/blob/main/LICENSE)
