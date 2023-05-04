import BackButton from "./BackButton";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = ({ msg }) => {
	return (
		<div className="h-[100vh] flex justify-center items-center relative">
			{msg === "loading" ? (
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open
				>
					<CircularProgress color="inherit" />
				</Backdrop>
			) : (
				<>
					<BackButton />
					<h1 className="text-4xl font-extrabold">Something went wrong 💥</h1>
				</>
			)}
		</div>
	);
};

export default Loader;
