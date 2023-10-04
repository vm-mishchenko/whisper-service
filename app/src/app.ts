import express from "express"
import {config} from "./config";
import {mapArtifactToView} from "./views/ArtifactView";
import {ArtifactRepositoryApp} from "./packages/artifact/artifact";
import {getMongoDBClient} from "../../shared-packages/mongodb/mongodb";

// Initialize components
const mongoDBClient = getMongoDBClient(config.MONGODB_USER, config.MONGODB_PASSWORD, config.MONGODB_CLUSTER)
const artifactRepository = new ArtifactRepositoryApp(
    mongoDBClient,
    config.MONGODB_ARTIFACTS_DATABASE_NAME,
    config.MONGODB_ARTIFACTS_COLLECTION_NAME,
    config.AUDIO_PROCESSING_STALE_TIME_IN_HOURS
);

// Start web server
const app = express()

app.get('/', async function (request, response) {
    // validate request
    const audioUrl = request.query['audioUrl'] as string;
    if (!audioUrl) {
        response.statusCode = 400;
        response.end(`Specify "audioUrl" query parameter, e.g. /?audioUrl=https://eslyes.com/easydialogs/audio/dailylife010.mp3`);
        return;
    }

    // find existing artifact
    const existingArtifact = await artifactRepository.findArtifact(audioUrl);
    const isStale = existingArtifact && artifactRepository.isStaleArtifact(existingArtifact);

    // return existing artifact
    if (existingArtifact && !isStale) {
        response.send(mapArtifactToView(existingArtifact));
        return;
    }

    // delete stale artifact
    if (isStale) {
        await artifactRepository.deleteArtifact(existingArtifact._id!);
        console.log(`Deleted stale artifact, artifactId: ${existingArtifact._id!}`);
    }

    // schedule audio processing
    const newArtifact = await artifactRepository.createArtifact(audioUrl);
    console.log(`Scheduled a new task to process audio, artifactId: ${newArtifact._id}, audioUrl, ${audioUrl}.`);
    response.send(mapArtifactToView(newArtifact));
});

const port = 3000;
console.log(`Listening on http://localhost:${port}`)
app.listen(port);
