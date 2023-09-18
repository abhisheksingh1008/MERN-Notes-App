import { useState } from "react";

const useInput = (getValueErrorMessage) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [valueErrorMessage, setValueErrorMessage] = useState(null);

  const enteredValueErrorMessage = getValueErrorMessage(enteredValue);

  const valueChangeHandler = (e) => {
    setEnteredValue(e.target.value);
  };

  const valueBlurHandler = () => {
    setValueErrorMessage(enteredValueErrorMessage);
  };

  const reset = (resetValue) => {
    setEnteredValue(resetValue);
  };

  return {
    value: enteredValue,
    valueErrorMessage,
    setValueErrorMessage,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  };
};

export default useInput;
