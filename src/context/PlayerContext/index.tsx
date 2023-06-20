import React, { ReactNode, createContext, useState, useEffect  } from "react";

export interface PlayerContextProps {
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
  const [options] = useState<PlayerOptionsProps>({ random: false, repeat: false });
  
  const contextValues: PlayerContextProps = {
    options
  };
  
  return (
    <PlayerContext.Provider value={contextValues}>
      {children}
    </PlayerContext.Provider>
  );
}  