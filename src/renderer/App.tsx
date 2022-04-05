import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import 'tailwindcss/tailwind.css';

const Hello = () => {
	return (
		<div>
			<div className="flex flex-col items-center justify-center h-screen">
				<img src={icon} alt="icon" className={'w-32 h-32'} />
				<h1 className="text-center text-3xl font-bold">Hello World</h1>
			</div>
		</div>
	);
};

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Hello />} />
			</Routes>
		</Router>
	);
}
