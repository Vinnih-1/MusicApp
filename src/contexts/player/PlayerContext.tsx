import React, { ReactNode, createContext, useState, useEffect  } from "react";

import { Audio } from "expo-av";
import { MusicProps } from "../../pages/player/MusicNavigator";

import * as KeepAwake from "expo-keep-awake";

export interface PlayerContextProps {
    playAsync: (props: MusicProps) => void;
    stopAsync: () => void;
    playing: boolean;
    currentSong: string;
  }
  
  export const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
  
  interface PlayerProviderProps {
    children: ReactNode;
  }
  
  export function PlayerProvider({ children }: PlayerProviderProps) {
    const [playing, setPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState("");
    const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  
    useEffect(() => {
      return () => {
        if (currentSound) {
          currentSound.unloadAsync();
        }
      };
    }, [currentSound]);
  
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
        setPlaying(true);
        setCurrentSong(props.uri);
        
        KeepAwake.activateKeepAwakeAsync();
    };
  
    const stopAsync = async () => {
      try {
        if (currentSound) {
          await currentSound.stopAsync();
          setCurrentSound(null);
          setPlaying(false);
          setCurrentSong("");
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const contextValues: PlayerContextProps = {
      playAsync,
      stopAsync,
      playing,
      currentSong
    };
  
    return (
      <PlayerContext.Provider value={contextValues}>
        {children}
      </PlayerContext.Provider>
    );
  }  