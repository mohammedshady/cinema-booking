import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import MuiTableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
import visuallyHidden from "@mui/utils/visuallyHidden";
import ImportExportIcon from "@mui/icons-material/ImportExport";

const TableHead = (props) => {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
		showHistory,
		headCells,
		showSort,
		showEdit,
		tableTitle,
		showCheckBox,
	} = props;

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<MuiTableHead>
			<TableRow>
				{/* Checkbox */}
				{!showHistory && showCheckBox && (
					<TableCell padding="checkbox">
						<Checkbox
							color="primary"
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={rowCount > 0 && numSelected === rowCount}
							onChange={onSelectAllClick}
						/>
					</TableCell>
				)}

				{/* Numbering */}
				<TableCell
					sx={showHistory && { width: "60px" }}
					align="right"
					padding="none"
				>
					#
				</TableCell>

				{/* Table Headers */}
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align="left"
						padding="normal"
						sortDirection={orderBy === headCell.id ? order : false}
					>
						{showSort ? (
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : "asc"}
								onClick={createSortHandler(headCell.id)}
								hideSortIcon
							>
								{headCell.label}
								{orderBy !== headCell.id && (
									<ImportExportIcon sx={{ color: "#ffffffb3" }} />
								)}
								{orderBy === headCell.id && (
									<Box component="span" sx={visuallyHidden}>
										{order === "desc"
											? "sorted descending"
											: "sorted ascending"}
									</Box>
								)}
							</TableSortLabel>
						) : (
							headCell.label
						)}
					</TableCell>
				))}

				{/* Edit Header => empty */}
				{showEdit && (!showHistory || tableTitle !== "Shows") && (
					<TableCell align="left" padding="normal"></TableCell>
				)}
			</TableRow>
		</MuiTableHead>
	);
};

export default TableHead;
