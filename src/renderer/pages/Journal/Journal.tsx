import { Paper, Text, Button, Divider } from '@mantine/core';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { useGlobalState } from '../../App';

interface JournalEntry {
	uid: string;
	title: string;
	content: string;
	createdAt: string;
}

export default function Journal() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		try {
			const { entries } = state.data.journal;
			setJournalEntries(entries);
		} catch (e) {
			console.log(e);
		}
	}, [state]);

	if (journalEntries.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Paper
					className="flex flex-col justify-center items-center h-34 w-60 p-4"
					shadow="sm"
					withBorder
				>
					<Icon
						icon="eva:question-mark-circle-outline"
						fontSize={64}
					/>
					<Text className="mt-5 font-semibold">
						You have no journal entries.
					</Text>
					<Button
						className="mt-5"
						onClick={() => navigate('/journal/new')}
						variant="outline"
					>
						Create a new entry
					</Button>
				</Paper>
			</div>
		);
	}
	return (
		<div className="flex flex-col justify-center h-screen">
			<div className="flex justify-between items-center px-2">
				<Text className="font-bold text-3xl m-3 ">Journal entries</Text>
				<div className="gap-x-2 flex">
					<Button onClick={() => navigate('/')} variant="outline">
						Back
					</Button>
					<Button
						onClick={() => navigate('/journal/new')}
						variant="outline"
					>
						<Icon icon="eva:plus-circle-outline" className="mr-2" />
						New entry
					</Button>
				</div>
			</div>
			<Divider variant="dashed" />
			<div className="flex flex-1 mt-5 p-6 flex-wrap justify-center content-start gap-y-5 gap-x-5">
				{journalEntries.map((entry) => (
					<Paper
						key={entry.uid}
						className="flex flex-col justify-center items-center h-36 w-60 p-4 hover:bg-zinc-100 transition-all select-none cursor-pointer"
						shadow="sm"
						withBorder
						onClick={() => navigate(`/journal/${entry.uid}`)}
					>
						<Text className="font-semibold">{entry.title}</Text>
						<Text className="mt-2 text-slate-500 text-xs">
							{new Date(entry.createdAt).toLocaleString('en-GB', {
								timeZone: 'Asia/Singapore',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: 'numeric',
								minute: 'numeric',
								second: 'numeric',
								hour12: true,
							})}
						</Text>
					</Paper>
				))}
			</div>
		</div>
	);
}
