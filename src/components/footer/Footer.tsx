import React from "react";

import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const height = Dimensions.get("window").height / 8;

export function Footer() {
    return(
        <View style={styles.container}>
            <View>
                <Image style={styles.image} source={require("../../../assets/music-icon.png")}/>
            </View>
            <View style={styles.icons}>
                <TouchableOpacity>
                    <Icon color={"white"} size={45} name="play-skip-back-circle-outline"/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Icon color={"white"} size={45} name="play-circle-outline"/>
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
        backgroundColor: "#1b2021",
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
        borderRadius: 10
    }
});