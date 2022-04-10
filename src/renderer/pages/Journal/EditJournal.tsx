import { Paper, Text, Button, Divider } from '@mantine/core';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { RichTextEditor } from '@mantine/rte';
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import { useGlobalState } from '../../App';

interface JournalEntry {
	uid: string;
	title: string;
	content: string;
	createdAt: string;
}

export default function EditJournal() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const [journalTitle, setJournalTitle] = useState('');
	const [journalContent, setJournalContent] = useState('');
	const navigate = useNavigate();
	const params = useParams();

	function onClickSaveButton() {
		if (journalTitle === '' || journalContent === '') {
			showNotification({
				autoClose: 5000,
				title: 'Error',
				message: `Journal title and content cannot be empty`,
				color: 'red',
				icon: <Icon icon="carbon:warning-alt" />,
				loading: false,
			});
			return;
		}
		const existingEntries = state.data.journal.entries;
		const newEntry = {
			uid: uuidv4(),
			title: journalTitle,
			content: journalContent,
			createdAt: existingEntries.filter(
				(entry: any) => entry.uid === params?.uid
			)[0].createdAt,
			updatedAt: new Date().toISOString(),
		};
		const newEntries = existingEntries.filter(
			(entry: any) => entry.uid !== params?.uid
		);
		newEntries.push(newEntry);
		dispatch({
			...(state || {}),
			data: {
				...(state.data || {}),
				journal: {
					...(state.data.journal || {}),
					entries: newEntries,
				},
			},
		});
		navigate('/journal');
	}

	useEffect(() => {
		if (params.uid) {
			try {
				const { entries } = state.data.journal;
				const referredEntry = entries.find(
					(entry: any) => entry.uid === params.uid
				);
				setJournalTitle(referredEntry.title);
				setJournalContent(referredEntry.content);
			} catch (e) {
				console.error(e);
			}
		}
	}, [params.uid, state]);

	return (
		<div className="h-screen p-5">
			<div className="flex flex-col h-full">
				<input
					type="text"
					className="w-full appearance-none h-14 px-4 text-3xl text-gray-800 leading-tight focus:outline-none focus:shadow-outline border border-gray-300 rounded-md mb-2"
					placeholder="Title..."
					value={journalTitle}
					onChange={(e) => setJournalTitle(e.target.value)}
				/>
				<RichTextEditor
					className="flex-1"
					value={journalContent}
					onChange={(value) => {
						setJournalContent(value);
					}}
				/>
				<div className="flex justify-end mt-2 space-x-5">
					<Button
						className="w-fit"
						onClick={() => {
							navigate('/journal');
						}}
						variant="outline"
						color="red"
					>
						<Icon icon="icons8:cancel" className="mr-2" />
						Cancel
					</Button>
					<Button
						className="w-fit"
						onClick={() => {
							onClickSaveButton();
						}}
						variant="outline"
					>
						<Icon icon="mdi-content-save" className="mr-2" />
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}
