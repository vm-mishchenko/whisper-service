import {transcribeAudio} from "./whisper/whisper";
import {ArtifactRepositoryWorker} from "./artifact/artifact";
import {TranscriptionChunk, Artifact} from "../../../shared-packages/artifact/artifact.types";

// Connects artifact, and whisper.
export const processArtifact = async (artifact: Artifact, artifactRepository: ArtifactRepositoryWorker) => {
    const artifactId = artifact._id!;

    // Transcribe audio.
    const onTranscriptionLines = (lines: string[]) => {
        console.log(`Add chunk to artifact, artifactId: ${artifactId}`);
        const chunks = lines.map(_mapLineToTranscriptionChunk);
        artifactRepository.addTranscriptionChunkToArtifact(artifactId, chunks);
    };
    const onSuccess = () => {
        console.log(`Mark artifact as success, artifactId: ${artifactId}`);
        artifactRepository.markArtifactAsSuccess(artifactId);
    };
    const onError = () => {
        console.log(`Mark artifact as failed, artifactId: ${artifactId}`)
        artifactRepository.markArtifactAsFailed(artifactId);
    };

    console.log(`Start transcribing audio, artifactId: ${artifactId}, audioUrl: ${artifact.audioUrl}`)
    return new Promise((resolve) => {
        transcribeAudio(artifact.audioUrl, onTranscriptionLines, onSuccess, onError, () => resolve(null));
    });
}

const _mapLineToTranscriptionChunk = (lineString: string): TranscriptionChunk => {
    // lineString example: [00:00.000 --> 00:03.000]  We need a new mattress.
    console.log(`${lineString}`)

    const start = lineString.slice(1, 10); // 00:00.000
    const end = lineString.slice(15, 24); // 00:03.000
    const text = lineString.slice(27); // We need a new mattress.
    const chunk: TranscriptionChunk = {
        start, end, text,
    };
    return chunk;
}
