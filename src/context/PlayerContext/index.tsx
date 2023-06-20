import React, { ReactNode, createContext, useState, useEffect  } from "react";

import { Audio } from "expo-av";

import * as KeepAwake from "expo-keep-awake";
import MusicService, { MusicProps, PlayerStatus } from "../../services/MusicService";

export interface PlayerContextProps {
    playAsync: (props: MusicProps) => void;
    stopAsync: () => void;
    pauseAsync: () => void;
    resumeAsync: () => void;
    nextAsync: () => void;
    previousAsync: () => void;
    music: MusicProps | undefined;
    playing: boolean;
    options: PlayerOptionsProps;
}

export interface PlayerOptionsProps {
  repeat: boolean;
  random: boolean;
}
  
export const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);
  
interface PlayerProviderProps {
  children: ReactNode;
}
  
export function PlayerProvider({ children }: PlayerProviderProps) {
  const [music, setMusic] = useState<MusicProps>();
  const [playing, setPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
  const [options] = useState<PlayerOptionsProps>({ random: false, repeat: false });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!music) return;
      if (music.status == PlayerStatus.PAUSED) {
        console.log(`Intervalo da música ${music.title} pausado.`);
        clearInterval(intervalId);
        return;
      }

      if (music.duration > music.position && music.status != PlayerStatus.STOPPED) {
        music.position = music.position + 1;
      } else if (music.status == PlayerStatus.STOPPED) {
        clearInterval(intervalId);
        console.log(`Intervalo da música ${music.title} parado.`);
        music.status = PlayerStatus.NONE;
      } else {
        clearInterval(intervalId);
        console.log(`Intervalo da música ${music.title} parado.`);
        music.status = PlayerStatus.NONE;
        nextAsync();
      }
      console.log(`${music.position.toFixed(1)} - ${music.duration}: ${music.title}`)
    }, 1000);
  }, [music]);

  const playAsync = async (props: MusicProps) => {
      await stopAsync();

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
    if (music) {
      music.status = PlayerStatus.STOPPED;
      music.position = 0;
      setMusic(music);
    }
    if (!currentSound) return;
    await currentSound.stopAsync();
    setCurrentSound(null);
    if (music) {
      setMusic(music);   
      setPlaying(false);
    }
    console.log(`Parando de tocar a música: ${music?.title}`);
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
    const updatedMusic = { ...music, status: PlayerStatus.PLAYING };
    setMusic(updatedMusic);
    setPlaying(true);
  };

  const nextAsync = async () => {
    if (!music) return;

    const musics = await MusicService.searchAllMusics();
    const index = musics.findIndex(list => list.uri === music.uri) + 1;
    if (options.random) musics.sort();
    if (index == musics.length) playAsync(musics[index - 1])
    else {
      console.log(`${index} - ${musics.length}`);
      const nextMusic = musics[index];
      playAsync(nextMusic);
      return;
    }
    if (options.repeat) playAsync(musics[0]);
  }

  const previousAsync = async () => {
    if (!music) return;
    stopAsync();
    const musics = await MusicService.searchAllMusics();
    const index = musics.findIndex(list => list.uri === music.uri) - 1;
    if (index == -1) playAsync(musics[0]);
    else playAsync(musics[index]);
  }
  
  const contextValues: PlayerContextProps = {
    playAsync,
    stopAsync,
    pauseAsync,
    resumeAsync,
    nextAsync,
    previousAsync,
    music,
    playing,
    options
  };
  
  return (
    <PlayerContext.Provider value={contextValues}>
      {children}
    </PlayerContext.Provider>
  );
}  