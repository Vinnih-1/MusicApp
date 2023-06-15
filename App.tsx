import { StyleSheet, View } from 'react-native';
import { Navbar } from './src/components/navbar/Navbar';
import { Footer } from './src/components/footer/Footer';
import { MusicNavigator } from './src/pages/player/MusicNavigator';
import { StatusBar } from 'expo-status-bar';
import { PlayerProvider } from './src/contexts/player/PlayerContext';

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
