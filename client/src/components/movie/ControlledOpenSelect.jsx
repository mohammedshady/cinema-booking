import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useState } from "react";

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";

// const theme = createTheme({
//   palette: {
//     primary: {
//       light: "#FFFFFF",
//       main: "#FFFFFF",
//       dark: "#FFFFFF",
//       contrastText: "#FFFFFF",
//     },
//     secondary: {
//       light: "#FFFFFF",
//       main: "#FFFFFF",
//       dark: "#FFFFFF",
//       contrastText: "#FFFFFF",
//     },
//     text: {
//       light: "#FFFFFF",
//       main: "#FFFFFF",
//       dark: "#FFFFFF",
//       contrastText: "#FFFFFF",
//     },
//     background: {
//       light: "#FFFFFF",
//       main: "#FFFFFF",
//       dark: "#FFFFFF",
//       contrastText: "#FFFFFF",
//     },
//     common: {
//       light: "#FFFFFF",
//       main: "#FFFFFF",
//       dark: "#FFFFFF",
//       contrastText: "#FFFFFF",
//     },
//   },
// });

export default function ControlledOpenSelect({ options, sortSet, sortOption }) {
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    sortSet(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {/* <Button sx={{ display: "block", mt: 2 }} onClick={handleOpen}></Button> */}
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-controlled-open-select-label">
          {options.title}
        </InputLabel>
        <Select
          sx={{
            backgroundColor: "white",
          }}
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={sortOption}
          label={options.title}
          onChange={handleChange}
        >
          {options.arr.map((option) => (
            <MenuItem value={option.value}>{option.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
