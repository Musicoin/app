import { Deserializable } from "./interfaces/deserializable";


export class Artist implements Deserializable<Artist> {
    artistName: string;

    deserialize(input: any): Artist {
        Object.assign(this, input);

        return this;
    }
}
