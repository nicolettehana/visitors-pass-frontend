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
import InputField from "../../components/core/formik/InputField";
import { useNavigate } from "react-router-dom";
import { useGetPublicKey, useVerifyOtpLogin } from "../../hooks/authQueries";
import { encryptRSA } from "../../components/utils/security";

const OTPForm = ({ isOpen, onClose, token, values }) => {
  // Hooks
  const navigate = useNavigate();
  const toast = useToast();

  // Queries
  const publicKeyQuery = useGetPublicKey();
  const verifyQuery = useVerifyOtpLogin(
    (response) => {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("role", response.data.role);

      switch (response.data.role) {
        case "USER":
          navigate("/user/dashboard");
          break;
        case "CH":
          navigate("/ch/dashboard");
          break;
        case "EST":
          navigate("/est/dashboard");
          break;
        case "ADMIN":
          navigate("/admin/logs");
          break;
        default:
          break;
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
        description: error.response.data.detail,
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    mobileno: values?.username,
    otp: "",
    uuid: token,
  };

  const validationSchema = yup.object({
    otp: yup.string().required("OTP is required"),
  });

  const onSubmit = (values) => {
    const publicKey = publicKeyQuery?.data?.data?.publicKey;
    const formData = { ...values };

    formData.mobileno = encryptRSA(formData.mobileno, publicKey);

    verifyQuery.mutate(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader fontSize="lg" fontWeight="bold">
            OTP Verification
          </ModalHeader>

          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => (
              <Form>
                <ModalBody as={Stack}>
                  <InputField
                    name="otp"
                    label="OTP"
                    placeholder="Enter the OTP"
                  />
                </ModalBody>

                <ModalFooter as={HStack}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    w="full"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    w="full"
                    isLoading={verifyQuery.isPending}
                    loadingText="Verifying"
                  >
                    Verify
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default OTPForm;
