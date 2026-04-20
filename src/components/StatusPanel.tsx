import type { SimulationState } from '../types';
import { Sprout, Droplets, Sun, Bug, TrendingUp, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StatusPanel({ simState }: { simState: SimulationState }) {
  const { t } = useTranslation();

  const metrics = [
    { 
      key: 'growthScore', icon: Sprout, val: simState.growthScore, 
      label: "Growth",
      status: simState.growthScore > 75 ? "optimal" : simState.growthScore < 30 ? "low" : "stable",
      color: "text-emerald-400", bar: "bg-emerald-500"
    },
    { 
      key: 'rootMoistureScore', icon: Droplets, val: simState.rootMoistureScore, 
      label: "Moisture",
      status: simState.rootMoistureScore < 35 || simState.rootMoistureScore > 85 ? "risky" : "optimal",
      color: "text-blue-400", bar: "bg-blue-500"
    },
    { 
      key: 'lightScore', icon: Sun, val: simState.lightScore, 
      label: "Light",
      status: simState.lightScore < 40 ? "low" : "optimal",
      color: "text-amber-400", bar: "bg-amber-500"
    },
    { 
      key: 'diseaseRisk', icon: Bug, val: simState.diseaseRisk, 
      label: "Disease",
      status: simState.diseaseRisk > 70 ? "risky" : simState.diseaseRisk > 40 ? "caution" : "stable",
      color: "text-red-400", bar: "bg-red-500"
    },
    { 
      key: 'yieldPotential', icon: TrendingUp, val: simState.yieldPotential, 
      label: "Yield",
      status: simState.yieldPotential > 80 ? "optimal" : "stable",
      color: "text-brand-400", bar: "bg-brand-500"
    },
    { 
      key: 'costScore', icon: DollarSign, val: simState.costScore, 
      label: "Cost Efficiency",
      status: simState.costScore < 40 ? "low" : "stable",
      color: "text-indigo-400", bar: "bg-indigo-500"
    }
  ];

  return (
    <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{t('report.breakdown', 'Crop Status Panel')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.key} className="bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 flex flex-col gap-2 relative overflow-hidden">
               <div className="flex items-center justify-between z-10">
                 <div className={`flex items-center gap-1.5 ${m.color}`}>
                   <Icon size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                 </div>
                 <span className="text-xs font-black text-white">{m.val.toFixed(0)}</span>
               </div>
               
               <div className="flex justify-between items-center z-10 mt-1">
                 <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${m.status === 'risky' || m.status === 'low' ? 'bg-red-500/20 text-red-400' : m.status === 'caution' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-400'}`}>
                   {m.status}
                 </span>
               </div>

               {/* Background Progress Bar */}
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-0">
                 <div className={`h-full ${m.bar} opacity-70`} style={{ width: `${m.val}%` }} />
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
