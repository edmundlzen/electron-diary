import { RichTextEditor } from '@mantine/rte';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import { Button, TextInput } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import { useGlobalState } from '../../App';

export default function NewJournal() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const navigate = useNavigate();

	function onClickSaveButton() {
		if (title === '' || content === '') {
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

		dispatch({
			...(state || {}),
			data: {
				...(state.data || {}),
				journal: {
					...(state.data.journal || {}),
					entries: [
						...(state.data.journal
							? state.data.journal.entries ?? []
							: []),
						{
							uid: uuidv4(),
							title,
							content,
							createdAt: new Date().toISOString(),
						},
					],
				},
			},
		});
		navigate('/journal');
	}

	return (
		<div className="h-screen p-5">
			<div className="flex flex-col h-full">
				<input
					type="text"
					className="w-full appearance-none h-14 px-4 text-3xl text-gray-800 leading-tight focus:outline-none focus:shadow-outline border border-gray-300 rounded-md mb-2"
					placeholder="Title..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<RichTextEditor
					className="flex-1"
					value={content}
					onChange={(value) => {
						setContent(value);
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
