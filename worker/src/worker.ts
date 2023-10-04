import {sleep} from "./packages/utils/sleep";
import {config} from "./config";
import {processArtifact} from "./packages/task-processor";
import {ArtifactRepositoryWorker} from "./packages/artifact/artifact";
import {getMongoDBClient} from "../../shared-packages/mongodb/mongodb";

// Task processing loop.
const main = async (artifactRepository: ArtifactRepositoryWorker) => {
    console.log('---------Pull and process artifact---------')
    const artifact = await artifactRepository.findNextArtifactToProcess();

    if (!artifact) {
        console.log(`No artifact to process. Sleep for ${config.SLEEP_IN_SEC} sec.`)
        await sleep(config.SLEEP_IN_SEC);
    } else {
        console.log(`Start processing artifact with id: ${artifact._id}.`);
        await processArtifact(artifact, artifactRepository);
    }

    await main(artifactRepository); // process next messages in loop
}

// Initialize components
const mongoDBClient = getMongoDBClient(config.MONGODB_USER, config.MONGODB_PASSWORD, config.MONGODB_CLUSTER)
const artifactRepository = new ArtifactRepositoryWorker(mongoDBClient, config.MONGODB_ARTIFACTS_DATABASE_NAME, config.MONGODB_ARTIFACTS_COLLECTION_NAME);

// Start main loop
main(artifactRepository);