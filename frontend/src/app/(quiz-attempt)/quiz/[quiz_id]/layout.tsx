import { QuizAttemptTopBar } from '@/components/layout/quiz-attempt-topbar';

export default function QuizAttemptLayout({
	children,
	modal,
}: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<>
			<QuizAttemptTopBar />
			{children}
			{modal}
		</>
	);
}
