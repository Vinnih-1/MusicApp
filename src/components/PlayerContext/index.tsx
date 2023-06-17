import React, { ReactNode, createContext, useState, useEffect  } from "react";

import { Audio } from "expo-av";
import { MusicProps, PlayerStatus } from "../../pages/MusicNavigator";

import * as KeepAwake from "expo-keep-awake";

export interface PlayerContextProps {
    playAsync: (props: MusicProps) => void;
    stopAsync: () => void;
    pauseAsync: () => void;
    resumeAsync: () => void;
    music: MusicProps | undefined;
    playing: boolean;
}
  
export const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
  
interface PlayerProviderProps {
  children: ReactNode;
}
  
export function PlayerProvider({ children }: PlayerProviderProps) {
  const [music, setMusic] = useState<MusicProps>();
  const [playing, setPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [currentSound]);

  useEffect(() => {
    if (!music) return;
    const intervalId = setInterval(() => {
      if (music.status == PlayerStatus.PAUSED) {
        pauseAsync();
        return;
      }

      if (music.duration > music.position) music.position++;
      else stopInterval();
    }, 1000);

    const stopInterval = () => {
      clearInterval(intervalId);
      console.log(`Intervalo da música ${music.title} parado.`);
    }
  }, [music]);
  
  const playAsync = async (props: MusicProps) => {
    if (playing) stopAsync();

      await Audio.setAudioModeAsync({
        shouldDuckAndroid: false,
        staysActiveInBackground: true
      });
      const audio = new Audio.Sound();
      await audio.loadAsync({ uri: props.uri });
      await audio.playAsync();

      setCurrentSound(audio);
      KeepAwake.activateKeepAwakeAsync();
      if (music) music.status = PlayerStatus.PLAYING;
      setMusic(props);
      setPlaying(true);
  };
  
  const stopAsync = async () => {
    if (!currentSound) return;

    await currentSound.stopAsync();
    setCurrentSound(null);
    if (music) {
      setMusic(music);   
      setPlaying(false);     
    }
  };

  const pauseAsync = async () => {
    if (!currentSound) return;

    await currentSound.pauseAsync();
    if (music) {
      music.status = PlayerStatus.PAUSED;
      setMusic(music);   
      setPlaying(false);     
    }
  }

  const resumeAsync = async () => {
    if (!currentSound) return;
    if (!music) return;
    await currentSound.playFromPositionAsync(music.position * 1000);
    music.status = PlayerStatus.PLAYING;
    setMusic(music);
    setPlaying(true);
  }

  const contextValues: PlayerContextProps = {
    playAsync,
    stopAsync,
    pauseAsync,
    resumeAsync,
    music,
    playing
  };
  
  return (
    <PlayerContext.Provider value={contextValues}>
      {children}
    </PlayerContext.Provider>
  );
}  