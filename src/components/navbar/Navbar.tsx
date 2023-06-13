import React from "react";

import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon, {  } from "react-native-vector-icons/Entypo";
import { Dimensions } from "react-native";

const height = Dimensions.get("window").height / 40;

export function Navbar() {
    function openConfiguration() {
        console.log("Em breve...");
    }

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity>
                <Icon color={"white"} name="menu" size={23}/>
            </TouchableOpacity>
            <Text style={[styles.text]}>MusicApp</Text>
            <TouchableOpacity onPress={openConfiguration}>
                <Icon color={"white"} name="cog" size={23}/>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#24272B",
        padding: height
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    }
});