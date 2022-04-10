import { Overlay, Paper, Text } from '@mantine/core';
import { Icon } from '@iconify/react';
// eslint-disable-next-line import/no-cycle
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../App';

function MenuItem(props: {
	icon: string;
	title: string;
	description: string;
	// eslint-disable-next-line react/require-default-props
	disabled?: boolean;
	// eslint-disable-next-line react/require-default-props
	onClick?: () => void;
}) {
	const { icon, title, description, disabled, onClick } = props;
	return (
		<Paper
			shadow="sm"
			className={`flex items-center justify-center flex-col p-4 transition-all w-60 h-60 relative${
				disabled ? ' cursor-not-allowed' : ' hover:bg-zinc-100'
			}`}
			withBorder
			onClick={onClick}
		>
			{disabled && (
				<Text className="z-50 absolute text-3xl font-bold">
					Coming Soon
				</Text>
			)}
			{disabled && (
				<Overlay opacity={0.05} color="black" blur={8} zIndex={10} />
			)}
			<Icon icon={icon} fontSize="60" />
			<Text className="text-3xl font-semibold text-center">{title}</Text>
			<Text className="text-md text-center">{description}</Text>
		</Paper>
	);
}

export default function Home() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const navigate = useNavigate();

	return (
		<div className="p-10 flex justify-center">
			<div className="select-none flex space-x-5">
				<MenuItem
					icon="uil:diary"
					title="Journal"
					description="Write a new journal entry"
					onClick={() => {
						navigate('/journal');
					}}
				/>
				<MenuItem
					icon="bi:eye-slash-fill"
					title="Lol"
					description="No peeking babi"
					disabled
				/>
			</div>
		</div>
	);
}
