import {TranscriptionChunk, ArtifactStatus, Artifact} from "../../../shared-packages/artifact/artifact.types";

export interface ArtifactView {
    audioUrl: string;
    transcription: TranscriptionChunk[]
    status: ArtifactStatus;
    createdAt: string; // when app took the request for audio transcription
    startProcessingAt: string | null; // when worker adds first transcription chunk
    finishedAt: string | null; // when worker finished transcription
}

export const mapArtifactToView = (artifact: Artifact): ArtifactView => {
    return {
        audioUrl: artifact.audioUrl,
        transcription: artifact.transcription,
        status: artifact.status,
        createdAt: artifact.createdAt,
        startProcessingAt: artifact.startProcessingAt,
        finishedAt: artifact.finishedAt,
    }
}