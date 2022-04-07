import { Button, Group, PasswordInput, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cryptr from 'cryptr';
import fs from 'fs';
import { showNotification } from '@mantine/notifications';
import { Icon } from '@iconify/react';
// eslint-disable-next-line import/no-cycle
import { useGlobalState } from '../App';

export const dropzoneChildren = () => (
	<Group
		position="center"
		spacing="xl"
		style={{ minHeight: 220, pointerEvents: 'none' }}
	>
		<div>
			<Text size="xl" inline>
				Drag the json file here
			</Text>
		</div>
	</Group>
);

export default function Auth() {
	const [dataFilePath, setDataFilePath] = useState<string | null>(null);
	const [dataFileContent, setDataFileContent] = useState<string | null>(null);
	const [password, setPassword] = useState<string>('');
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const navigate = useNavigate();

	useEffect(() => {
		setDataFilePath(localStorage.getItem('dataFilePath'));
	}, []);

	useEffect(() => {
		if (dataFilePath) {
			fs.readFile(dataFilePath, 'utf-8', (err, data) => {
				if (err) {
					console.error(err);
				} else {
					setDataFileContent(data);
				}
			});
		}
	}, [dataFilePath]);

	function handleUnlockButtonClick() {
		if (dataFileContent) {
			try {
				const cryptr = new Cryptr(password);
				const decryptedString = cryptr.decrypt(dataFileContent);
				const decryptedStringJson = JSON.parse(decryptedString);
				if (decryptedStringJson.verification !== 'verify_me') {
					throw new Error('Invalid password');
				}

				showNotification({
					autoClose: 5000,
					title: 'Successfully unlocked data file',
					message: 'Welcome back!',
					color: 'green',
					icon: <Icon icon="carbon:checkmark-filled" />,
					loading: false,
				});
				dispatch({ data: decryptedStringJson });
				navigate('/');
			} catch (e) {
				showNotification({
					autoClose: 5000,
					title: 'Incorrect password',
					message: `Please try again.`,
					color: 'red',
					icon: <Icon icon="carbon:warning-alt" />,
					loading: false,
				});
			}
		}
	}

	return (
		<div className="h-screen w-screen flex flex-col">
			<Button
				variant="outline"
				className="m-6 w-fit"
				onClick={() => navigate('/data-settings')}
			>
				Data settings
			</Button>
			<div className="flex flex-col items-center justify-center flex-1">
				<div className="flex w-96 items-end space-x-4">
					<PasswordInput
						placeholder="Password"
						label="Password"
						required
						className="flex-1"
						disabled={!dataFilePath}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button
						variant="outline"
						color="green"
						disabled={!dataFilePath}
						onClick={() => handleUnlockButtonClick()}
					>
						Unlock
					</Button>
				</div>
				<div className="w-96">
					<Text
						className={`text-red-500 text-sm${
							dataFilePath ? ' hidden' : ''
						}`}
					>
						Please select your data file or create a new one by
						clicking on the &quot;Data settings&quot; button on the
						top left of the screen.
					</Text>
				</div>
			</div>
		</div>
	);
}
