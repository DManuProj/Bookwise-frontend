"use client";

import OnboardingBusinessInfo from "@/components/onboarding/OnboardingBusinessInfo";
import DoneScreen from "@/components/onboarding/DoneScreen";
import OnboardingServices from "@/components/onboarding/OnboardingService";
import OnboardingStaff from "@/components/onboarding/OnboardingStaff";
import OnboardingWorkingHours from "@/components/onboarding/OnboardingWorkingHours";
import OnboardingReview from "@/components/onboarding/OnboardingReview";
import { useState } from "react";
import type {
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  OnboardingData,
  WorkingHourRow,
} from "@/types";
import { Check } from "lucide-react";

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
  { number: 5, label: "Review" },
];

/* ── Component ── */
const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [cameFromReview, setCameFromReview] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<OnboardingData>({
    businessInfo: null,
    businessHours: { workingHours: defaultWorkingHours },
    staffData: { staff: [] },
    services: { services: [] },
  });

  /* ── Handlers ── */
  const handleStep1Complete = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, businessInfo: data }));
    if (cameFromReview) {
      setCameFromReview(false);
      setCurrentStep(5);
    } else setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2Data) => {
    setFormData((prev) => ({ ...prev, workingHours: data }));
    if (cameFromReview) {
      setCameFromReview(false);
      setCurrentStep(5);
    } else setCurrentStep(3);
  };

  const handleStep3Complete = (data: Step3Data) => {
    setFormData((prev) => ({ ...prev, team: data }));
    if (cameFromReview) {
      setCameFromReview(false);
      setCurrentStep(5);
    } else setCurrentStep(4);
  };

  const handleStep4Complete = (data: Step4Data) => {
    setFormData((prev) => ({ ...prev, services: data }));
    if (cameFromReview) {
      setCameFromReview(false);
      setCurrentStep(5);
    } else setCurrentStep(5);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // TODO: await fetch("/api/onboarding", { method: "POST", body: JSON.stringify(formData) })
      await new Promise((res) => setTimeout(res, 1500));
      setIsDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  /* ── Done screen ── */
  if (isDone) {
    return (
      <DoneScreen
        slug={formData.businessInfo?.slug ?? "your-business"}
        businessName={formData.businessInfo?.businessName ?? "Your Business"}
        staffCount={formData.staffData?.staff.length ?? 0}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Progress bar */}
      <div className="border-b border-border bg-background/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between  max-w-max mx-auto">
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
                      {isCompleted ? <Check /> : step.number}
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
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-28 h-px mx-2 mb-5 transition-colors duration-300 ${
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
              initialData={formData.businessInfo}
              onComplete={handleStep1Complete}
            />
          )}
          {currentStep === 2 && (
            <OnboardingWorkingHours
              initialData={formData.businessHours}
              onComplete={handleStep2Complete}
              onBack={handleBack}
            />
          )}
          {currentStep === 3 && (
            <OnboardingStaff
              initialData={formData.staffData}
              onComplete={handleStep3Complete}
              onBack={handleBack}
            />
          )}
          {currentStep === 4 && (
            <OnboardingServices
              initialData={formData.services}
              currency={formData.businessInfo?.currency ?? "USD"}
              onComplete={handleStep4Complete}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
          {currentStep === 5 && (
            <OnboardingReview
              formData={formData}
              onEdit={(step) => {
                setCameFromReview(true);
                setCurrentStep(step);
              }}
              onConfirm={handleConfirm}
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
