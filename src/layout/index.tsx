import { Outlet } from 'react-router-dom';

export function Layout() {
	return (
		<div className="min-h-screen bg-[#111210] text-[#F1F2EC] antialiased">
			<Outlet />
		</div>
	);
}
