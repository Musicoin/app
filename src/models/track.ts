import { Deserializable } from "./interfaces/deserializable";


export class Track implements Deserializable<Track> {
    audioSrc: string;
    audioUrl: string;
    contentType: string;
    image: string;
    imageSrc: string;
    author: string;
    authorLink: string;
    title: string;
    pppHash: string;
    address: string;
    directPlayCount: number;
    directTipCount: number;
    ppp: string;
    artistName: string;
    artistAddress: string;
    // trackAddress: string;
    link: string;
    isSelected: boolean = false;

    deserialize(input: any): Track {
        Object.assign(this, input);

        // this.imageSrc = 'https://musicoin.org' + this.image;

        if (this.audioUrl) {
            this.audioSrc = 'https://musicoin.org' + this.audioUrl;
            this.pppHash = this.audioUrl.substr(5);
        }

        this.artistAddress = this.authorLink.substring(this.authorLink.lastIndexOf('/') + 1);

        this.address = this.link.substring(this.link.lastIndexOf('/') + 1);

        this.ppp = this.pppHash;

        return this;
    }
}
