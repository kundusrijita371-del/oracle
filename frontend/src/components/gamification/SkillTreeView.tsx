import React from 'react';
import { Sparkles, Zap, CheckCircle2, ArrowUpCircle } from 'lucide-react';
import { SkillNode, StudentProfile } from '../../services/api';
import { soundFX } from '../../utils/audioEffects';

interface SkillTreeViewProps {
  skillNodes: SkillNode[];
  profile: StudentProfile;
  onUpgradeSkill: (nodeId: string) => void;
}

export const SkillTreeView: React.FC<SkillTreeViewProps> = ({
  skillNodes,
  profile,
  onUpgradeSkill
}) => {
  const branches = ["Algorithms", "Data Structures", "Systems", "AI & Math"];

  const handleUpgrade = (node: SkillNode) => {
    if (profile.xp >= node.xp_cost && node.level < node.max_level) {
      soundFX.playLevelUp();
      onUpgradeSkill(node.id);
    } else {
      soundFX.playAlert();
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Top Banner */}
      <div className="clay-card-yellow p-6 rounded-[36px] border-4 border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl text-[#8B6810]">
            🌳
          </div>
          <div>
            <h2 className="text-xl font-black text-[#3E2B08]">
              Scholar Mastery Skill Tree
            </h2>
            <p className="text-xs font-semibold text-[#6E5014] mt-0.5">
              Allocate your XP to unlock passive gameplay buffs and reduce remedial task durations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-white">
          <Sparkles className="w-5 h-5 text-[#EB8B68] animate-spin-slow" />
          <div>
            <div className="text-[10px] font-bold text-[#8B7E74]">Available XP Pool</div>
            <div className="text-base font-black text-[#2E241E]">{profile.xp} XP</div>
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((branch) => {
          const nodes = skillNodes.filter(n => n.branch === branch);

          return (
            <div key={branch} className="clay-card p-6 sm:p-7 rounded-[38px] border-4 border-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE2]">
                <h3 className="font-black text-base text-[#2E241E]">
                  {branch}
                </h3>
                <span className="text-xs font-bold text-[#EB8B68]">
                  {nodes.filter(n => n.unlocked).length} / {nodes.length} Nodes Unlocked
                </span>
              </div>

              <div className="space-y-3">
                {nodes.map((node) => {
                  const canAfford = profile.xp >= node.xp_cost;
                  const isMaxed = node.level >= node.max_level;

                  return (
                    <div
                      key={node.id}
                      className={`p-4 rounded-3xl border-2 transition-all flex flex-col justify-between space-y-3 ${
                        node.unlocked
                          ? 'bg-[#FAF6F0] border-white shadow-sm'
                          : 'bg-[#F5F0E8]/50 border-transparent opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0">
                            {node.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-xs sm:text-sm text-[#2E241E]">{node.name}</h4>
                              <span className="px-2 py-0.2 rounded-md bg-[#FDECC8] text-[#735A22] text-[10px] font-black">
                                Lvl {node.level}/{node.max_level}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-[#8B7E74] mt-0.5">{node.description}</p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0">
                          {isMaxed ? (
                            <span className="px-2.5 py-1 rounded-xl bg-[#D4E8DD] text-[#2D5A42] text-[10px] font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>MAX</span>
                            </span>
                          ) : (
                            <button
                              disabled={!canAfford}
                              onClick={() => handleUpgrade(node)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 ${
                                canAfford
                                  ? 'clay-button-peach'
                                  : 'bg-[#EDE5DA] text-[#A89D93] cursor-not-allowed'
                              }`}
                            >
                              <ArrowUpCircle className="w-3.5 h-3.5" />
                              <span>{node.xp_cost} XP</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Active Perk */}
                      <div className="pt-2 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-bold text-[#8B3B1C]">
                        <Zap className="w-3.5 h-3.5 text-[#EB8B68]" />
                        <span>Active Buff: {node.bonus_perk}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
