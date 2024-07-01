import { useQuery } from 'react-query';
import { githubApi } from '../../apis/githubApi';
import { sleep } from '../../helpers/sleep';
import { Issue } from '../interfaces';

const getIssueInfo = async (issueNumber: string): Promise<Issue> => {
	sleep(2);
	const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`);

	return data;
};

const getIssueComments = async (issueNumber: string): Promise<Issue[]> => {
	sleep(2);
	const { data } = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`);

	return data;
};

export const useIssue = (issueNumber: string) => {
	const issueQuery = useQuery(['issue', issueNumber], () => getIssueInfo(issueNumber));
	const commentsQuery = useQuery(
		['issue', issueNumber, 'comments'],
		() => getIssueComments(issueQuery.data!.number.toString()),
		{
			enabled: !!issueQuery.data,
		}
	);

	return { issueQuery, commentsQuery };
};

// Algo importante a considerar es que también podemos tener prefetch, o precargadas las informaciones de cada issue.
// Esto es muy útil para que al momento de abrir la aplicación, se precarguen los datos de los issues, y no se tengan que esperar.

// Aparentemente hay técnicas como el prefetch en el hover de un issue, pero también aprovechar la lista que ya tenemos en caché.