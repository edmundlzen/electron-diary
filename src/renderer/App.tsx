import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import './App.css';
import 'tailwindcss/tailwind.css';
import Auth from './pages/Auth';
import DataSettings from './pages/DataSettings';

export default function App() {
	return (
		<MantineProvider>
			<NotificationsProvider>
				<ModalsProvider>
					<Router>
						<Routes>
							<Route path="/" element={<Auth />} />
							<Route
								path="data-settings"
								element={<DataSettings />}
							/>
						</Routes>
					</Router>
				</ModalsProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
}
