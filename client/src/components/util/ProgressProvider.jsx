import React from "react";

const ProgressProvider = ({ valueStart, valueEnd, children }) => {
  const [value, setValue] = React.useState(valueStart);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setValue(valueEnd);
    }, 100);

    return () => clearTimeout(timer);
  }, [valueEnd]);

  return children(value);
};

export default ProgressProvider;
