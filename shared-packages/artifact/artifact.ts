import {Artifact, Fields} from "./artifact.types";
import {WithId, MongoClient, Collection} from "mongodb";

export class ArtifactRepository {
    protected _artifacts: Collection<Artifact>;

    constructor(mongoDBClient: MongoClient, databaseName: string, collectionName: string) {
        this._artifacts = mongoDBClient.db(databaseName).collection(collectionName);
    }

    protected _mapDocToArtifact(artifactDoc: WithId<Artifact>): Artifact {
        return artifactDoc as Artifact;
    }
}
