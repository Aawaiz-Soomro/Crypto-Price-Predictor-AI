import React, { useEffect, useState } from 'react';
import { Loader2, Search, LineChart, BrainCircuit } from 'lucide-react';

const steps = [
  { icon: Search, text: "Scanning real-time market data..." },
  { icon: LineChart, text: "Analyzing historical charts and patterns..." },
  { icon: BrainCircuit, text: "Evaluating macro-economic factors..." },
  { icon: Loader2, text: "Formulating trading strategy..." },
];

export const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500); // Change step every 1.5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
      </div>
      
      <div className="space-y-4 max-w-md w-full">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div 
              key={index}
              className={`flex items-center space-x-3 transition-all duration-500 ${
                isActive ? 'opacity-100 transform translate-x-0' : 
                isCompleted ? 'opacity-40' : 'opacity-20'
              }`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-cyan-900/50 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                <Icon size={20} />
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-cyan-100' : 'text-slate-400'}`}>
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
