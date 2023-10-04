import {
    ArtifactStatus,
    TranscriptionChunk,
    Fields,
    Artifact
} from "../../../../shared-packages/artifact/artifact.types";
import {ArtifactRepository} from "../../../../shared-packages/artifact/artifact";

export class ArtifactRepositoryWorker extends ArtifactRepository {
    async addTranscriptionChunkToArtifact(artifactId: string, chunks: TranscriptionChunk[]) {
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

    async findNextArtifactToProcess(): Promise<Artifact | undefined> {
        const result = await this._artifacts.findOneAndUpdate({
            [Fields.status]: ArtifactStatus.CREATED
        }, {
            $set: {
                [Fields.status]: ArtifactStatus.PROCESSING,
                [Fields.startProcessingAt]: (new Date()).toISOString()
            }
        });

        if (!result) {
            return;
        }

        return this._mapDocToArtifact(result);
    }
}
