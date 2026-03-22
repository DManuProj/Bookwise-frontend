"use client";

import OnboardingBusinessInfo from "@/components/onboarding/OnboardingBusinessInfo";
import DoneScreen from "@/components/onboarding/DoneScreen";
import Services from "@/components/onboarding/OnboardingService";
import Staff from "@/components/onboarding/OnboardingStaff";
import WorkingHours from "@/components/onboarding/OnboardingWorkingHours";
import { useState } from "react";
import { Step1Data, Step2Data, Step3Data, Step4Data } from "@/types";

export type WorkingHourRow = {
  day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  isOwner: boolean;
};

export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  buffer: number;
  description: string;
  staffIds: string[];
};

export type OnboardingData = {
  step1: Step1Data | null;
  step2: Step2Data | null;
  step3: Step3Data | null;
  step4: Step4Data | null;
};

/* ── Default working hours ── */
const defaultWorkingHours: WorkingHourRow[] = [
  { day: "MON", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "TUE", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "WED", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "THU", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "FRI", isOpen: true, openTime: "09:00", closeTime: "18:00" },
  { day: "SAT", isOpen: true, openTime: "09:00", closeTime: "14:00" },
  { day: "SUN", isOpen: false, openTime: "09:00", closeTime: "17:00" },
];

/* ── Step metadata ── */
const STEPS = [
  { number: 1, label: "Business" },
  { number: 2, label: "Hours" },
  { number: 3, label: "Staff" },
  { number: 4, label: "Services" },
];

/* ── Component ── */
const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    step1: null,
    step2: { workingHours: defaultWorkingHours },
    step3: { staff: [] },
    step4: { services: [] },
  });

  const handleStep1Complete = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, step3: data }));
    setCurrentStep(4);
  };

  const handleStep4Complete = async (data: Step4Data) => {
    const finalData = { ...formData, step4: data };
    setFormData(finalData);
    setIsSubmitting(true);

    try {
      // TODO: replace with real API call
      // await fetch("/api/onboarding", {
      //   method: "POST",
      //   body: JSON.stringify(finalData),
      // });
      await new Promise((res) => setTimeout(res, 1500)); // simulate
      setIsDone(true);
    } catch (err) {
      console.error("Onboarding submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  if (isDone) {
    return (
      <DoneScreen
        slug={formData.step1?.slug ?? "your-business"}
        businessName={formData.step1?.businessName ?? "Your Business"}
        staffCount={formData.step3?.staff.length ?? 0}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress bar */}
      <div className="border-b border-border bg-background/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {/* Step indicators */}
          <div className="flex  justify-between max-w-xl mx-auto">
            {STEPS.map((step, index) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isCompleted
                          ? "bg-brand-500 text-white"
                          : isCurrent
                            ? "bg-brand-500/20 border-2 border-brand-500 text-brand-600 dark:text-brand-400"
                            : "bg-muted border-2 border-border text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-xs font-medium transition-colors ${
                        isCurrent
                          ? "text-brand-600 dark:text-brand-400"
                          : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line between steps */}
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-28 h-px mx-2 mb-5  transition-colors duration-300 ${
                        isCompleted ? "bg-brand-500" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-start py-10 px-6">
        <div className="w-full max-w-2xl">
          {currentStep === 1 && (
            <OnboardingBusinessInfo
              initialData={formData.step1}
              onComplete={handleStep1Complete}
            />
          )}
          {currentStep === 2 && (
            <WorkingHours
              initialData={formData.step2}
              onComplete={handleStep2Complete}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <Staff
              initialData={formData.step3}
              onComplete={handleStep3Complete}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <Services
              initialData={formData.step4}
              staff={formData.step3?.staff ?? []}
              currency={formData.step1?.currency ?? "USD"}
              onComplete={handleStep4Complete}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
