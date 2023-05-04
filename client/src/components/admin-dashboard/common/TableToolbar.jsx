import { useState, useEffect } from "react";
import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Search from "./Search";

const TableToolbar = (props) => {
	const {
		numSelected,
		onDelete,
		selected,
		navigate,
		showHistory,
		rows,
		setRows,
		searchTerm,
		setSearchTerm,
		setSelected,
		addLink,
		tableTitle,
		altTableTitle,
		historyStatus,
		searchBy,
		showCheckBox,
	} = props;

	const [searchRows, setSearchRows] = useState(rows);

	useEffect(() => {
		historyStatus
			? showHistory
				? setSearchRows(rows.filter((row) => row.status === historyStatus))
				: setSearchRows(rows.filter((row) => row.status !== historyStatus))
			: setSearchRows(rows);
	}, [showHistory, rows]);

	const handleDeleteClick = () => {
		onDelete(selected);
		setSelected([]);
	};

	const handleNavigate = () => {
		navigate(addLink);
	};

	const handleSearchChange = (e) => {
		const searchedVal = e.target.value;
		setSearchTerm(searchedVal);
		const filteredRows = searchRows.filter((row) => {
			return row[searchBy].toLowerCase().startsWith(searchedVal.toLowerCase());
		});
		setRows(filteredRows);
	};

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(
							theme.palette.primary.main,
							theme.palette.action.activatedOpacity
						),
				}),
			}}
		>
			{numSelected > 0 && showCheckBox ? (
				<>
					{/* Number of selected cells */}
					<Typography
						sx={{ flex: "1 1 100%" }}
						color="inherit"
						variant="subtitle1"
						component="div"
					>
						{numSelected} selected
					</Typography>

					{/* Delete Button */}
					<Tooltip title="Delete">
						<IconButton onClick={handleDeleteClick}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</>
			) : (
				<>
					{/* Table Title */}
					<Typography
						sx={{ flex: "1 1 100%" }}
						variant="h6"
						id="tableTitle"
						component="div"
					>
						{showHistory ? `${altTableTitle} Table` : `${tableTitle} Table`}
					</Typography>

					{/* Search Input */}
					{searchBy && (
						<Search value={searchTerm} onChange={handleSearchChange} />
					)}

					{/* Add Button */}
					{addLink && (
						<Tooltip title={`Add a ${tableTitle}`}>
							<IconButton onClick={handleNavigate}>
								<AddCircleOutlineIcon />
							</IconButton>
						</Tooltip>
					)}
				</>
			)}
		</Toolbar>
	);
};

export default TableToolbar;
