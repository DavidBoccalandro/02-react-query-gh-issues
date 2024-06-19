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
