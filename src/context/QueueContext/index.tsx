import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import MusicService, { MusicProps, PlayerStatus } from "../../services/MusicService";
import { PlayerContext } from "../PlayerContext";
import { Audio } from "expo-av";

interface QueueContextProps {
    queue: Array<MusicProps>;
    currentMusic?: MusicProps;
    playTrack: (props: MusicProps) => void;
    pauseTrack: (props: MusicProps) => void;
    resumeTrack: (props: MusicProps) => void;
    stopTrack: (props: MusicProps) => Promise<void>;
    nextTrack: (props: MusicProps) => void;
    previousTrack: (props: MusicProps) => void;
    stopInterval: (interval: NodeJS.Timer) => void;
    hasNext: () => boolean;
    intervalId?: NodeJS.Timer;
}

interface QueueProviderProps {
    children: ReactNode;
}

export const QueueContext = createContext<QueueContextProps | undefined>(undefined);

export function QueueProvider({children}: QueueProviderProps) {
    const [queue, setQueue] = useState<QueueContextProps>();
    const [music, setMusic] = useState<MusicProps>();
    const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
    const [audio, setAudio] = useState<Audio.Sound>();

    const playerContext = useContext(PlayerContext);

    useEffect(() => {
        MusicService.searchAllMusics().then(music => {
            setQueue({
                queue: music,
                playTrack,
                pauseTrack,
                resumeTrack,
                stopTrack,
                nextTrack,
                previousTrack,
                stopInterval,
                hasNext,
                intervalId
            });
        });
    }, []);

    useEffect(() => {
        setQueue({ 
            queue: queue ? queue.queue : [], currentMusic: music, playTrack, 
            pauseTrack, resumeTrack, stopTrack, nextTrack, previousTrack,
            stopInterval, hasNext , intervalId
        })
        const interval = setInterval(() => {
            if (!music) {
                return;
            }

            if (music.status == PlayerStatus.PAUSED) {
                stopInterval(interval);
                return;
            }

            if (music.status == PlayerStatus.PLAYING) {
                music.position = music.position + 1;
                setMusic(music);
                
                console.log(`${music.position.toFixed(1)} - ${music.duration}: ${music.title}`)

                if (music.position == music.duration) {
                    stopTrack(music);
                    
                    if (hasNext()) stopTrack(music).then(() => nextTrack(music));
                    else setMusic(undefined);
                }
            }
        }, 1080);

        setIntervalId(interval);
    }, [music]);

    async function playTrack(props: MusicProps) {
        if (music === props) {
            setMusic(undefined);
        }

        props.status = PlayerStatus.PLAYING;
        setMusic(props);

        const audio = new Audio.Sound;

        await audio.loadAsync({ uri: props.uri });
        await audio.playAsync();

        setAudio(audio);
        console.log(`Tocando agora: ${props.title}`);
    }

    async function pauseTrack(props: MusicProps) {
        props.status = PlayerStatus.PAUSED;
        setMusic(props);

        if (!audio) return;
        audio.pauseAsync().then(() => {
            console.log(`Pausando a música: ${props.title}`);
        });
    }

    async function resumeTrack(props: MusicProps) {
        props.status = PlayerStatus.PLAYING;
        setMusic(undefined);

        if (!audio) return;
        await audio.playFromPositionAsync(props.position * 1000);
        setMusic(props);
        console.log(`Retomando música: ${props.title}`);
    }

    async function stopTrack(props: MusicProps) {
        props.status = PlayerStatus.NONE;
        props.position = 0;
        setMusic(props);

        if (!audio) return;
        if (!audio._loaded) return;

        await audio.stopAsync();
        await audio.unloadAsync();
        
        console.log(`Parando de tocar: ${props.title}`)
    }

    function nextTrack(props: MusicProps) {
        if (!queue) return props;
        const index = queue.queue.findIndex(music => music.uri === props.uri) + 1;
        if (queue.queue.length <= index) playTrack(queue.queue[0]);
        else playTrack(queue.queue[index]).then(() => console.log(`Passando para a próxima música`));   
    }

    function previousTrack(props: MusicProps) {
        if (!queue) return props;
        const index = queue.queue.findIndex(music => music.uri === props.uri) - 1;
        if (index == -1) playTrack(queue.queue[0]);
        else playTrack(queue.queue[index]);
        console.log(`Passando para a música anterior`);
    }

    function hasNext(): boolean {
        if (!queue || !music) return false;
        if (!playerContext) return false;

        const currentIndex = queue.queue.findIndex(musics => musics.uri === music.uri) + 1;
        
        if (queue.queue.length > currentIndex) {
            return true;
        } else if (playerContext.options.repeat) {
            return true;
        }
        return false;
    }

    function stopInterval(interval: NodeJS.Timer) {
        console.log("Parando um intervalo");
        setIntervalId(undefined);
        clearInterval(interval);
    }

    const contextValues: QueueContextProps = {
        queue: queue ? queue.queue : [],
        currentMusic: music,
        playTrack,
        pauseTrack,
        resumeTrack,
        stopTrack,
        nextTrack,
        previousTrack,
        stopInterval,
        hasNext,
        intervalId
    }

    return(
        <QueueContext.Provider value={contextValues}>
            {children}
        </QueueContext.Provider>
    );
}