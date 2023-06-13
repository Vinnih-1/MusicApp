import React from "react";

import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { CardMusic } from "./CardMusic";

const height = Dimensions.get("window").height;

export function MusicNavigator() {
    return(
        <ScrollView style={styles.container}>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="teste"/>
            <CardMusic title="test2"/>
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