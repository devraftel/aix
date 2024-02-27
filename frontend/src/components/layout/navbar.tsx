import MaxWidthWrapper from '@/components/max-width-wrapper';
import MobileNav from '@/components/layout/mobile-nav';
import { Button, buttonVariants } from '@/components/ui/button';
import { auth, UserButton } from '@clerk/nextjs';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../logo';

import { SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs';

const Navbar = async () => {
	const { userId } = auth();

	return (
		<nav className='sticky h-14 inset-x-0 top-0 z-30 w-full backdrop-blur-lg transition-all bg-aix-100/70  drop-shadow-sm'>
			<MaxWidthWrapper>
				<div className='flex h-14 items-center justify-between'>
					<Logo />

					<MobileNav isAuth={!!userId} />

					<div className='hidden items-center space-x-4 sm:flex'>
						{!userId ? (
							<>
								<SignedOut>
									<SignInButton mode='modal'>
										<Button
											size='sm'
											type='button'
											variant='ghost'
										>
											Sign in
										</Button>
									</SignInButton>
								</SignedOut>
								<SignedOut>
									<SignUpButton mode='modal'>
										<Button
											size='sm'
											type='button'
										>
											Get started <ArrowRight className='ml-1.5 h-5 w-5' />
										</Button>
									</SignUpButton>
								</SignedOut>
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
