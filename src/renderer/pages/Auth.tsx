import { Button, Group, PasswordInput, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import fs from 'fs';

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
	const navigate = useNavigate();

	useEffect(() => {
		setDataFilePath(localStorage.getItem('dataFilePath'));
	}, []);

	useEffect(() => {
		if (dataFilePath) {
			fs.readFile(dataFilePath, 'utf-8', (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				const dataObj = JSON.parse(data);
				console.log(dataObj);
			});
		}
	}, [dataFilePath]);

	return (
		<div className="h-screen w-screen flex flex-col">
			<Button
				variant="outline"
				className="m-6 w-fit"
				onClick={() => navigate('/data-settings')}
			>
				Data settings
			</Button>
			<div className="flex items-center justify-center flex-1">
				<div className="flex w-96 items-end space-x-4">
					<PasswordInput
						placeholder="Password"
						label="Password"
						required
						className="flex-1"
					/>
					<Button variant="outline" color="green">
						Unlock
					</Button>
				</div>
			</div>
		</div>
	);
}
