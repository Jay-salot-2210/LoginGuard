import React, { useState, useEffect } from 'react';
import { Upload, Activity, BarChart3, FileText, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    id: 1,
    title: "Upload Data",
    description: "Drag and drop your CSV or log files containing login data for analysis",
    icon: Upload,
    color: "from-teal-500 to-cyan-500",
    details: ["CSV/Log file support", "Secure file processing", "Real-time validation"]
  },
  {
    id: 2,
    title: "AI Processing",
    description: "Our advanced ML algorithms analyze patterns and detect anomalies",
    icon: Activity,
    color: "from-blue-500 to-teal-500",
    details: ["Machine learning analysis", "Pattern recognition", "Anomaly scoring"]
  },
  {
    id: 3,
    title: "View Results",
    description: "Interactive dashboard showing detected anomalies and risk levels",
    icon: BarChart3,
    color: "from-cyan-500 to-blue-500",
    details: ["Interactive visualizations", "Risk categorization", "Geographic mapping"]
  },
  {
    id: 4,
    title: "Generate Report",
    description: "Download comprehensive security reports in multiple formats",
    icon: FileText,
    color: "from-teal-500 to-blue-500",
    details: ["Detailed summaries", "CSV/PDF export", "Executive briefings"]
  }
];

const WorkflowCarousel: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="workflow" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              It Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered system follows a simple yet powerful workflow to detect and analyze security anomalies
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index === currentStep
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110`
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </button>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current step content */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-2 gap-0 min-h-[400px]">
            {/* Left side - Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {(() => {
                const CurrentIcon = workflowSteps[currentStep].icon;
                return (
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${workflowSteps[currentStep].color} 
                                  flex items-center justify-center mb-6 shadow-lg`}>
                    <CurrentIcon className="w-8 h-8 text-white" />
                  </div>
                );
              })()}
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {workflowSteps[currentStep].title}
              </h3>
              
              <p className="text-lg text-gray-600 mb-6">
                {workflowSteps[currentStep].description}
              </p>

              <ul className="space-y-3">
                {workflowSteps[currentStep].details.map((detail, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${workflowSteps[currentStep].color} mr-3`} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side - Visual */}
            <div className={`bg-gradient-to-br ${workflowSteps[currentStep].color} p-8 md:p-12 flex items-center justify-center relative overflow-hidden`}>
              {(() => {
                const CurrentIcon = workflowSteps[currentStep].icon;
                return (
                  <div className="relative z-10">
                    <CurrentIcon className="w-32 h-32 text-white/90" />
                  </div>
                );
              })()}
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.2) 0%, transparent 50%)
                  `
                }} />
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className={`h-full bg-gradient-to-r ${workflowSteps[currentStep].color} transition-all duration-4000 ease-linear`}
              style={{ width: isAutoPlaying ? '100%' : '0%' }}
            />
          </div>
        </div>

        {/* Manual navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {workflowSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-teal-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowCarousel;