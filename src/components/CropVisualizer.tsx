
import type { SimulationState, ScenarioDay } from '../types';
import { Sun, Cloud, CloudSnow, Bug, ShieldAlert, HeartPulse } from 'lucide-react';

interface CropVisualizerProps {
  simState: SimulationState;
  day?: ScenarioDay; // Optional context for the weather board
}

export default function CropVisualizer({ simState, day }: CropVisualizerProps) {
  // 1. Soil Moisture
  let soilColor = '#5c4033'; 
  if (simState.rootMoistureScore < 35) soilColor = '#d2b48c'; 
  if (simState.rootMoistureScore > 80) soilColor = '#2f2519'; 

  // 2. Growth Size
  const scale = 0.5 + (simState.growthScore / 100) * 0.7;

  // 3. Disease Overlay
  const isDiseased = simState.diseaseRisk > 50;
  const isCriticalDisease = simState.diseaseRisk > 80;



  // 5. Light
  const isPale = simState.lightScore < 40;

  // 6. Overall Health Mood
  const healthPercent = simState.growthScore * 0.5 + (100 - simState.diseaseRisk) * 0.5;
  let moodIcon = '😊';
  if (healthPercent < 40) moodIcon = '🤒';
  if (healthPercent > 80) moodIcon = '✨';

  let getCropImage = () => {
    if (simState.growthScore < 25) return '/straw_stage1.png';
    if (simState.growthScore < 50) return '/straw_stage2.png';
    if (simState.growthScore < 75) return '/straw_stage3.png';
    return '/straw_stage4.png';
  };

  return (
    <div className="relative w-full aspect-video bg-gradient-to-b from-sky-900/40 to-slate-800 rounded-3xl overflow-hidden border border-slate-700/50 flex flex-col items-center justify-end pt-8 pb-4 shadow-inner">
      
      {/* UI Board Overlay (Weather, Disease Warning, Mood) */}
      <div className="absolute top-3 left-3 right-4 flex justify-between items-start z-20 pointer-events-none">
        
        {/* Left Side: Weather Info if Day is provided */}
        {day ? (
          <div className="flex bg-slate-900/60 backdrop-blur rounded-xl p-1.5 gap-2 border border-slate-700">
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300">
               {day.sunlight_level === 'high' ? <Sun size={16} className="text-yellow-400" /> : <Cloud size={16} />}
            </div>
            <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-300">
               {day.outside_temp_level === 'low' ? <CloudSnow size={16} className="text-cyan-300" /> : <Sun size={16} className="text-orange-400" />}
            </div>
          </div>
        ) : <div />}

        {/* Right Side: Plant Health & Hazards */}
        <div className="flex flex-col items-end gap-2">
            <div className="bg-slate-900/60 backdrop-blur rounded-xl px-2.5 py-1.5 border border-slate-700 flex items-center gap-1.5 shadow-sm">
                <HeartPulse size={14} className={healthPercent > 60 ? "text-emerald-400" : "text-red-400"} />
                <span className="text-[10px] font-bold text-white tracking-widest">{healthPercent.toFixed(0)}%</span>
                <span className="text-sm ml-1">{moodIcon}</span>
            </div>

            {isDiseased && (
               <div className={`bg-red-500/20 backdrop-blur rounded-xl px-2.5 py-1.5 border ${isCriticalDisease ? 'border-red-500 text-red-500 animate-pulse' : 'border-red-500/50 text-red-400'} flex items-center gap-1.5`}>
                  {isCriticalDisease ? <ShieldAlert size={14} /> : <Bug size={14} />}
                  <span className="text-[9px] font-bold uppercase">Infection Risk</span>
               </div>
            )}
        </div>
      </div>

      {/* Visual background lights */}
      <div 
        className="absolute top-0 inset-x-0 h-32 bg-yellow-400 blur-3xl opacity-0 transition-opacity duration-700" 
        style={{ opacity: simState.lightScore > 70 ? 0.15 : 0 }} 
      />

      {/* The Crop Area */}
      <div className="relative flex flex-col items-center justify-end w-full h-full animate-in fade-in zoom-in duration-500">
        
        {/* Plant Body */}
        <div 
          className="relative flex items-center justify-center transition-all duration-700 ease-in-out"
          style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
        >
          {/* Main Growing Asset Graphic */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
            {/* Bright Halo / Backdrop to help blend the white background image */}
            <div className="absolute inset-0 bg-white/70 rounded-full blur-[40px] z-0" />
            
            {/* The Generative AI 2D Asset */}
            <img 
               src={getCropImage()} 
               alt="Strawberry Stage"
               className="relative z-10 w-full h-full object-contain mix-blend-multiply transition-all duration-1000 ease-in-out"
               style={{ filter: isPale ? 'brightness(0.8) sepia(0.3) hue-rotate(-20deg)' : 'none' }}
            />

            {/* Disease overlay */}
            {isDiseased && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none mix-blend-color-burn">
                <div className="w-20 h-20 bg-purple-900/60 rounded-full blur-2xl absolute bottom-1/4 right-1/4" />
                <span className="absolute top-1/4 left-1/4 text-3xl opacity-80 animate-pulse">🍄</span>
              </div>
            )}
          </div>
        </div>

        {/* The Soil / Pot */}
        <div 
          className="w-48 h-12 rounded-full blur-sm mt-2 transition-colors duration-700 shadow-xl"
          style={{ backgroundColor: soilColor }}
        ></div>
        <div 
          className="w-40 h-8 rounded-b-3xl -mt-6 transition-colors duration-700 border-b-4 border-slate-900/50"
          style={{ backgroundColor: soilColor, filter: 'brightness(0.7)' }}
        ></div>
      </div>

      {/* Moisture & Soil Badges */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {simState.rootMoistureScore < 35 && <span className="bg-amber-900/80 text-amber-200 text-[10px] px-2 py-1 rounded-full font-bold shadow-md">🍂 Dry Soil</span>}
        {simState.rootMoistureScore > 80 && <span className="bg-blue-900/80 text-blue-200 text-[10px] px-2 py-1 rounded-full font-bold shadow-md">💧 Waterlogged</span>}
      </div>
    </div>
  );
}
