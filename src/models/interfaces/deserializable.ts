export interface Deserializable<T> {
    deserialize(input: any): T;
}