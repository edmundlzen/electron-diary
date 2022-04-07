// eslint-disable-next-line import/no-cycle
import { useGlobalState } from '../App';

export default function Home() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const [state, dispatch] = useGlobalState();

	return <div>{JSON.stringify(state)}</div>;
}
