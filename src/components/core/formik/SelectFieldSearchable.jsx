import React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { Field } from "formik";
import ReactSelect from "react-select";

const SelectFieldSearchable = ({
  name,
  label,
  isRequired = true,
  placeholder,
  disabled = false, // add this
  options = [],
}) => {
  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        const selectedOption =
          options.find((o) => o.value === field.value) || null;

        return (
          <FormControl
            isRequired={isRequired}
            isInvalid={meta.error && meta.touched}
          >
            <FormLabel htmlFor={name}>{label}</FormLabel>

            {/* 🔥 React Select replaces Chakra Select */}
            <ReactSelect
              id={name}
              options={options}
              value={selectedOption}
              placeholder={placeholder}
              isSearchable // 🔥 enables typing + searching
              isDisabled={disabled} // 🔥 use the prop here
              onChange={(option) =>
                form.setFieldValue(name, option ? option.value : "")
              }
              onBlur={() => form.setFieldTouched(name, true)}
            />

            <FormErrorMessage>{meta.error}</FormErrorMessage>
          </FormControl>
        );
      }}
    </Field>
  );
};

export default SelectFieldSearchable;
