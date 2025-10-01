export interface StepProps {
  data: any; // Section-specific data (e.g., data.project)
  updateData: (section: string, newData: any) => void;
  onNext: () => void;
  isSubmitting: boolean;
  isSubmitted?: boolean;
}