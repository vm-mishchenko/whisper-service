import {Artifact, Fields} from "./artifact.types";
import {WithId, MongoClient, Collection} from "mongodb";

export class ArtifactRepository {
    protected _artifacts: Collection<Artifact>;

    constructor(mongoDBClient: MongoClient, databaseName: string, collectionName: string) {
        this._artifacts = mongoDBClient.db(databaseName).collection(collectionName);
    }

    async findArtifact(audioUrl: string): Promise<Artifact | undefined> {
        const artifactDoc = await this._artifacts.findOne({[Fields.audioUrl]: audioUrl});
        if (artifactDoc) {
            const artifact = this._mapDocToArtifact(artifactDoc)
            return artifact;
        }
    }

    private _mapDocToArtifact(artifactDoc: WithId<Artifact>): Artifact {
        return artifactDoc as Artifact;
    }
}
