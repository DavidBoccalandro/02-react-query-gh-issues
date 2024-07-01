import { useState } from 'react';

import LoadingIcon from '../../shared/components/LoadingIcon';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';

import { useIssuesInfinite } from '../hooks';
import { State } from '../interfaces/issue';

export const ListViewInfinite = () => {
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const [state, setState] = useState<State>();

	const { issuesQuery } = useIssuesInfinite({ state, labels: selectedLabels });

	const onLabelChanged = (labelName: string) => {
		selectedLabels.includes(labelName)
			? setSelectedLabels(selectedLabels.filter((label) => label !== labelName))
			: setSelectedLabels([...selectedLabels, labelName]);
	};

	return (
		<div className="row mt-5">
			<div className="col-8">
				{issuesQuery.isLoading ? (
					<LoadingIcon />
				) : (
					<IssueList
						issues={issuesQuery.data?.pages.flat() || []}
						state={state}
						onStateChange={(newState) => setState(newState)}
					/>
				)}

				<div className="d-flex mt-2 justify-content-between align-items-center">
					<button
						className="btn btn-outline-primary"
						disabled={!issuesQuery.hasNextPage}
						onClick={() => issuesQuery.fetchNextPage()}
					>
						Load More...
					</button>
				</div>
			</div>

			<div className="col-4">
				<LabelPicker selectedLabels={selectedLabels} onChange={(labelName) => onLabelChanged(labelName)} />
			</div>
		</div>
	);
};
