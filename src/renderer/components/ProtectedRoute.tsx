import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
// eslint-disable-next-line import/no-cycle
import Cryptr from 'cryptr';
import fs from 'fs';
import { useGlobalState } from '../App';

export default function ProtectedRoute() {
	const [state] = useGlobalState();

	useEffect(() => {
		// eslint-disable-next-line no-prototype-builtins
		if (state.hasOwnProperty('data') && state.hasOwnProperty('password')) {
			if (!state.data || !state.password) {
				return;
			}
			const cryptr = new Cryptr(state.password);
			const encryptedString = cryptr.encrypt(JSON.stringify(state.data));
			if (localStorage.getItem('dataFilePath')) {
				fs.writeFileSync(
					localStorage.getItem('dataFilePath') as string,
					encryptedString,
					{ encoding: 'utf8', flag: 'w' }
				);
			}
		}
	}, [state, state.data]);

	if (!state.data) {
		return <Navigate to="/auth" />;
	}

	return <Outlet />;
}
