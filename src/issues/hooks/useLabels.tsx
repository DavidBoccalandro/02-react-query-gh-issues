import { useQuery } from 'react-query';
import { githubApi } from '../../apis/githubApi';
import { Label } from '../interfaces/label';
import { sleep } from '../../helpers/sleep';

const getLabels = async (): Promise<Label[]> => {
	await sleep(2);

	const { data } = await githubApi.get<Label[]>('/labels?per_page=100');
	return data;
};

export const useLabels = () => {
	const labelsQuery = useQuery(['label'], getLabels, {
		// refetchOnWindowFocus: false,
		// staleTime: 1000 * 60 * 60,
		// initialData: [], // se usa para proporcionar una caché inicial
		placeholderData: [
			// se usa para proporcionar data inicial pero no se guarda en caché
			{
				id: 791921801,
				node_id: 'MDU6TGFiZWw3OTE5MjE4MDE=',
				url: 'https://api.github.com/repos/facebook/react/labels/%E2%9D%A4%EF%B8%8F',
				name: '❤️',
				color: 'ffffff',
				default: false,
			},
			{
				id: 791921801,
				node_id: 'MDU6TGFiZWw3OTE5MjE4MDE=',
				url: 'https://api.github.com/repos/facebook/react/labels/%E2%9D%A4%EF%B8%8F',
				name: '❤️',
				color: 'ffffff',
				default: false,
			},
		],
	});
	return labelsQuery;
};
