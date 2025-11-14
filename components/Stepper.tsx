
import React from 'react';
import { CheckIcon, ChevronRightIcon } from './icons';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
            {currentStep > stepIdx + 1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>
              </>
            ) : currentStep === stepIdx + 1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-600 bg-gray-800">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-700" />
                </div>
                <div className="group relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-600 bg-gray-800 hover:border-gray-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-400" />
                </div>
              </>
            )}
            <div className="absolute -bottom-8 w-max text-center">
                <p className={`text-sm font-medium ${currentStep >= stepIdx + 1 ? 'text-indigo-400' : 'text-gray-400'}`}>{step}</p>
            </div>
             {stepIdx !== steps.length - 1 && (
                <ChevronRightIcon className="absolute right-0 top-1/2 -mt-3 h-6 w-6 text-gray-600" />
             )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Stepper;
