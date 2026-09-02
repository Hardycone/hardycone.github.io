"use client";

import { createContext, ReactNode, useContext } from "react";

interface CardGroupContextValue {
  isActive: boolean;
  prioritizeCardClick: boolean;
}

const CardGroupContext = createContext<CardGroupContextValue | null>(null);

interface CardGroupActiveProviderProps {
  children: ReactNode;
  isActive: boolean;
  prioritizeCardClick?: boolean;
}

export function CardGroupActiveProvider({
  children,
  isActive,
  prioritizeCardClick = false,
}: CardGroupActiveProviderProps) {
  return (
    <CardGroupContext.Provider value={{ isActive, prioritizeCardClick }}>
      {children}
    </CardGroupContext.Provider>
  );
}

export function useCardGroupActive() {
  return useContext(CardGroupContext)?.isActive ?? null;
}

export function useCardGroupContext() {
  return useContext(CardGroupContext);
}
