import { requireSession } from '../../../lib/auth';
import LogoutButton from '../../LogoutButton';
import ExamForm from './ExamForm';

export default function NewExamPage() {
  requireSession();

  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
        <LogoutButton />
      </div>

      <a href="/exams" className="back-link">
        ← Denemelere dön
      </a>

      <ExamForm />
    </div>
  );
}
