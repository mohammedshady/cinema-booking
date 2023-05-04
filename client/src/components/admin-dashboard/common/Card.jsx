import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

const Card = (props) => {
	const { value, title } = props;
	return (
		<MuiCard
			sx={{
				borderRadius: "8px",
				"& pre": {
					m: 0,
					p: "16px !important",
					fontSize: "0.75rem",
				},
			}}
		>
			<CardHeader title={title} />

			<Divider />

			<CardContent sx={{ p: 2.25 }}>{value}</CardContent>
		</MuiCard>
	);
};

export default Card;
