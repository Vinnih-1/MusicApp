import { useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

export enum PlayerStatus {
    STOPPED, PAUSED, PLAYING, NONE
}

export interface MusicProps {
    title: string;
    duration: number;
    uri: string;
    status: PlayerStatus;
    position: number;
}

export const [musics, setMusics] = useState<MusicProps>();

class MusicService {
    async requestPermissions() {
        const { granted } = await MediaLibrary.requestPermissionsAsync();
        if (!granted) {
            console.error("A permissão ao armazenamento externo não foi concedida!");
            return;
        }
        console.log("Permissão concedida!");
    }

    async searchAllMusics() {
        const result = (await MediaLibrary.getAssetsAsync({mediaType: "audio", first: 1000})).assets;
        const filteredMusic = result.filter(music => music.uri.startsWith("file:///storage/emulated/0/Music/") &&
        music.filename.endsWith(".mp3"));

        const musics = filteredMusic.map(music => ({
            title: music.filename,
            duration: Math.floor(music.duration),
            uri: music.uri,
            status: PlayerStatus.STOPPED,
            position: 0
        }));

        return musics;
    }
}

export default new MusicService()