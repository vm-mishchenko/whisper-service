import {ArtifactStatus, TranscriptionChunk, Fields} from "../../../../shared-packages/artifact/artifact.types";
import {ArtifactRepository} from "../../../../shared-packages/artifact/artifact";

export class ArtifactRepositoryWorker extends ArtifactRepository {
    async ensureArtifact(audioUrl: string): Promise<{ shouldTranscribe: boolean, artifactId: string | undefined }> {
        const existingArtifact = await this.findArtifact(audioUrl);

        // skip transcribing if artifact doesn't exist
        if (!existingArtifact) {
            console.warn(`Cannot find artifact for audioUrl: ${audioUrl}`);
            return {shouldTranscribe: false, artifactId: undefined};
        }

        // skip transcribing if artifact doesn't have "ArtifactStatus.CREATED" status
        if (existingArtifact.status !== ArtifactStatus.CREATED) {
            console.warn(`Skip transcribing as artifact status is not ${ArtifactStatus.CREATED}, status: ${existingArtifact.status}, audioUrl: ${audioUrl}`);
            return {shouldTranscribe: false, artifactId: undefined};
        }

        return {shouldTranscribe: true, artifactId: existingArtifact._id};
    }

    async addTranscriptionChunkToArtifact(artifactId: string, chunks: TranscriptionChunk[], isFirstChunk = false) {
        const filter = {
            [Fields._id]: artifactId,
        };
        const update = {
            $push: {
                [Fields.transcription]: {
                    $each: chunks
                }
            }
        };

        return this._artifacts.updateOne(filter, update);
    }

    async markArtifactAsSuccess(artifactId: string) {
        const filter = {
            [Fields._id]: artifactId,
        };
        const update = {
            $set: {
                [Fields.status]: ArtifactStatus.SUCCESS,
                [Fields.finishedAt]: (new Date()).toISOString(),
            }
        };
        return this._artifacts.updateOne(filter, update);
    }

    async markArtifactAsFailed(artifactId: string) {
        const filter = {
            [Fields._id]: artifactId,
        };
        const update = {
            $set: {
                [Fields.status]: ArtifactStatus.FAILED,
                [Fields.finishedAt]: (new Date()).toISOString(),
            }
        };
        return this._artifacts.updateOne(filter, update);
    }

    async markStartProcessing(artifactId: string) {
        const filter = {
            [Fields._id]: artifactId,
        };
        const update = {
            $set: {
                [Fields.status]: ArtifactStatus.PROCESSING,
                [Fields.startProcessingAt]: (new Date()).toISOString()
            }
        };

        return this._artifacts.updateOne(filter, update);
    }
}
