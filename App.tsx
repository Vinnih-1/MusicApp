import { StyleSheet, View } from 'react-native';
import { Navbar } from './src/components/Navbar';
import { Footer } from './src/components/footer/Footer';
import { MusicNavigator } from './src/pages/MusicNavigator';
import { StatusBar } from 'expo-status-bar';
import { PlayerProvider } from './src/components/PlayerContext';

export default function App() {
  return (
    <PlayerProvider>
      <View style={styles.global}>
        <Navbar/>
        <MusicNavigator/>
        <Footer/>
        <StatusBar hidden={false} translucent={false} style='light'/>
      </View>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  global: {
    flex: 1,
    backgroundColor: '#30343f',
  },
});
