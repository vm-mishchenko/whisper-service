import {sleep} from "./packages/utils/sleep";
import {config} from "./config";
import {Queue} from "./packages/queue/queue";
import {processTask} from "./packages/task-processor";
import {ArtifactRepositoryWorker} from "./packages/artifact/artifact";
import {getMongoDBClient} from "../../shared-packages/mongodb/mongodb";

// Task processing loop.
const main = async (artifactRepository: ArtifactRepositoryWorker, queue: Queue) => {
    console.log('---------Pull and process task---------')
    const task = await queue.findTask();

    if (!task) {
        console.log(`No task to process. Sleep for ${config.SLEEP_IN_SEC} sec.`)
        await sleep(config.SLEEP_IN_SEC);
    } else {
        console.log(`Start processing task with id: ${task.id}.`);
        await processTask(task, artifactRepository);
        console.log(`Remove task with id: ${task.id}.`);
        await queue.removeTask(task);
    }

    await main(artifactRepository, queue); // process next messages in loop
}

// Initialize components
const mongoDBClient = getMongoDBClient(config.MONGODB_USER, config.MONGODB_PASSWORD, config.MONGODB_CLUSTER)
const artifactRepository = new ArtifactRepositoryWorker(mongoDBClient, config.MONGODB_ARTIFACTS_DATABASE_NAME, config.MONGODB_ARTIFACTS_COLLECTION_NAME);
const queue = new Queue(config.AWS_SQS_QUEUE_URL, config.AWS_ACCESS_KEY, config.AWS_SECRET_ACCESS_KEY);

// Start main loop
main(artifactRepository, queue);