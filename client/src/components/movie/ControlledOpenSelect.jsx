import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useState } from "react";

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { TextField } from "@mui/material";

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
    <TextField
      select
      sx={{
        width: { xs: 1, sm: 1, lg: 0.33, md: 0.33 },
        color: "white !important",
        "& label": {
          color: "white",
        },

        "& .MuiInput-underline:after": {
          borderBottomColor: "white",
        },
        "& .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#d0d0d0",
          },
          "& fieldset": {
            borderColor: "#d0d0d0",
          },
        },
        "& label.Mui-focused": {
          color: "white",
        },
      }}
      size="small"
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
        <MenuItem value={option.value} key={option.name}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
