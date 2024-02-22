import MaxWidthWrapper from '@/components/max-width-wrapper';
import MobileNav from '@/components/mobile-nav';
import { buttonVariants } from '@/components/ui/button';
import { UserButton, auth } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

const Navbar = async () => {
	const { userId, getToken, sessionId } = auth();

	return (
		<nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
			<MaxWidthWrapper>
				<div className='flex h-14 items-center justify-between border-b border-zinc-200'>
					<Logo />

					<MobileNav isAuth={!!userId} />

					<div className='hidden items-center space-x-4 sm:flex'>
						{!userId ? (
							<>
								<Link
									href='/sign-in'
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Sign in
								</Link>
								<Link
									href='/sign-up'
									className={buttonVariants({
										size: 'sm',
									})}
								>
									Get started <ArrowRight className='ml-1.5 h-5 w-5' />
								</Link>
							</>
						) : (
							<>
								<Link
									href='/quiz/generate'
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Generate Quiz
								</Link>
								<Link
									href='/quiz'
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Quiz List
								</Link>
								<Link
									href='/quiz'
									className={buttonVariants({
										variant: 'ghost',
										size: 'sm',
									})}
								>
									Attempt Quiz
								</Link>
								<UserButton />
							</>
						)}
					</div>
				</div>
			</MaxWidthWrapper>
		</nav>
	);
};

export default Navbar;
