export default function QuizAttemptLayout({
	children,
	modal,
}: {
	children: React.ReactNode;
	modal: React.ReactNode;
}) {
	return (
		<>
			{children}
			{modal}
		</>
	);
}
