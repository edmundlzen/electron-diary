import { Dropzone } from '@mantine/dropzone';
import { Button, Group, PasswordInput, Text, TextInput } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import fs from 'fs';
// @ts-ignore
import Cryptr from 'cryptr';
import { useModals } from '@mantine/modals';

const { dialog } = require('@electron/remote');

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
	const [fileName, setFileName] = useState<string | null>(null);
	const [filePath, setFilePath] = useState<string | null>(null);
	const [newDataFilePath, setNewDataFilePath] = useState<string | null>(null);
	const [newDataFileName, setNewDataFileName] = useState<string | undefined>(
		undefined
	);
	const [password, setPassword] = useState<string | undefined>(undefined);
	const [currentLoadedDataFilePath, setCurrentLoadedDataFilePath] = useState<
		string | null
	>(null);
	const [rejected, setRejected] = useState(false);
	const folderSelectRef = useRef<HTMLInputElement>(null);

	const navigate = useNavigate();
	const modals = useModals();

	useEffect(() => {
		setCurrentLoadedDataFilePath(localStorage.getItem('dataFilePath'));
	}, []);

	useEffect(() => {
		if (folderSelectRef.current !== null) {
			folderSelectRef.current.setAttribute('directory', '');
			folderSelectRef.current.setAttribute('webkitdirectory', '');
		}
	}, [folderSelectRef]);

	return (
		<div className="flex h-screen flex-col">
			<Button
				variant="subtle"
				className="m-6 w-fit"
				onClick={() => navigate(-1)}
			>
				Back
			</Button>
			<div className="h-full flex items-center justify-center flex-col">
				<Text className="font-bold text-2xl text-center">
					Current data file path:{' '}
				</Text>
				<Text className="text-center text-lg">
					{currentLoadedDataFilePath || 'None'}
				</Text>
				<div className="h-full items-center justify-center flex space-x-24">
					<div className="flex flex-col items-center justify-center space-y-5 h-full">
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
							accept={['text/plain']}
							multiple={false}
						>
							{() => dropzoneChildren(fileName, rejected)}
						</Dropzone>
						<Button
							variant="outline"
							color="grape"
							onClick={() => {
								if (!rejected && fileName && filePath) {
									localStorage.setItem(
										'dataFilePath',
										filePath
									);
									showNotification({
										autoClose: 5000,
										title: 'Successfully changed data file',
										message: `Data file path is now set to: ${filePath}`,
										color: 'green',
										icon: (
											<Icon icon="carbon:checkmark-filled" />
										),
										loading: false,
									});
									navigate('/');
								} else {
									showNotification({
										autoClose: 5000,
										title: 'Failed to change data file',
										message: `Please select a valid file`,
										color: 'red',
										icon: (
											<Icon icon="carbon:warning-alt" />
										),
										loading: false,
									});
								}
							}}
						>
							Confirm
						</Button>
					</div>
					<div className="flex flex-col items-center justify-center space-y-5 h-full">
						<Text>
							Or if you don&apos;t already have a data file...
						</Text>
						<Button
							variant="outline"
							color="grape"
							onClick={() => {
								// if (folderSelectRef !== null) {
								// 	folderSelectRef?.current?.click();
								// }
								// eslint-disable-next-line promise/catch-or-return
								dialog
									.showOpenDialog({
										title: 'Select a location for your data file',
										properties: ['openDirectory'],
									})
									.then((res: any) => {
										// eslint-disable-next-line promise/always-return
										if (
											res.canceled ||
											res.filePaths.length < 1
										)
											return;
										setNewDataFilePath(res.filePaths[0]);
										setNewDataFileName('');
										setPassword('');
										modals.openConfirmModal({
											title: 'Create a new data file',
											children: (
												<div>
													<TextInput
														label="Data file name"
														placeholder="Leave empty for default (data_file)"
														onChange={(e) =>
															setNewDataFileName(
																e.currentTarget
																	.value
															)
														}
													/>
													<PasswordInput
														label="Password for data file"
														description="Please choose a password you can remember, there is no way
														to recover a data file's contents without it's password"
														placeholder="Password must be at least 8 characters long"
														required
														onChange={(e) => {
															setPassword(
																e.currentTarget
																	.value
															);
														}}
													/>
												</div>
											),
											labels: {
												confirm: 'Confirm',
												cancel: 'Cancel',
											},
											confirmProps: {
												variant: 'light',
											},
											onConfirm() {
												if (
													password &&
													password.length >= 8 // TODO: Fix password sometimes not more than 8 characters for some reason
												) {
													let newFileName =
														newDataFileName ||
														'data_file';

													while (
														fs.existsSync(
															`${newDataFilePath}\\${newFileName}.txt`
														)
													) {
														newFileName += '_1';
													}

													const newFullFilePath = `${newDataFilePath}\\${newFileName}.txt`;

													const jsonContent =
														JSON.stringify({
															verification:
																'verify_me',
														});

													const cryptr = new Cryptr(
														password
													);

													const encryptedString =
														cryptr.encrypt(
															jsonContent
														);

													fs.open(
														newFullFilePath,
														'w',
														() => {}
													);

													fs.writeFile(
														newFullFilePath,
														encryptedString,
														() => {}
													);

													localStorage.setItem(
														'dataFilePath',
														newFullFilePath
													);
													setCurrentLoadedDataFilePath(
														newFullFilePath
													);
													showNotification({
														autoClose: 5000,
														title: 'Successfully initialized and set data file.',
														message: `Data file path is now set to: ${newFullFilePath}. Please proceed to logging in`,
														color: 'green',
														icon: (
															<Icon icon="carbon:checkmark-filled" />
														),
														loading: false,
													});
													navigate(-1);
												} else {
													showNotification({
														autoClose: 5000,
														title: 'Password must be at least 8 characters long',
														message: `Please choose a longer password`,
														color: 'red',
														icon: (
															<Icon icon="carbon:warning-alt" />
														),
														loading: false,
													});
												}
											},
										});
									});
							}}
						>
							Create a new data file
						</Button>
					</div>
				</div>
			</div>
			<input
				type="file"
				ref={folderSelectRef}
				className="hidden"
				onChange={(e: any) => {
					console.log(e.target.files[0]);
				}}
			/>
		</div>
	);
}
