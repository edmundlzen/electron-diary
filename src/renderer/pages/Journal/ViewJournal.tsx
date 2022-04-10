import { Paper, Text, Button, Divider } from '@mantine/core';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { RichTextEditor } from '@mantine/rte';
import { useGlobalState } from '../../App';

interface JournalEntry {
	uid: string;
	title: string;
	content: string;
	createdAt: string;
}

export default function ViewJournal() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const [journalEntry, setJournalEntry] = useState<JournalEntry>();
	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		if (params.uid) {
			try {
				const { entries } = state.data.journal;
				const referredEntry = entries.find(
					(entry: any) => entry.uid === params.uid
				);
				setJournalEntry(referredEntry);
			} catch (e) {
				console.error(e);
			}
		}
	}, [params.uid, state]);

	return (
		<div className="flex flex-col h-screen">
			<div className="flex items-center justify-between p-3">
				<Text className="text-2xl font-semibold ml-2">
					{journalEntry?.title}
				</Text>
				<Text className="mt-2 text-slate-500 text-xs text-center">
					Created at: <br />
					{new Date(journalEntry?.createdAt as string).toLocaleString(
						'en-GB',
						{
							timeZone: 'Asia/Singapore',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric',
							second: 'numeric',
							hour12: true,
						}
					)}
				</Text>
				<div className="flex gap-x-1 justify-center">
					<Button
						variant="outline"
						onClick={() => {
							navigate(`/journal/${journalEntry?.uid}/edit`);
						}}
					>
						<Icon icon="mdi-pencil" />
					</Button>
					<Button
						variant="outline"
						color="red"
						onClick={() => {
							const existingEntries = state.data.journal.entries;
							const newEntries = existingEntries.filter(
								(entry: any) => entry.uid !== journalEntry?.uid
							);
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
						}}
					>
						<Icon icon="mdi-delete" />
					</Button>
					<Button
						variant="outline"
						onClick={() => navigate('/journal')}
					>
						Back
					</Button>
				</div>
			</div>
			<Divider variant="dashed" />
			<Paper className="p-3 flex-1" shadow="sm" withBorder>
				<RichTextEditor
					value={journalEntry?.content}
					readOnly
					className="h-full"
				/>
			</Paper>
		</div>
	);
}
