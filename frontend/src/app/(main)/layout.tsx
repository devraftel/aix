import { DeleteQuiz } from '@/components/delete-quiz';
import { Footer } from '@/components/footer';
import Navbar from '@/components/navbar';
import { QuizStartDialog } from '@/components/quiz-start-dialog';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Navbar />
			<main className='flex flex-col w-full flex-1 items-center justify-center mx-auto max-w-7xl'>
				{children}
				<QuizStartDialog />
				<DeleteQuiz />
			</main>
			<Footer />
		</div>
	);
};

export default Layout;