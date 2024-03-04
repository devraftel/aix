import MaxWidthWrapper from '@/components/max-width-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<MaxWidthWrapper className='mb-20 sm:mb-36 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center min-h-[40vh]'>
				<div className='mx-auto flex-shrink-0 mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'>
					<p className='text-sm font-semibold'>
						Revolutionize Learning with Aix!
					</p>
				</div>
				<h1 className='max-w-4xl text-5xl font-medium md:text-6xl lg:text-7xl'>
					AI Powered Quizzes &{' '}
					<span className='text-amber-600'>Personalized</span> Feedback
				</h1>
				<p className='mt-5 max-w-prose sm:text-lg text-balance font-semibold leading-5'>
					Create dynamic quizzes, get instant feedback, and unlock tailored
					learning paths.
				</p>

				<Link
					className={buttonVariants({
						size: 'lg',
						className: 'mt-5 group',
					})}
					href='/quiz/generate'
				>
					Get Started{' '}
					<ArrowRight className='hidden group-hover:block ml-2 h-5 w-5 group-hover:animate-pulse' />
				</Link>
			</MaxWidthWrapper>

			<CrossTextSection
				title='Introducing Aix: The Future of Interactive Quizzing'
				description="Aix leverages Generative AI to transform quiz creation, taking, and evaluation, making the process engaging and efficient for students, instructors, and institutions. With instant feedback and personalized learning resources, Aix is not just a quiz platform; it's a learning revolution."
				className='border-t border-t-gray-200 bg-aix-200 rounded-t-3xl w-full'
			/>

			<CrossTextSection
				title='Break Free from Boring Quizzes and Inefficient Grading'
				description='Unlike traditional quiz systems that are time-consuming and monotonous, Aix offers a unique solution. Create quizzes dynamically with any question type and receive instant, personalized feedback and learning paths. Say goodbye to manual grading and hello to a world of interactive and adaptive learning.'
				className='bg-aix-200 rounded-b-3xl w-full border-b border-gray-200'
			/>

			<section className='border-t border-gray-200'>
				<MaxWidthWrapper className='py-20'>
					<Card className='py-[2rem] px-[3rem] max-w-lg'>
						<h2 className='text-3xl md:text-4xl text-center'>
							Aix&apos;s Transformative Features
						</h2>
						<ul className='mt-5 max-w-prose mx-auto my-6 ml-6 list-disc [&>li]:mt-3 leading-7 md:leading-6 md:text-lg'>
							<li className=''>
								<span className='font-semibold'>
									AI-Powered Quiz Generation:
								</span>{' '}
								Effortlessly create quizzes (MCQs, open-ended, coding) from your
								learning material.
							</li>
							<li className=''>
								<span className='font-semibold'>
									Multimodal Quiz Experience:
								</span>
								Flexible text or verbal quiz-taking options.
							</li>
							<li className=''>
								<span className='font-semibold'>Intelligent Evaluation:</span>{' '}
								Accurate assessment of all question types, saving instructors
								valuable time.
							</li>
							<li className=''>
								<span className='font-semibold'>Personalized Feedback:</span>{' '}
								Receive tailored feedback and resources for each question to
								master concepts.
							</li>
							<li>
								<span className='font-semibold'>Adaptive Learning:</span>{' '}
								Quizzes adapt to individual student needs for a truly
								personalized experience.
							</li>
						</ul>
					</Card>
				</MaxWidthWrapper>
			</section>

			<CrossTextSection
				title='The Time is Now: AI-Enhanced Learning'
				description='Advancements in AI make it possible to revolutionize assessments. Aix is the solution to make quizzes more stimulating, efficient and valuable for students and educators alike.'
				className='bg-aix-200 rounded-3xl w-full border border-gray-200'
			/>

			<section className='border-t border-gray-200 '>
				<MaxWidthWrapper className='py-20'>
					<div className='flex flex-col items-center'>
						<h2 className='text-4xl font-medium text-balance'>
							Meet the Minds Behind Aix{' '}
						</h2>
						<p className='mt-5 text-center text-balance max-w-prose mx-auto md:text-lg'>
							Our team of passionate developers and AI enthusiasts is dedicated
							to revolutionizing education. With a blend of academic and
							technological expertise, we&apos;re here to bring you the future
							of learning.
						</p>
						<div className='flex items-center flex-wrap mt-5 mx-auto space-x-1'>
							{/* <ProfileLink
								href={'https://github.com/javaria-2b'}
								src='https://github.com/javaria-2b.png'
								alt='@javaria-2b'
								fallbackText='JIA'
							/> */}
							<ProfileLink
								href={'https://github.com/ahmad2b'}
								src='https://github.com/ahmad2b.png'
								alt='@ahmad2b'
								fallbackText='MAS'
							/>

							<ProfileLink
								href={'https://github.com/mjunaidca'}
								src={'https://github.com/mjunaidca.png'}
								alt='@mjunaidca'
								fallbackText='MJS'
							/>
							<ProfileLink
								href={'https://github.com/cmastrangelo'}
								src={'https://github.com/cmastrangelo.png'}
								alt='@cmastrangelo'
								fallbackText='CM'
							/>

							<ProfileLink
								href={'https://github.com/catbox-dev'}
								src={'https://github.com/catbox-dev.png'}
								alt='@catbox-dev'
								fallbackText='CA'
							/>
							<ProfileLink
								href={'https://github.com/shaistaDev7'}
								src={'https://github.com/shaistaDev7.png'}
								alt='@shaistaDev7'
								fallbackText='SH'
							/>
						</div>
					</div>
				</MaxWidthWrapper>
			</section>

			<section className='bg-aix-200 rounded-3xl w-full border-aix-200 drop-shadow-sm'>
				<MaxWidthWrapper className='py-20'>
					<div className='flex flex-col items-center'>
						<h2 className='text-3xl md:text-4xl font-medium text-balance text-center'>
							Let&apos;s Partner to Shape the Future of Education
						</h2>
						<p className='mt-5 max-w-prose mx-auto text-balance text-center md:text-lg'>
							We invite educators, institutions, and edtech enthusiasts to join
							us in transforming learning. Get in touch to discuss collaboration
							opportunities.
						</p>
						<Link
							href={'/contact'}
							className={cn(
								buttonVariants({
									size: 'lg',
									className: 'mt-5 px-10 py-3',
								})
							)}
						>
							Let&apos;s Connect
						</Link>
					</div>
				</MaxWidthWrapper>
			</section>

			<section className='border-t border-gray-200'>
				<MaxWidthWrapper className='py-20'>
					<div className='flex flex-col items-center'>
						<h2 className='text-4xl font-medium text-balance'>
							Beyond Quizzing
						</h2>
						<p className='mt-5 max-w-prose mx-auto text-balance text-center md:text-lg'>
							Aix is just the beginning. Our vision extends to enhancing every
							aspect of the learning journey with AI, from personalized tutoring
							to immersive simulations. Join us in empowering educators and
							learners with cutting-edge technology.
						</p>
					</div>
				</MaxWidthWrapper>
			</section>
		</>
	);
}

interface CrossTextSectionProps {
	title: string;
	description: string;
	className?: string;
}

const CrossTextSection = ({
	title,
	description,
	className,
}: CrossTextSectionProps) => {
	return (
		<section className={cn(className, '')}>
			<MaxWidthWrapper className='py-10 sm:py-16 md:py-20'>
				<div className='text-center sm:text-left'>
					<div className='w-full'>
						<h2 className='text-3xl sm:text-4xl md:text-5xl w-full sm:w-7/12 text-balance'>
							{title}
						</h2>
					</div>
					<div className='w-full flex'>
						<p className='sm:w-6/12'></p>
						<p className='sm:w-6/12 w-full md:text-lg'>{description}</p>
					</div>
				</div>
			</MaxWidthWrapper>
		</section>
	);
};

interface ProfileLinkProps {
	href: string;
	src: string;
	alt: string;
	fallbackText: string;
}

const ProfileLink = ({ href, src, alt, fallbackText }: ProfileLinkProps) => {
	return (
		<Link
			href={href}
			target='_blank'
		>
			<Avatar>
				<AvatarImage
					src={src}
					alt={alt}
				/>
				<AvatarFallback>{fallbackText}</AvatarFallback>
			</Avatar>
		</Link>
	);
};
