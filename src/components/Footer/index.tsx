import React, { useContext } from "react";

import { View, StyleSheet, Dimensions, TouchableOpacity, Image, Text } from "react-native";
import { PlayerContext } from "../../context/PlayerContext";
import * as Progress from "react-native-progress";

import Icon from "react-native-vector-icons/Ionicons";

const musicIcon = require("./../../assets/music_icon.png")

const width = Dimensions.get("window").width / 1.3;
const height = Dimensions.get("window").height / 6;

export function Footer() {
    const context = useContext(PlayerContext);

    return(
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <View style={styles.containerImage}>
                    <Image style={styles.image} source={musicIcon}/>
                </View>
                <View style={styles.containerTitle}>
                    <Text style={styles.musicTitle}>{
                        context?.music ? context?.music?.title.replace(".mp3", "") : "Nenhuma música selecionada."
                    }</Text>
                </View>
            </View>
            <View style={styles.containerProgress}>
                <Progress.Bar 
                    progress={0} 
                    width={width}
                    color="white"
                />
            </View>
            <View style={styles.containerManager}>
                <View style={styles.icons}>
                    <TouchableOpacity
                        onPress={context?.previousAsync}
                    >
                        <Icon color={"white"} size={45} name="play-skip-back-circle-outline"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (context?.playing) context.pauseAsync();
                            else context?.resumeAsync();
                        }}
                    >
                        {
                            context?.playing
                            ?
                            <Icon color={"white"} size={45} name="pause-circle-outline"/>
                            :
                            <Icon color={"white"} size={45} name="play-circle-outline"/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={context?.nextAsync}
                    >
                        <Icon color={"white"} size={45} name="play-skip-forward-circle-outline"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxHeight: height,
        backgroundColor: "#24272B",
    },
    containerProgress: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "10%"
    },
    containerManager: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    containerTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    containerImage: {
        flex: 1,
        marginLeft: 10,
        marginTop: 5,
    },
    containerInfo: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    musicTitle: {
        color: "white",
        fontWeight: "600",
    },
    icons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
        gap: 40,

    },
    image: {
        height: 55,
        width: 55,
        borderRadius: 10,
    }
});