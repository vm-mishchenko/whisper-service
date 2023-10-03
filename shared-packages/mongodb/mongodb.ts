// Configure mongodb connection
import {MongoClient} from "mongodb";

export const getMongoDBClient = (user: string, password: string, cluster: string): MongoClient => {
    const mongodbConnection = `mongodb+srv://${user}:${password}@${cluster}/?retryWrites=true&w=majority`;
    const client = new MongoClient(mongodbConnection);
    return client;
}
