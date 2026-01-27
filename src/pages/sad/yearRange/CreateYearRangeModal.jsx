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
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import InputField from "../../../components/core/formik/InputField";
import { useCreateYearRange } from "../../../hooks/masterQueries";
import { useQueryClient } from "@tanstack/react-query";

const CreateYearRangeModal = ({ isOpen, onClose }) => {
  // Hooks
  const toast = useToast();

  const queryClient = useQueryClient();

  // Queires
  const createYearRange = useCreateYearRange(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-year-range"] });
      //navigate("/sad/year-range");
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Year Range added",
      });

      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to add Year Range.",
      });
      return error;
    }
  );

  // Formik initial values
  const initialValues = {
    startYear: "",
    endYear: "",
  };

  // Validation schema
  const validationSchema = yup.object({
    startYear: yup
      .number()
      .typeError("Start Year must be a number")
      .integer("Start Year must be a valid year")
      .required("Start Year is required"),

    endYear: yup
      .number()
      .typeError("End Year must be a number")
      .integer("End Year must be a valid year")
      .required("End Year is required")
      .min(
        yup.ref("startYear"),
        "End Year must be greater than or equal to Start Year"
      ),
  });

  // Submit handler
  const onSubmit = (values) => {
    createYearRange.mutate(values);
    console.log("Year Range Values:", values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Create Year Range
        </ModalHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              <ModalBody as={Stack} spacing={4}>
                <InputField
                  name="startYear"
                  label="Start Year"
                  placeholder="e.g. 2024"
                  type="number"
                />

                <InputField
                  name="endYear"
                  label="End Year"
                  placeholder="e.g. 2025"
                  type="number"
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
                  isLoading={createYearRange.isPending}
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

export default CreateYearRangeModal;
