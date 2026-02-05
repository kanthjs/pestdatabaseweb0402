"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { STEPS, StepId } from "./types";

interface FormNavigationProps {
    currentStepIndex: number;
    isSubmitting: boolean;
    goToPrevStep: () => void;
    goToNextStep: () => void;
    handleSubmit: () => void;
}

export function FormNavigation({
    currentStepIndex,
    isSubmitting,
    goToPrevStep,
    goToNextStep,
    handleSubmit,
}: FormNavigationProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {currentStepIndex > 0 ? (
                <Button
                    variant="ghost"
                    className="w-full sm:w-auto px-8 h-12 rounded-full text-muted-foreground hover:text-primary transition-all font-medium"
                    onClick={goToPrevStep}
                >
                    <span className="material-icons-outlined mr-2">west</span>
                    Back
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    asChild
                    className="w-full sm:w-auto px-8 h-12 rounded-full text-muted-foreground hover:text-primary transition-all font-medium"
                >
                    <Link href="/">
                        <span className="material-icons-outlined mr-2">close</span>
                        Cancel
                    </Link>
                </Button>
            )}

            <div className="flex w-full sm:w-auto gap-4">
                {currentStepIndex < STEPS.length - 1 ? (
                    <Button
                        className="grow sm:grow-0 px-10 h-12 rounded-full bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all font-bold"
                        onClick={goToNextStep}
                    >
                        Next Step
                        <span className="material-icons-outlined ml-2">east</span>
                    </Button>
                ) : (
                    <Button
                        className="grow sm:grow-0 px-10 h-12 rounded-full bg-cta text-cta-foreground hover:opacity-90 shadow-lg shadow-orange-500/20 transition-all font-bold"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                Submitting...
                            </span>
                        ) : (
                            <>
                                Submit Report
                                <span className="material-icons-outlined ml-2">check</span>
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
