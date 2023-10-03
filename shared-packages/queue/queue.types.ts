export enum Fields {
    id = 'id',
    audioUrl = 'audioUrl',
    createdAt = 'createdAt',
    receiptHandle = 'receiptHandle',
}

export interface Task {
    [Fields.id]: string;
    [Fields.audioUrl]: string;
    [Fields.createdAt]: string;
    [Fields.receiptHandle]: string; // id that comes from SQS that I should send back to delete a task
}
