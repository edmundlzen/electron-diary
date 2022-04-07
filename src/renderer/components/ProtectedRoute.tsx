import { Navigate, Outlet } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import { useGlobalState } from '../App';

export default function ProtectedRoute() {
	const [state] = useGlobalState();

	if (!state.data) {
		return <Navigate to="/auth" />;
	}

	return <Outlet />;
}
