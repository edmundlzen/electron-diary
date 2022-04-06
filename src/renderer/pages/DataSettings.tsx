import { Dropzone } from '@mantine/dropzone';
import { Button, Group, Text } from '@mantine/core';
import React from 'react';
import { showNotification } from '@mantine/notifications';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export const dropzoneChildren = (
	fileName: string | null,
	rejected: boolean
) => (
	<Group
		position="center"
		spacing="xl"
		style={{ minHeight: 220, pointerEvents: 'none' }}
	>
		<div>
			<Text size="xl" inline>
				{/* eslint-disable-next-line no-nested-ternary */}
				{rejected
					? 'Invalid file type'
					: fileName
					? `Selected file: ${fileName}`
					: 'Drag and drop your data file here'}
			</Text>
			<Text size="sm" inline className="text-center mt-2" color="gray">
				{fileName ? null : 'Or click here to open your file browser'}
			</Text>
		</div>
	</Group>
);

export default function DataSettings() {
	const [fileName, setFileName] = React.useState<string | null>(null);
	const [filePath, setFilePath] = React.useState<string | null>(null);
	const [rejected, setRejected] = React.useState(false);

	const navigate = useNavigate();

	return (
		<div className="flex h-screen flex-col">
			<Button
				variant="subtle"
				className="m-6 w-fit"
				onClick={() => navigate(-1)}
			>
				Back
			</Button>
			<div className="flex flex-col items-center justify-center space-y-5 flex-1">
				<Dropzone
					onDrop={(files) => {
						setRejected(false);
						setFileName(files[0].name);
						setFilePath(files[0].path);
					}}
					onReject={() => {
						setRejected(true);
						setFileName(null);
						setFilePath(null);
					}}
					accept={['application/json']}
					multiple={false}
				>
					{() => dropzoneChildren(fileName, rejected)}
				</Dropzone>
				<Button
					variant="outline"
					color="grape"
					onClick={() => {
						if (!rejected && fileName && filePath) {
							localStorage.setItem('dataFilePath', filePath);
							showNotification({
								autoClose: 5000,
								title: 'Successfully changed data file',
								message: `Data file path is now set to: ${filePath}`,
								color: 'green',
								icon: <Icon icon="carbon:checkmark-filled" />,
								loading: false,
							});
							navigate('/');
						} else {
							showNotification({
								autoClose: 5000,
								title: 'Failed to change data file',
								message: `Please select a valid file`,
								color: 'red',
								icon: <Icon icon="carbon:warning-alt" />,
								loading: false,
							});
						}
					}}
				>
					Confirm
				</Button>
			</div>
		</div>
	);
}
