import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import './App.css';
import 'tailwindcss/tailwind.css';
import Auth from './pages/Auth';
import DataSettings from './pages/DataSettings';

export default function App() {
	return (
		<MantineProvider>
			<NotificationsProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Auth />} />
						<Route
							path="data-settings"
							element={<DataSettings />}
						/>
					</Routes>
				</Router>
			</NotificationsProvider>
		</MantineProvider>
	);
}
