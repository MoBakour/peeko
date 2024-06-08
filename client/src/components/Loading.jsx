import { useEffect, useState } from "react";
import Logo from "../assets/peeko-logo.png";

const Loading = () => {
	const [downtimeVisible, setDowntimeVisible] = useState(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDowntimeVisible(true);
		}, 3000);

		// clean up
		return () => {
			clearInterval(timeout);
		};
	}, []);

	return (
		<div className="bg-primary-3 min-h-svh flex justify-center items-center">
			<div className="relative">
				<img src={Logo} alt="Logo" className="loading-logo w-32" />

				<p
					className={`absolute -bottom-4 text-white text-center w-[200px] left-1/2 -translate-x-1/2 transition ${
						downtimeVisible ? "translate-y-full" : "opacity-0"
					}`}
				>
					Due to server downtime
					<br />
					this may take a minute
				</p>
			</div>
		</div>
	);
};

export default Loading;
