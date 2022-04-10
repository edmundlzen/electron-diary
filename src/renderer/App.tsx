import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import './App.css';
import 'tailwindcss/tailwind.css';
// import { useEffect } from 'react';
// import fs from 'fs';
import { createContext, useContext, useEffect, useReducer } from 'react';
// eslint-disable-next-line import/no-cycle
import Auth from './pages/Auth';
import DataSettings from './pages/DataSettings';
// eslint-disable-next-line import/no-cycle
import ProtectedRoute from './components/ProtectedRoute';
// eslint-disable-next-line import/no-cycle
import Home from './pages/Home';
// eslint-disable-next-line import/no-cycle
import Journal from './pages/Journal/Journal';
// eslint-disable-next-line import/no-cycle
import NewJournal from './pages/Journal/NewJournal';
// eslint-disable-next-line import/no-cycle
import ViewJournal from './pages/Journal/ViewJournal';
import EditJournal from './pages/Journal/EditJournal';

interface JournalEntry {
	uid: string;
	title: string;
	content: string;
	createdAt: string;
	updatedAt?: string;
}

interface GlobalState {
	data: {
		journal: {
			entries: JournalEntry[] | null;
		} | null;
	} | null;
	password: string | null;
}

const defaultGlobalState: GlobalState = {
	data: null,
	password: null,
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
		(state: any, newValue: any) => ({
			...state,
			...newValue,
		}),
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
								<Route path="/" element={<ProtectedRoute />}>
									<Route index element={<Home />} />
									<Route
										path="journal"
										element={<Journal />}
									/>
									<Route
										path="journal/new"
										element={<NewJournal />}
									/>
									<Route
										path="journal/:uid"
										element={<ViewJournal />}
									/>
									<Route
										path="journal/:uid/edit"
										element={<EditJournal />}
									/>
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
