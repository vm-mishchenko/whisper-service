import {transcribeAudio} from "./packages/whisper/whisper";
import dotenv from "dotenv"
dotenv.config({override: true});

/**
 * Debugger script to transcribe an audio locally.
 */

const audioUrl = "https://traffic.libsyn.com/secure/seradio/583_Lukas_Fittle_Postgres_Performance.mp3?dest-id=23379"

// Transcribe audio.
const onTranscriptionLines = (lines: string[]) => {
    console.log(lines)
};
const onSuccess = () => {
    console.log("Success")
};
const onError = () => {
    console.error("Error")
};

const onFinal = () => {
    console.log("Final")
}

transcribeAudio(audioUrl, onTranscriptionLines, onSuccess, onError, onFinal);
