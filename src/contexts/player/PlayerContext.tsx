import React, { ReactNode, createContext, useState, useEffect  } from "react";

import { Audio } from "expo-av";
import { MusicProps } from "../../pages/player/MusicNavigator";

export interface PlayerContextProps {
    playAsync: (props: MusicProps) => void;
    stopAsync: () => void;
  }
  
  export const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
  
  interface PlayerProviderProps {
    children: ReactNode;
  }
  
  export function PlayerProvider({ children }: PlayerProviderProps) {
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
      if (playing) stopAsync();
  
      try {
        const newSoundObject = new Audio.Sound();
        await newSoundObject.loadAsync({ uri: props.uri });
        await newSoundObject.playAsync();
        setCurrentSound(newSoundObject);
        setPlaying(true);
      } catch (error) {
        console.log(error);
      }
    };
  
    const stopAsync = async () => {
      try {
        if (currentSound) {
          await currentSound.stopAsync();
          setCurrentSound(null);
          setPlaying(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    const contextValues: PlayerContextProps = {
      playAsync,
      stopAsync,
    };
  
    return (
      <PlayerContext.Provider value={contextValues}>
        {children}
      </PlayerContext.Provider>
    );
  }  