import React, { useState } from 'react';
import { Coins, Plus, Gift, ShoppingBag, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RewardItem, StudentProfile } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface RewardMarketplaceProps {
  rewards: RewardItem[];
  profile: StudentProfile;
  onRedeemReward: (rewardId: string) => void;
  onAddCustomReward: (reward: { title: string; description: string; coin_cost: number; icon: string; category: string }) => void;
}

export const RewardMarketplace: React.FC<RewardMarketplaceProps> = ({
  rewards,
  profile,
  onRedeemReward,
  onAddCustomReward
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'real_world' | 'in_game'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCost, setCustomCost] = useState(150);
  const [customIcon, setCustomIcon] = useState('🎁');

  const filteredRewards = rewards.filter(r => {
    if (activeTab === 'all') return true;
    return r.category === activeTab;
  });

  const handleRedeem = (item: RewardItem) => {
    if (profile.gold >= item.coin_cost) {
      soundFX.playCoin();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      onRedeemReward(item.id);
    } else {
      soundFX.playAlert();
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    soundFX.playQuestComplete();
    onAddCustomReward({
      title: customTitle,
      description: customDesc || 'Custom real-life victory reward.',
      coin_cost: customCost,
      icon: customIcon || '🎁',
      category: 'real_world'
    });
    setModalOpen(false);
    setCustomTitle('');
    setCustomDesc('');
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner */}
      <div className="clay-card-peach p-6 rounded-[36px] border-4 border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#8B3B1C]">
            🛒
          </div>
          <div>
            <h2 className="text-xl font-black text-[#3E2318]">
              LifeRPG Reward Marketplace
            </h2>
            <p className="text-xs font-semibold text-[#6E4230] mt-0.5">
              Redeem quest gold coins for real-world breaks or strategic study consumables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-white">
            <span className="text-xl">🪙</span>
            <div>
              <div className="text-[10px] font-bold text-[#8B7E74]">Gold Stash</div>
              <div className="text-sm font-black text-[#2E241E]">{profile.gold} GOLD</div>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="clay-button-peach px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Custom Reward</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'all', label: 'All Rewards' },
          { id: 'real_world', label: '🏖️ Real-World Breaks' },
          { id: 'in_game', label: '🧪 In-Game Perks' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#2E241E] shadow-sm border border-white scale-[1.02]'
                : 'text-[#8B7E74] hover:text-[#4A3E35]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRewards.map((item) => {
          const canAfford = profile.gold >= item.coin_cost;

          return (
            <div
              key={item.id}
              className="clay-card p-6 rounded-[36px] border-4 border-white flex flex-col justify-between space-y-4 hover:scale-[1.01] transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F2EA] flex items-center justify-center text-2xl shadow-sm">
                    {item.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                    item.category === 'real_world'
                      ? 'bg-[#D0E5F5] text-[#2C5D83]'
                      : 'bg-[#E2D9F6] text-[#5E3EA8]'
                  }`}>
                    {item.category === 'real_world' ? 'REAL-WORLD' : 'IN-GAME BUFF'}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-[#2E241E]">{item.title}</h4>
                <p className="text-xs font-semibold text-[#8B7E74] mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[#F0EBE2] flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-black text-[#D35B30]">
                  <span>🪙</span>
                  <span>{item.coin_cost} Gold</span>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => handleRedeem(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1.5 ${
                    canAfford
                      ? 'clay-button-peach'
                      : 'bg-[#EDE5DA] text-[#A89D93] cursor-not-allowed'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Redeem</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="clay-card max-w-md w-full p-7 rounded-[36px] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#EB8B68]">
                <Gift className="w-6 h-6" />
                <h3 className="font-black text-lg text-[#2E241E]">
                  Create Custom Reward
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#8B7E74] hover:text-[#2E241E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustom} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-[#5C5046] block mb-1">Reward Title:</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                  placeholder="e.g. 1hr Gaming Break / Boba Treat"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5046] block mb-1">Description:</label>
                <input
                  type="text"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                  placeholder="e.g. Rewarding myself after graph algorithms."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Coin Cost:</label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="10"
                    value={customCost}
                    onChange={(e) => setCustomCost(parseInt(e.target.value))}
                    className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#5C5046] block mb-1">Icon / Emoji:</label>
                  <input
                    type="text"
                    value={customIcon}
                    onChange={(e) => setCustomIcon(e.target.value)}
                    className="w-full clay-input px-3.5 py-2.5 text-xs text-[#2E241E] font-semibold"
                    placeholder="🎁"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-[#F0EBE2] text-[#5C5046] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 clay-button-peach py-2.5 rounded-2xl text-xs font-black shadow-md"
                >
                  Add To Market
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
