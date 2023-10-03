import {ArtifactStatus, Artifact} from "../../../../shared-packages/artifact/artifact.types";
import {ArtifactRepository} from "../../../../shared-packages/artifact/artifact";
import {MongoClient} from "mongodb";

export class ArtifactRepositoryApp extends ArtifactRepository {
    protected audioProcessingStaleTimeInHours: number;

    constructor(mongoDBClient: MongoClient, databaseName: string, collectionName: string, audioProcessingStaleTimeInHours: number) {
        super(mongoDBClient, databaseName, collectionName);
        this.audioProcessingStaleTimeInHours = audioProcessingStaleTimeInHours;
    }

    async createArtifact(audioUrl: string): Promise<Artifact> {
        const artifact: Artifact = {
            audioUrl: audioUrl,
            transcription: [],
            status: ArtifactStatus.CREATED,
            createdAt: (new Date()).toISOString(),
            startProcessingAt: null,
            finishedAt: null,
        }

        const insertResult = await this._artifacts.insertOne(artifact);
        artifact._id = insertResult.insertedId;

        return artifact;
    }

    async deleteArtifact(artifactId: string) {
        return this._artifacts.deleteOne({
            '_id': artifactId,
        });
    }

    isStaleArtifact(artifact: Artifact): boolean {
        if (artifact.status !== ArtifactStatus.PROCESSING) {
            return false;
        }

        if (!artifact.startProcessingAt) {
            // should not happen in theory
            console.error(`Artifact has "PROCESSING" status but "startProcessingAt" is not set for artifactId: ${artifact._id}`);
            return true;
        }

        const now = new Date();
        const startTime = new Date(artifact.startProcessingAt);
        // @ts-ignore
        const runningInHours = Math.ceil((now - startTime) / (1000 * 60 * 60));
        return runningInHours > this.audioProcessingStaleTimeInHours;
    }
}
