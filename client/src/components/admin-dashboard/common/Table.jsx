import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RestoreIcon from "@mui/icons-material/Restore";
import UpdateIcon from "@mui/icons-material/Update";
import EditIcon from "@mui/icons-material/Edit";
import FormattedDate from "../../util/Date";
import Time from "../../util/Time";
import TableToolbar from "./TableToolbar";
import TableHead from "./TableHead";
import Title from "./Title";

const descendingComparator = (a, b, orderBy) => {
	return b[orderBy] < a[orderBy] ? -1 : b[orderBy] > a[orderBy] ? 1 : 0;
};

const getComparator = (order, orderBy) => {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
};

const sort = (array, comparator) => {
	return array
		.map((el, index) => [el, index])
		.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			return order !== 0 ? order : a[1] - b[1];
		})
		.map((el) => el[0]);
};

const Table = (props) => {
	const {
		data,
		headCells,
		historyStatus,
		onDelete,
		navigate,
		addLink,
		tableTitle,
		altTableTitle,
		showEdit,
		showSort,
		searchBy,
		showHeader,
		showCheckBox,
		noTitle,
	} = props;

	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState(headCells[0][["id"]]);
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [tableRows, setTableRows] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showHistory, setShowHistory] = useState(false);

	useEffect(() => {
		historyStatus
			? showHistory
				? setTableRows(data.filter((row) => row.status === historyStatus))
				: setTableRows(data.filter((row) => row.status !== historyStatus))
			: setTableRows(data);
	}, [historyStatus, showHistory, data]);

	const handleToggleHistory = () => {
		setShowHistory(!showHistory);
		setSearchTerm("");
	};

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		setSelected(event.target.checked ? tableRows.map((n) => n._id) : []);
	};

	const handleClick = (_id) => {
		if (showHistory) return;
		const selectedIndex = selected.indexOf(_id);
		const newSelected =
			selectedIndex === -1
				? [...selected, _id]
				: [
						...selected.slice(0, selectedIndex),
						...selected.slice(selectedIndex + 1),
				  ];
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableRows.length) : 0;

	const visibleRows = showSort
		? useMemo(
				() =>
					sort(tableRows, getComparator(order, orderBy)).slice(
						page * rowsPerPage,
						page * rowsPerPage + rowsPerPage
					),
				[order, orderBy, page, rowsPerPage, tableRows]
		  )
		: tableRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	return (
		<>
			{/* Page Title */}
			{!noTitle && <Title title={tableTitle} />}

			<Container sx={noTitle && { p: "0px!important" }}>
				<Box sx={!noTitle && { p: 7, width: 1, ml: 2.75 }}>
					<Paper
						sx={{
							width: "100%",
							mb: 2,
							borderRadius: "8px",
						}}
					>
						{/* Table Title, Search Input, Add/Delete Button */}
						<TableToolbar
							numSelected={selected.length}
							selected={selected}
							onDelete={onDelete}
							navigate={navigate}
							showHistory={showHistory}
							rows={data}
							setRows={setTableRows}
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							setSelected={setSelected}
							addLink={addLink}
							tableTitle={tableTitle}
							altTableTitle={altTableTitle}
							historyStatus={historyStatus}
							searchBy={searchBy}
							showCheckBox={showCheckBox}
						/>

						<TableContainer>
							<MuiTable size="medium">
								{/* Table Headers */}
								{showHeader && (
									<TableHead
										numSelected={selected.length}
										order={order}
										orderBy={orderBy}
										onSelectAllClick={handleSelectAllClick}
										onRequestSort={handleRequestSort}
										rowCount={tableRows.length}
										showHistory={showHistory}
										headCells={headCells}
										showSort={showSort}
										showEdit={showEdit}
										tableTitle={tableTitle}
										showCheckBox={showCheckBox}
									/>
								)}

								<TableBody>
									{visibleRows.map((row, index) => {
										const isItemSelected = isSelected(row._id);
										const labelId = row._id;
										return (
											<TableRow
												hover
												onClick={() => {
													showCheckBox && handleClick(row._id);
												}}
												role="checkbox"
												aria-checked={showCheckBox && isItemSelected}
												tabIndex={-1}
												key={index}
												selected={showCheckBox && isItemSelected}
												sx={{ cursor: "pointer", height: "73px" }}
											>
												{/* Checkbox */}
												{!showHistory && showCheckBox && (
													<TableCell padding="checkbox">
														<Checkbox
															color="primary"
															checked={isItemSelected}
															inputProps={{
																"aria-labelledby": labelId,
															}}
														/>
													</TableCell>
												)}

												{/* Numbering => # */}
												{showHeader && (
													<TableCell
														component="th"
														id={labelId}
														padding="none"
														align="right"
													>
														{index + 1}
													</TableCell>
												)}

												{/* Table Data */}
												{headCells.map((cell) => (
													<TableCell
														sx={
															cell.id === "message" && {
																wordBreak: "break-word",
																maxWidth: "410px",
															}
														}
														align="left"
													>
														{cell.id === "duration" ? (
															`${parseInt(row[cell.id] / 60)}h, ${parseInt(
																row[cell.id] % 60
															)}m`
														) : cell.id === "dateTime" ? (
															<>
																<FormattedDate date={row[cell.id]} />
																<Time time={row[cell.id]} />
															</>
														) : cell.id === "date" ? (
															<FormattedDate date={row[cell.id]} />
														) : (
															row[cell.id]
														)}
													</TableCell>
												))}

												{/* Edit Button */}
												{row.status !== "ended" && showEdit && (
													<TableCell align="left">
														<Tooltip title="Edit">
															<IconButton
																onClick={(e) => {
																	e.stopPropagation();
																	navigate(`update/${labelId}`);
																}}
															>
																<EditIcon />
															</IconButton>
														</Tooltip>
													</TableCell>
												)}
											</TableRow>
										);
									})}

									{/* Fill space if there is empty rows */}
									{emptyRows > 0 && (
										<TableRow
											sx={{
												height: 73 * emptyRows,
											}}
										>
											<TableCell colSpan={6} />
										</TableRow>
									)}
								</TableBody>
							</MuiTable>
						</TableContainer>

						<Box
							sx={{
								display: "inline-flex",
								width: 1,
								justifyContent: historyStatus ? "space-between" : "flex-end",
							}}
						>
							{/* History Icon */}
							{historyStatus && (
								<Tooltip
									title={
										showHistory ? `Active ${tableTitle}` : `${altTableTitle}`
									}
								>
									<IconButton
										sx={{ m: "6px 2px" }}
										onClick={handleToggleHistory}
									>
										{showHistory ? <UpdateIcon /> : <RestoreIcon />}
									</IconButton>
								</Tooltip>
							)}

							{/* Table Actions */}
							<TablePagination
								rowsPerPageOptions={[5, 10, 15, 20]}
								count={tableRows.length}
								component="div"
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Box>
					</Paper>
				</Box>
			</Container>
		</>
	);
};

export default Table;
