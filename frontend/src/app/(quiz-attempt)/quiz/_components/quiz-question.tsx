export const QuizQuestion = () => {
	return (
		<div className='flex flex-col w-full'>
			<h2 className='text-lg font-semibold mb-4 text-left w-11/12 mx-auto'>
				<span>Q1</span> - Which of the following is a primary characteristic of
				generative AI?
			</h2>
			<div className='flex flex-col mb-6 w-10/12 mx-auto'>
				<label className='flex items-center space-x-2 mb-2'>
					<input
						className='form-radio'
						name='question1'
						type='radio'
					/>
					<span className='text-md'>Focus on rule-based decision making</span>
				</label>
				<label className='flex items-center space-x-2 mb-2'>
					<input
						checked
						className='form-radio'
						name='question1'
						type='radio'
					/>
					<span className='text-md'>
						Ability to create new, original content
					</span>
				</label>
				<label className='flex items-center space-x-2 mb-2'>
					<input
						className='form-radio'
						name='question1'
						type='radio'
					/>
					<span className='text-md'>
						Reliance on large, pre-defined datasets
					</span>
				</label>
				<label className='flex items-center space-x-2'>
					<input
						className='form-radio'
						name='question1'
						type='radio'
					/>
					<span className='text-md'>Emphasis on supervised learning</span>
				</label>
			</div>
		</div>
	);
};
