import { Form, Formik, FieldArray } from "formik";
import * as yup from "yup";
import {
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useUpdateFirm } from "../../hooks/firmQueries";
import { useFetchCategories } from "../../hooks/masterQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const UpdateFirmForm = ({ id, firm, onSuccess }) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const categoryQuery = useFetchCategories();

  const updateFirm = useUpdateFirm(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["firms"] });
      navigate("/sad/firms");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Firm updated",
      });
      // 👉 close modal if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/sad/firms");
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
        description: error.response.data.detail || "Unable to update firm.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    id:id,
    firm: firm || "",
    enableReinitialize: true,
  };

  const validationSchema = yup.object({

    firm: yup.string().required("Firm name is required"),
   
  });

  const onSubmit = (values) => {
    const formData = { ...values };

    updateFirm.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Stack as={Form} spacing={8}>
            <SimpleGrid columns={{ base: 1, md: 1 }} gap={4}>
              <InputField
                name="firm"
                label="Firm Name"
                // value={values.firm}  
                // onChange={formik.handleChange}
              />
            </SimpleGrid>

            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={
                  updateFirm.isPending 
                }
                loadingText="Saving"
              >
                Update Firm
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default UpdateFirmForm;
