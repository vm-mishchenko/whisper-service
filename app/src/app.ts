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
    response.send(`Use /api/audio to get transcription, e.g. /api/audio/?url=https://eslyes.com/easydialogs/audio/dailylife010.mp3`);
});

app.post('/api/audio', async function (request, response) {
    // validate request
    const audioUrl = request.query['url'] as string;
    if (!audioUrl) {
        response.statusCode = 400;
        response.end(`Specify "url" query parameter, e.g. /api/audio/?url=https://eslyes.com/easydialogs/audio/dailylife010.mp3`);
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
        console.log(`Delete stale artifact, artifactId: ${existingArtifact._id!}`);
        await artifactRepository.deleteArtifact(existingArtifact._id!);

        const newArtifact = await artifactRepository.createArtifact(audioUrl);
        console.log(`Re-scheduled to process stale artifact, new artifactId: ${newArtifact._id}, audioUrl, ${audioUrl}.`);

        response.send(mapArtifactToView(newArtifact));
        return;
    }

    // Artifact doesn't exist at this point. Schedule processing if ADMIN_ACCESS_TOKEN is valid or absent.
    const REQUEST_ADMIN_ACCESS_TOKEN = request.body.ADMIN_ACCESS_TOKEN;
    if (!config.ADMIN_ACCESS_TOKEN || config.ADMIN_ACCESS_TOKEN === REQUEST_ADMIN_ACCESS_TOKEN) {
        const newArtifact = await artifactRepository.createArtifact(audioUrl);
        console.log(`Scheduled to process a new audio, artifactId: ${newArtifact._id}, audioUrl, ${audioUrl}.`);

        response.send(mapArtifactToView(newArtifact));
        return;
    }

    // No artifact for the audio. Also, request doesn't have a valid ADMIN_ACCESS_TOKEN to schedule processing.
    response.statusCode = 404;
    response.end(`No transcription for requested audio. Provide "ADMIN_ACCESS_TOKEN" to schedule transcription.`);
});

app.get('/api/audio', async (request, response) => {
    // validate request
    const audioUrl = request.query['url'] as string;
    if (!audioUrl) {
        response.statusCode = 400;
        response.end(`Specify "url" query parameter, e.g. /api/audio/?url=https://eslyes.com/easydialogs/audio/dailylife010.mp3`);
        return;
    }

    // find existing artifact
    const existingArtifact = await artifactRepository.findArtifact(audioUrl);

    if (!existingArtifact){
        response.statusCode = 404;
        response.end(`No transcription for requested audio. Use POST request to schedule transcription.`);
        return;
    }

    response.send(mapArtifactToView(existingArtifact));
});

const port = 3000;
console.log(`Listening on http://localhost:${port}`)
app.listen(port);
