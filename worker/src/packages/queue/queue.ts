import {Message, ReceiveMessageCommand, SQSClient, DeleteMessageBatchCommand,} from "@aws-sdk/client-sqs";
import {Task, Fields} from "./queue.types";

export class Queue {
    private readonly _client: SQSClient;
    private readonly _sqsQueueUrl: string;

    constructor(sqsQueueUrl: string, accessKeyId: string, secretAccessKey: string) {
        this._client = new SQSClient({
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            },
            region: 'us-east-1'
        });
        this._sqsQueueUrl = sqsQueueUrl;
    }

    async findTask(): Promise<Task | undefined> {
        const message = await this._receiveSQSMessage(this._sqsQueueUrl);
        if (!message) {
            return;
        }

        let task: Task;
        try {
            task = _mapMessageToTask(message);
            return task;
        } catch (err: any) {
            console.error(`Message is invalid. ${err.message}`)
            console.log(`Remove message, MessageId: ${message.MessageId}`)
            await this._removeSQSMessage(message.MessageId!, message.ReceiptHandle!, this._sqsQueueUrl);
        }
    }

    async removeTask(task: Task) {
        return this._removeSQSMessage(task.id, task.receiptHandle, this._sqsQueueUrl);
    }

    private async _receiveSQSMessage(queueUrl: string): Promise<Message | undefined> {
        const receiveMessageCommandOutput = await this._client.send(
            new ReceiveMessageCommand({
                AttributeNames: ["SentTimestamp"],
                MaxNumberOfMessages: 1,
                MessageAttributeNames: ["All"],
                QueueUrl: queueUrl,
            })
        );

        if (!receiveMessageCommandOutput.Messages) {
            return undefined;
        }
        if (receiveMessageCommandOutput.Messages.length === 0) {
            return undefined;
        }

        return receiveMessageCommandOutput.Messages[0];
    }

    private async _removeSQSMessage(taskId: string, receiptHandle: string, queueUrl: string) {
        return this._client.send(
            new DeleteMessageBatchCommand({
                QueueUrl: this._sqsQueueUrl,
                Entries: [{
                    Id: taskId,
                    ReceiptHandle: receiptHandle,
                }],
            })
        );
    }
}


const _mapMessageToTask = (message: Message): Task => {
    if (!message.Body) {
        throw new Error(`SQS message doesn't have a body.`);
    }

    let messagePayload: Record<string, any>;
    try {
        messagePayload = JSON.parse(message.Body);
    } catch (e) {
        throw new Error(`Cannot parse message body.`);
    }

    if (!messagePayload[Fields.audioUrl]) {
        throw new Error(`Cannot find "audioUrl" in sqs message.`);
    }
    if (!messagePayload[Fields.createdAt]) {
        throw new Error(`Cannot find "createdAt" in sqs message.`);
    }

    return {
        id: message.MessageId!,
        audioUrl: messagePayload[Fields.audioUrl],
        createdAt: messagePayload[Fields.createdAt],
        receiptHandle: message.ReceiptHandle!
    };
}
