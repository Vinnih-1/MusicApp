import React, { useContext } from "react";

import { View, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { PlayerContext } from "../PlayerContext";

import Icon from "react-native-vector-icons/Ionicons";

const musicIcon = require("./../../assets/music_icon.png")
const height = Dimensions.get("window").height / 6;

export function Footer() {
    const context = useContext(PlayerContext);

    return(
        <View style={styles.container}>
            <View>
                <Image style={styles.image} source={musicIcon}/>
            </View>
            <View style={styles.icons}>
                <TouchableOpacity>
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
                <TouchableOpacity>
                    <Icon color={"white"} size={45} name="play-skip-forward-circle-outline"/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#24272B",
        maxHeight: height,
    },
    icons: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        color: "white",
        gap: 40,
    },
    image: {
        backgroundColor: "gray",
        height: 55,
        width: 55,
        marginLeft: 20,
        borderRadius: 10,
    }
});