export enum Fields {
    _id = '_id',
    audioUrl = 'audioUrl',
    transcription = 'transcription',
    status = 'status',
    createdAt = 'createdAt',
    startProcessingAt = 'startProcessingAt',
    finishedAt = 'finishedAt',
}

export interface Artifact {
    [Fields._id]?: string;
    [Fields.audioUrl]: string;
    [Fields.transcription]: TranscriptionChunk[]
    [Fields.status]: ArtifactStatus;
    [Fields.createdAt]: string; // when app took the request for audio transcription
    [Fields.startProcessingAt]: string | null; // when worker adds first transcription chunk
    [Fields.finishedAt]: string | null; // when worker finished transcription
}

export enum ArtifactStatus {
    CREATED = 'CREATED', // artifact created, no transcription yet
    PROCESSING = 'PROCESSING', // some transcription was added
    SUCCESS = 'SUCCESS', // all transcription was added
    FAILED = 'FAILED', // all transcription was added
}

export interface TranscriptionChunk {
    start: string; // "00:13.960"
    end: string; // "00:16.840"
    text: string; // "Did you take it to a computer shop?"
}
