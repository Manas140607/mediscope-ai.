import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { VitalsForm } from '@/components/forms/VitalsForm';
import { useScreeningFlow } from '@/hooks/useScreeningFlow';
import { useToastContext } from '@/hooks/useToastContext';

export function VitalsPage() {
  const navigate = useNavigate();
  const { patient, vitals, setVitals } = useScreeningFlow();
  const { notify } = useToastContext();

  const handleSubmit = () => {
    if (vitals.systolic === null || vitals.diastolic === null || vitals.pulse === null) {
      notify('Please enter systolic, diastolic, and pulse for reading 1.');
      return;
    }
    navigate('/screening');
  };

  return (
    <div>
      <PageHeader
        title="Patient Vitals Entry"
        subtitle={`Recording vitals for ${patient.id}. A repeat reading is recommended before flagging.`}
        icon={<HeartPulse className="h-5 w-5" />}
      />

      <VitalsForm
        vitals={vitals}
        onChange={setVitals}
        onSubmit={handleSubmit}
        onBack={() => navigate('/register')}
      />
    </div>
  );
}
