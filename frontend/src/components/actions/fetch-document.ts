import { getDocuments } from './document';

export const fetchDocuments = async ({ pageParam }: { pageParam: number }) => {
	const res = await getDocuments();

	return res;
};
