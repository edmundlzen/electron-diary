import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import './App.css';
import 'tailwindcss/tailwind.css';
// import { useEffect } from 'react';
// import fs from 'fs';
import { createContext, useContext, useReducer } from 'react';
import Auth from './pages/Auth';
import DataSettings from './pages/DataSettings';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

const defaultGlobalState = {
	data: null,
};
const globalStateContext = createContext(defaultGlobalState);
const dispatchStateContext = createContext<any>(undefined);

export const useGlobalState = () => [
	useContext(globalStateContext),
	useContext(dispatchStateContext),
];

const GlobalStateProvider = ({ children }: any) => {
	const [state, dispatch] = useReducer(
		// eslint-disable-next-line @typescript-eslint/no-shadow
		(state: any, newValue: any) => ({ ...state, ...newValue }),
		defaultGlobalState
	);
	return (
		<globalStateContext.Provider value={state}>
			<dispatchStateContext.Provider value={dispatch}>
				{children}
			</dispatchStateContext.Provider>
		</globalStateContext.Provider>
	);
};

export default function App() {
	return (
		<MantineProvider>
			<NotificationsProvider>
				<ModalsProvider>
					<GlobalStateProvider>
						<Router>
							<Routes>
								<Route element={<ProtectedRoute />}>
									<Route index element={<Home />} />
								</Route>
								<Route path="auth" element={<Auth />} />
								<Route
									path="data-settings"
									element={<DataSettings />}
								/>
							</Routes>
						</Router>
					</GlobalStateProvider>
				</ModalsProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
}
