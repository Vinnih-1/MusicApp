import React, { ReactNode, createContext, useState, useEffect  } from "react";

import { Audio } from "expo-av";
import { MusicProps, PlayerStatus } from "../../pages/player/MusicNavigator";

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
  
  const playAsync = async (props: MusicProps) => {
    if (music?.status == PlayerStatus.PLAYING) stopAsync();

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

      console.log(music)
  };
  
  const stopAsync = async () => {
    if (!currentSound) return;

    await currentSound.stopAsync();
    setCurrentSound(null);
    if (music) {
      music.status = PlayerStatus.STOPPED;
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
    // todo: fazer sistema para retormar a música de onde parou
    console.log("implementando...");
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