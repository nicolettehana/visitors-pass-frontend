import React from "react";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import InputField from "../../../components/core/formik/InputField";
import SelectField from "../../../components/core/formik/SelectField";
import { useFetchUnits, useFetchYearRange } from "../../../hooks/masterQueries";
import SelectFieldSearchable from "../../../components/core/formik/SelectFieldSearchable";
import { useAddRate } from "../../../hooks/ratesQueries";
import { useQueryClient } from "@tanstack/react-query";

const AddRateModal = ({
  isOpen,
  onClose,
  itemId,
  itemName,
  subItemId,
  subItemName,
  yearRangeId,
}) => {
  // Queries
  const { data: unitsData, isLoading: isUnitsLoading } = useFetchUnits();
  const unitsQuery = useFetchUnits();
  const yearRangeQuery = useFetchYearRange();

  const selectedYearRange = yearRangeQuery?.data?.data?.find((yr) => String(yr.id) === String(yearRangeId));

  const startYear = selectedYearRange?.startYear;
  const endYear = selectedYearRange?.endYear;

  const queryClient = useQueryClient();

  const addRate = useAddRate(
      (response) => {
        queryClient.invalidateQueries({ queryKey: ["rates"] });
        onClose();
        toast({
          isClosable: true,
          duration: 3000,
          position: "top-right",
          status: "success",
          title: "Success",
          description: response.data.detail || "Rate added",
        });
        // 👉 close modal if provided, otherwise navigate
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/sad/rates");
        }
        return response;
      },
      (error) => {
        toast({
          isClosable: true,
          duration: 3000,
          position: "top-right",
          status: "error",
          title: "Error",
          description: error.response.data.detail || "Unable to add rate.",
        });
        return error;
      }
    );


  // Formik initial values
  const initialValues = {
    itemName: itemName || "",
    subItemName: subItemName || "",
    unitId: "",
    rate: "",
    itemId: itemId,
    subItemId: subItemId,
    yearRangeId
  };

  // Validation schema
  const validationSchema = yup.object({
    unitId: yup.string().required("Unit is required"),
    rate: yup
      .number()
      .typeError("Rate must be a number")
      .required("Rate is required")
      .positive("Rate must be greater than zero"),
  });

  // Submit handler
  const onSubmit = (values) => {
    console.log("Add Rate Values:", values);
    addRate.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Add Rate for {startYear} - {endYear}
        </ModalHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {() => (
            <Form>
              <ModalBody as={Stack} spacing={4}>
                {/* Item Name (Read Only) */}
                <InputField
                  name="itemName"
                  label="Item Name"
                  isReadOnly
                />

                {/* Sub Item Name (Read Only, conditional) */}
                {subItemName && (
                  <InputField
                    name="subItemName"
                    label="Sub Item Name"
                    isReadOnly
                  />
                )}

                {/* Units Select */}
                {/* <SelectField
                  name="unitId"
                  label="Unit"
                  placeholder="Select unit"
                  isLoading={isUnitsLoading}
                  options={
                    unitsQuery?.data?.data?.map((unit) => ({
                      label: unit.unit,
                      value: unit.id,
                    })) || []
                  }
                /> */}
                <SelectFieldSearchable
                name="unitId"
                label="Unit"
                placeholder="Search unit"
                options={
                  unitsQuery?.data?.data?.map((row) => ({
                    value: row.id,
                    label: row.unit,
                  })) || []
                }
              />

                {/* Rate */}
                <InputField
                  name="rate"
                  label="Rate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate"
                />
              </ModalBody>

              <ModalFooter as={HStack}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  w="full"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="brand"
                  w="full"
                >
                  Submit
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddRateModal;
