export const useInput = (initalValue, validator) => {
  const [value, setValue] = useState(initalValue);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    let willUpdate = true;

    if (typeof validator === "function") {
      willUpdate = validator(value);
    }

    if (willUpdate) {
      setValue(value);
    }
  };
  return { value, onChange };
};
