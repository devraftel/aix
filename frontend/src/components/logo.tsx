import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
	width?: number;
	height?: number;
}

export const Logo = ({ width = 50, height = 50 }: LogoProps) => {
	return (
		<Link
			href={'/'}
			className='z-40 font-semibold flex items-center space-x-2 cursor-pointer'
		>
			<Image
				src={'/logo.svg'}
				alt='Logo'
				width={width}
				height={height}
			/>
			<span>Aix.</span>
		</Link>
	);
};
