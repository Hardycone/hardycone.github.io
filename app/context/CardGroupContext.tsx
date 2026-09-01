"use client";

import { createContext, ReactNode, useContext } from "react";

const CardGroupActiveContext = createContext<boolean | null>(null);

interface CardGroupActiveProviderProps {
  children: ReactNode;
  isActive: boolean;
}

export function CardGroupActiveProvider({
  children,
  isActive,
}: CardGroupActiveProviderProps) {
  return (
    <CardGroupActiveContext.Provider value={isActive}>
      {children}
    </CardGroupActiveContext.Provider>
  );
}

export function useCardGroupActive() {
  return useContext(CardGroupActiveContext);
}
