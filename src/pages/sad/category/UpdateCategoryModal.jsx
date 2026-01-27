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
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateCategory } from "../../../hooks/masterQueries";

const UpdateCategoryModal = ({ isOpen, onClose, code, name}) => {
  // Hooks
  const toast = useToast();

  const queryClient = useQueryClient();

  // Queires
  const updateCategory = useUpdateCategory(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-categories"] });
      //navigate("/sad/year-range");
      onClose();
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Category updated",
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
        description: error.response.data.detail || "Unable to update Category.",
      });
      return error;
    }
  );

  // Formik initial values
  const initialValues = {
    name: name,
    code: code,
  };

  // Validation schema
  const validationSchema = yup.object({
    name: yup.string().required("Category is required"),
    code: yup
      .string()
      .length(1, "Category Code must be exactly one character")
      .required("Category Code is required"),
  });

  // Submit handler
  const onSubmit = (values) => {
    console.log(values);
    updateCategory.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Create Category
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
                  name="code"
                  label="Category Code"
                  placeholder="Enter one character"
                  maxLength={1}
                  isReadOnly
                />
                <InputField
                  name="name"
                  label="Category"
                  placeholder="Enter category"
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
                  isLoading={updateCategory.isPending}
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

export default UpdateCategoryModal;
