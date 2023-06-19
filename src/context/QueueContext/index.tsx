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
                intervalId
            });
        });
    }, []);

    useEffect(() => {
        setQueue({ 
            queue: queue ? queue.queue : [], currentMusic: music, playTrack, 
            pauseTrack, resumeTrack, stopTrack, nextTrack, previousTrack,
            stopInterval, intervalId
        })

        const interval = setInterval(() => {
            if (!music) {
                stopInterval(interval);
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
                    
                    if (hasNext()) {
                        nextTrack(getNextTrack(music));
                    }
                }
            }
        }, 1000);

        setIntervalId(interval);
    }, [music]);

    async function playTrack(props: MusicProps) {
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

    function resumeTrack(props: MusicProps) {
    }

    async function stopTrack(props: MusicProps) {
        props.status = PlayerStatus.NONE;
        setMusic(props);

        if (!audio) return;
        await audio.stopAsync();
        await audio.unloadAsync();
        
        console.log(`Parando de tocar: ${props.title}`)
    }

    function nextTrack(props: MusicProps) {
        setMusic(props);
        playTrack(props).then(() => console.log(`Passando para a próxima música: ${props.title}`));   
    }

    function previousTrack() {

    }

    function getNextTrack(props: MusicProps): MusicProps{
        if (!queue) return props;
        const index = queue.queue.findIndex(music => music.uri === props.uri) + 1;
        if (queue.queue.length <= index) return queue.queue[0];

        return queue.queue[index];
    } 

    function hasNext(): boolean {
        if (!queue || !music) return false;
        const currentIndex = queue.queue.findIndex(musics => musics.uri === music.uri);
        return queue.queue.length > currentIndex;
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
        intervalId
    }

    return(
        <QueueContext.Provider value={contextValues}>
            {children}
        </QueueContext.Provider>
    );
}