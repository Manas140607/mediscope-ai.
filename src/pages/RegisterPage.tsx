import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { PatientForm } from '@/components/forms/PatientForm';
import { DemoScenarioLoader } from '@/components/forms/DemoScenarioLoader';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';
import { useToastContext } from '@/hooks/useToastContext';
import { emptyPatient } from '@/services/screeningEngine';
import type { DemoScenario } from '@/services/demoScenarios';

export function RegisterPage() {
  const navigate = useNavigate();
  const { patient, setPatient, setVitals, resetFlow } = useScreeningFlow();
  const { notify } = useToastContext();

  const handleLoadScenario = (scenario: DemoScenario) => {
    setPatient(scenario.patient);
    setVitals(scenario.vitals);
    notify(`Loaded ${scenario.label}. Vitals pre-filled — continue to review.`);
  };

  const handleSubmit = () => {
    if (!patient.age || patient.age <= 0) {
      notify('Please enter a valid age before continuing.');
      return;
    }
    navigate('/vitals');
  };

  return (
    <div>
      <PageHeader
        title="New Patient Registration"
        subtitle="Enter non-identifying intake details, or load a synthetic demo scenario to fast-track the screening workflow."
        icon={<UserPlus className="h-5 w-5" />}
      />

      <div className="space-y-6">
        <DemoScenarioLoader onLoad={handleLoadScenario} />

        <PatientForm
          patient={patient}
          onChange={setPatient}
          onReset={() => {
            resetFlow();
            setPatient(emptyPatient());
            notify('Form cleared.');
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
