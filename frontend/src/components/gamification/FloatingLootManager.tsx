import React, { useState, useEffect, createContext, useContext } from 'react';
import { soundFX } from '../../utils/audioEffects';

export interface LootParticle {
  id: string;
  text: string;
  type: 'xp' | 'gold' | 'item' | 'damage';
  x: number;
  y: number;
  icon?: string;
}

interface FloatingLootContextType {
  triggerLoot: (text: string, type?: 'xp' | 'gold' | 'item' | 'damage', x?: number, y?: number, icon?: string) => void;
}

const FloatingLootContext = createContext<FloatingLootContextType>({
  triggerLoot: () => {}
});

export const useFloatingLoot = () => useContext(FloatingLootContext);

export const FloatingLootProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [particles, setParticles] = useState<LootParticle[]>([]);

  const triggerLoot = (
    text: string,
    type: 'xp' | 'gold' | 'item' | 'damage' = 'xp',
    x?: number,
    y?: number,
    icon?: string
  ) => {
    // Default position near center of viewport or slightly randomized
    const posX = x !== undefined ? x : window.innerWidth / 2 + (Math.random() * 120 - 60);
    const posY = y !== undefined ? y : window.innerHeight / 2 + (Math.random() * 80 - 40);

    const defaultIcon = type === 'xp' ? '⚡' : type === 'gold' ? '🪙' : type === 'damage' ? '💥' : '🎁';

    const newParticle: LootParticle = {
      id: `loot-${Date.now()}-${Math.random()}`,
      text,
      type,
      x: posX,
      y: posY,
      icon: icon || defaultIcon
    };

    if (type === 'gold') soundFX.playCoin();
    else if (type === 'xp') soundFX.playQuestComplete();

    setParticles(prev => [...prev, newParticle]);

    // Auto remove after animation completes
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1600);
  };

  return (
    <FloatingLootContext.Provider value={{ triggerLoot }}>
      {children}
      {/* Overlay for floating particles */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {particles.map(particle => {
          let styleClasses = "bg-[#FDECC8] text-[#8B6810] border-[#E5C158]";
          if (particle.type === 'xp') {
            styleClasses = "bg-gradient-to-r from-amber-400 to-yellow-300 text-[#3E2B08] border-amber-200 shadow-amber-500/30";
          } else if (particle.type === 'gold') {
            styleClasses = "bg-gradient-to-r from-yellow-300 to-amber-400 text-[#422904] border-yellow-200 shadow-yellow-500/40";
          } else if (particle.type === 'item') {
            styleClasses = "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-300 shadow-purple-500/40";
          } else if (particle.type === 'damage') {
            styleClasses = "bg-gradient-to-r from-red-600 to-rose-500 text-white border-red-300 shadow-red-500/50";
          }

          return (
            <div
              key={particle.id}
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute animate-float-loot flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 shadow-xl font-black text-sm select-none ${styleClasses}`}
            >
              <span className="text-base">{particle.icon}</span>
              <span className="tracking-wide">{particle.text}</span>
            </div>
          );
        })}
      </div>
    </FloatingLootContext.Provider>
  );
};
