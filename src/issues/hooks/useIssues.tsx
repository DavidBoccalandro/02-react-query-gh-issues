import { useQuery } from 'react-query';
import { githubApi } from '../../apis/githubApi';
import { sleep } from '../../helpers/sleep';
import { Issue } from '../interfaces';
import { State } from '../interfaces/issue';

interface Props {
	state?: State;
	labels: string[];
}

const getIssues = async (labels: string[] = [], state?: State): Promise<Issue[]> => {
	await sleep(2);

	const params = new URLSearchParams

	if (state) params.append('state', state);
	if (labels.length > 0) params.append('labels', labels.join(','));

	const { data } = await githubApi.get<Issue[]>('/issues', { params });
	return data;
};

export const useIssues = ({ state, labels }: Props) => {
	const issuesQuery = useQuery(['issues', { state, labels }], () => getIssues(labels, state));
	return { issuesQuery };
};
