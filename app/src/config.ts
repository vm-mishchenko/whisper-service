import dotenv from "dotenv"

dotenv.config({override: true});

const assertValue = (value: string | undefined, key: string): string => {
    if (!value) {
        throw Error(`"${key}" config key doesn't have a value.`);
    }

    return value;
}

export const config = {
    AWS_SQS_QUEUE_URL: assertValue(process.env.AWS_SQS_QUEUE_URL, 'AWS_SQS_QUEUE_URL'),
    AWS_ACCESS_KEY: assertValue(process.env.AWS_ACCESS_KEY, 'AWS_ACCESS_KEY'),
    AWS_SECRET_ACCESS_KEY: assertValue(process.env.AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY'),
    MONGODB_CLUSTER: assertValue(process.env.MONGODB_CLUSTER, 'MONGODB_CLUSTER'),
    MONGODB_USER: assertValue(process.env.MONGODB_USER, 'MONGODB_USER'),
    MONGODB_PASSWORD: assertValue(process.env.MONGODB_PASSWORD, 'MONGODB_PASSWORD'),
    MONGODB_ARTIFACTS_DATABASE_NAME: assertValue(process.env.MONGODB_ARTIFACTS_DATABASE_NAME, 'MONGODB_ARTIFACTS_DATABASE_NAME')!,
    MONGODB_ARTIFACTS_COLLECTION_NAME: assertValue(process.env.MONGODB_ARTIFACTS_COLLECTION_NAME, 'MONGODB_ARTIFACTS_COLLECTION_NAME'),
    AUDIO_PROCESSING_STALE_TIME_IN_HOURS: Number(process.env.AUDIO_PROCESSING_STALE_TIME_IN_HOURS) || 3
}
