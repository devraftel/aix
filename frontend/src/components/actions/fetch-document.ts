import { getDocuments } from './document';

export const fetchDocuments = async ({ pageParam }: { pageParam: number }) => {
	console.log('fetchDocuments', pageParam);
	const res = await getDocuments();

	return res;
};
