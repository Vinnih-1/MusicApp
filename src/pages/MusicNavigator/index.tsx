import React, { useEffect, useState } from "react";

import { StyleSheet, Dimensions, ScrollView, View, Text } from "react-native";
import { CardMusic } from "../../components/CardMusic";
import MusicService from "../../services/MusicService";

import * as MediaLibrary from 'expo-media-library';

const height = Dimensions.get("window").height;

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

export function MusicNavigator() {
    const [loading, setLoading] = useState(true);
    const [musics, setMusics] = useState<MusicProps[]>([]);

    const renderMusicCard = () => {
        if (musics.length == 0) {
            return(
                <View style={{flex: 1, height: height / 1.5, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white"}}>Nenhuma música encontrada na pasta</Text>
                    <Text style={{color: "white"}}>storage/emulated/0/Music/</Text>
                </View>
            );
        }

        return (
            musics.map((music) => (
                <View key={music.title}>
                    <CardMusic 
                        title={music.title}
                        duration={music.duration}
                        uri={music.uri}
                        status={music.status}
                        position={0}
                    />
                </View>
            ))
        );
      };

    useEffect(() => {
        MusicService.requestPermissions();
        let musicPromise = MusicService.searchAllMusics();
        musicPromise.then((music) => {
          setMusics(music as unknown as MusicProps[]);
        }).then(() => setLoading(false));
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