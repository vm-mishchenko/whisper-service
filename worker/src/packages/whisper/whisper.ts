import child_process from "child_process";
import {config} from "../../config";

const whisperBin = config.WHISPER_BINARY_PATH;
console.log(`Whisper binary path: '${whisperBin}'`);

export const transcribeAudio = (audioUrl: string, onData: (lines: string[]) => void, onSuccess: () => void, onError: () => void, onFinal: () => void) => {
    console.log(`Start whispering, audioUrl: ${audioUrl}`)

    // Start audio transcription.
    const whisper_process = child_process.spawn(whisperBin, [
        "--model=tiny.en",
        "--task=transcribe",
        "--output_dir=tmp",
        audioUrl // e.g. https://media.casted.us/115/fbc19b67.mp3
    ]);

    whisper_process.stdout.on('data', (data) => {
        const linesString = data.toString().split('\n');
        const chunks = linesString.filter(_filterEmptyLine);
        onData(chunks);
    });

    // 'close' emits when the whisper process has exited and its stdios are closed.
    // spawn close vs exit events: https://stackoverflow.com/questions/37522010/difference-between-childprocess-close-exit-events
    whisper_process.on('close', (code) => {
        if (code === 0) {
            onSuccess();
            console.log(`Whisper successfully processed audio: ${audioUrl}".`);
        } else {
            onError();
            console.error(`Whisper process exited with code "${code}", audioUrl: ${audioUrl}.`);
        }
        onFinal();
    });

    // Handle errors
    whisper_process.on('error', (err) => {
        onError();
        onFinal();
        console.error(`Whisper process throws the error: "${err.message}".`);
    });

    // 'exit' emits when the child exits but the stdio are not yet closed
    whisper_process.on('exit', (code) => {
        // prefer to use 'close' instead
    });
}

const _filterEmptyLine = (lineString: string): boolean => {
    return lineString.length > 0;
}
