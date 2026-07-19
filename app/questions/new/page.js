import { requireSession } from '../../../lib/auth';
import LogoutButton from '../../LogoutButton';
import QuestionForm from './QuestionForm';

export default function NewQuestionPage() {
  requireSession();

  return (
    <div className="page">
      <div className="header">
        <h1>LGS Soru Takip</h1>
        <LogoutButton />
      </div>

      <a href="/" className="back-link">
        ← Sorulara dön
      </a>

      <QuestionForm />
    </div>
  );
}
