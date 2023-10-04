# Whisper service

Transcribe audio via API.

Demo: https://whisper-app-b4lxkp5rjq-uc.a.run.app/api/audio/?url=https://eslyes.com/easydialogs/audio/dailylife013.mp3


## API
`GET` Get audio transcription
````shell
GET /api/audio?url=<audio_url>
````

`POST` Schedule audio for transcription
```shell
/api/audio
{
  url: audio url,
  ADMIN_ACCESS_TOKEN: access key to schedule audio
}
```

## Design

Service consists of `app` and `worker`:
- `App` exposes endpoints to return and schedule audio transcription
- `Worker` transcribes the audio and saves transcription to MongoDB
