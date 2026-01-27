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
import { useCreateUnit } from "../../../hooks/masterQueries";
import { useQueryClient } from "@tanstack/react-query";

const CreateUnitModal = ({ isOpen, onClose }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Query (you may want to rename this hook later)
  const createUnit = useCreateUnit(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-units"] });
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Unit created successfully",
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
        description: error.response.data.detail || "Unable to create unit.",
      });
      return error;
    }
  );

  // Formik initial values
  const initialValues = {
    unit: "",
    name: "",
  };

  // Validation schema
  const validationSchema = yup.object({
    unit: yup.string().required("Unit of Measure is required"),

    name: yup.string().required("Unit Format is required"),
  });

  // Submit handler
  const onSubmit = (values) => {
    createUnit.mutate(values);
    console.log("Unit Values:", values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Create Unit
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
                  name="unit"
                  label="Unit of Measure"
                  placeholder="e.g. Each, Per Ream, Per Dozen"
                />

                <InputField
                  name="name"
                  label="Unit Format"
                  placeholder="e.g. each, ream/s, dozen/s"
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
                  isLoading={createUnit.isPending}
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

export default CreateUnitModal;
