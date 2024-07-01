import { FC } from 'react';
import { FiCheckCircle, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { getIssueComments, getIssueInfo } from '../hooks/useIssue';
import { Issue, State } from '../interfaces/issue';

interface Props {
	issue: Issue;
}

export const IssueItem: FC<Props> = ({ issue }: Props) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient(); // Esto es para poder hacer prefetch de los datos de los issues.

	const prefetchData = () => {
		// prefetchQuery toma dos parámetros:
		// 1. La clave de la consulta (query key), que es un array que identifica de manera única la consulta.
		//    En este caso, ['issue', issue.number] y ['issue', issue.number, 'comments'].
		// 2. Una función que retorna una promesa con los datos que queremos prefetch.
		//    Aquí usamos getIssueInfo y getIssueComments para obtener la información del issue y sus comentarios.

		// Otra sintaxis es pasarlo en un objeto de opciones, ejemplo:
		// queryClient.prefetchQuery({
		// queryKey: ['issue', issue.number],
		// queryFn: () => getIssueInfo(issue.number.toString()) });

		// agregar updatedAt
		queryClient.prefetchQuery(['issue', issue.number], () => getIssueInfo(issue.number.toString()));
		queryClient.prefetchQuery(['issue', issue.number, 'comments'], () => getIssueComments(issue.number.toString()));
	};

	const preSetData = () => {
		// Además de poder setear cosas por prefetch, pidiendo al back de antemano,
		// también podemos setear data en el caché de react query manualmente.
		queryClient.setQueryData(['issue', issue.number], issue, {
			// updatedAt es para que no se actualice la data en el caché
			// hasta tanto no ocurra el plazo que le ingresamos allí.
			// En este caso, 100.000 milisegundos, es decir, 100 segundos después,
			// lo reinsertaría en el caché. Sería como el "staleTime" en fetch y prefetch,
			// pero acá en setQueryData se usa el updatedAt.
			updatedAt: new Date().getTime() + 100000,
		});
		queryClient.setQueryData(['issue', issue.number, 'comments'], issue.comments, {
			updatedAt: new Date().getTime() + 100000,
		});
	};

	return (
		<div
			className="card mb-2 issue"
			onClick={() => navigate(`/issues/issue/${issue.number}`)}
			// onMouseEnter={prefetchData}
			onMouseEnter={preSetData}
		>
			<div className="card-body d-flex align-items-center">
				{issue.state === State.Open ? <FiInfo size={30} color="red" /> : <FiCheckCircle size={30} color="green" />}

				<div className="d-flex flex-column flex-fill px-2">
					<span>{issue.title}</span>
					<span className="issue-subinfo">
						#{issue.number} opened 2 days ago by <span className="fw-bold">{issue.user.login}</span>
					</span>
				</div>

				<div className="d-flex align-items-center">
					<img src={issue.user.avatar_url} alt="User Avatar" className="avatar" />
					<span className="px-2">{issue.comments}</span>
					<FiMessageSquare />
				</div>
			</div>
		</div>
	);
};

// Si hago en el mouse enter, las peticiones, claramente va a hacer muchísimas peticiones. Entonces hay que considerar cómo manejarlo.
