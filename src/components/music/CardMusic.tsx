import React, { useContext } from "react";

import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { MusicProps } from "../../pages/player/MusicNavigator";
import { PlayerContext } from "../../contexts/player/PlayerContext";

const musicIcon = require("./../../assets/music_icon.png")
const height = Dimensions.get("window").height / 10; 
const width = Dimensions.get("window").width / 1.8;

export function CardMusic(props: MusicProps) {
    const context = useContext(PlayerContext);
    

    return(
        <TouchableOpacity style={styles.container}
            onPress={() => context?.playAsync(props)}
        >
            <Image style={styles.image} source={musicIcon}/>
            <View style={styles.info}>
                <Text style={styles.title}>{props.title.substring(0, 25).replace(".mp3", "")}</Text>
                <Text style={styles.author}>Autor Desconhecido</Text>
            </View>
            <Icon color={"white"} size={45} name="play-circle-outline"/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#161925",
        height: height,
        marginTop: 10,
        borderRadius: 20
    },
    image: {
        maxHeight: height / 1.3,
        maxWidth: height / 1.3,
        marginLeft: 12
    },
    info: {
        flex: 1,
        marginLeft: 20,
        maxWidth: width
    },
    title: {
        color: "white",
        fontWeight: "400",
        fontSize: 18
    },
    author: {
        color: "#545863",
        fontSize: 10
    }
});