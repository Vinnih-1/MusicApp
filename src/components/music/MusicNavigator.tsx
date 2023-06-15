import React, { useEffect, useState } from "react";

import { StyleSheet, Dimensions, ScrollView, View, Text } from "react-native";
import { CardMusic } from "./subcomponents/CardMusic";

import * as MediaLibrary from 'expo-media-library';

const height = Dimensions.get("window").height;

export interface MusicProps {
    title: string;
    author?: string;
    image?: string;
    duration: number;
    uri: string;
}

export function MusicNavigator() {
    const [loading, setLoading] = useState(true);
    const [musics, setMusics] = useState<MusicProps[]>([]);

    async function requestPermissions() {
        const { granted } = await MediaLibrary.requestPermissionsAsync();
        if (!granted) {
            console.error("A permissão ao armazenamento externo não foi concedida!");
            return;
        }
        console.log("Permissão concedida!");
    }

    async function searchAllMusics() {
        const result = (await MediaLibrary.getAssetsAsync({mediaType: "audio", first: 1000})).assets;
        const filteredMusic = result.filter(music => music.uri.startsWith("file:///storage/emulated/0/Music/") &&
        music.filename.endsWith(".mp3"));

        const musics = filteredMusic.map(music => ({
            title: music.filename,
            duration: music.duration,
            uri: music.uri
        }));

        setMusics(musics);
    }

    const renderMusicCard = () => {
        return (
            musics.map((music) => (
                <View key={music.title}>
                    <CardMusic 
                    title={music.title}
                    duration={music.duration}
                    uri={music.uri}
                    />
                </View>
            ))
        );
      };

    useEffect(() => {
        requestPermissions();
        searchAllMusics().then(() => {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        });
    }, []);

    if (loading) {
        return(
            <View style={{flex: 1, height: height, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "white"}}>Estamos carregando todas as músicas, um momento...</Text>
            </View>
        );
    }
    
    return(
        <ScrollView style={styles.container}>
            {renderMusicCard()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#30343f",
        maxHeight: height
    }
});