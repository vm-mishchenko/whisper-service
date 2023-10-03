import {SQSClient, SendMessageCommand,} from "@aws-sdk/client-sqs";
import {Task} from "../../../../shared-packages/queue/queue.types";


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

    async addTask(audioUrl: string) {
        const task: Partial<Task> = {
            audioUrl,
            createdAt: (new Date()).toISOString()
        };
        const command = new SendMessageCommand({
            QueueUrl: this._sqsQueueUrl,
            MessageBody: JSON.stringify(task)
        });

        return this._client.send(command);
    }
}
