import { Overlay, Paper, Text } from '@mantine/core';
import { Icon } from '@iconify/react';
// eslint-disable-next-line import/no-cycle
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../App';

export default function Journal() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();
	const navigate = useNavigate();

	return <div className="p-10 flex justify-center">Hello</div>;
}
