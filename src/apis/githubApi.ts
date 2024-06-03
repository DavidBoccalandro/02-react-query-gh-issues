import axios from 'axios';

const VITE_GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

if (!VITE_GITHUB_TOKEN) {
	throw new Error('GitHub token is not defined in the environment variables');
}

export const githubApi = axios.create({
	baseURL: 'https://api.github.com/repos/facebook/react',
	headers: {
		Authorization: `Bearer ${VITE_GITHUB_TOKEN}`,
	},
});

githubApi
	.get('')
	.then((response) => {
		console.log(response.data);
	})
	.catch((error) => {
		console.error('Error making request:', error);
	});
