import {
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  useGetOTPSignUp,
  useGetPublicKey,
  useRegisterUser,
  useVerifyOTPSignUp,
} from "../../hooks/authQueries";
import RegisteredSuccessModal from "../../pages/auth/register/RegisteredSuccessModal";
import { encryptRSA } from "../../components/utils/security";
import * as yup from "yup";
import { Form, Formik } from "formik";
import InputField from "../../components/core/formik/InputField";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { useState } from "react";

const VerifyOtpForm = ({ formData, otpToken }) => {
  // Hooks
  const toast = useToast();

  // States
  const [reOtpToken, setReOtpToken] = useState("");

  // Disclosures
  const successDisclosure = useDisclosure();

  // Timer
  const expiryTimestamp = dayjs().add(3, "s").toDate();
  const timer = useTimer({
    expiryTimestamp,
    onExpire: () => {
      return;
    },
  });

  // Queries
  const publicKeyQuery = useGetPublicKey();
  const otpQuery = useGetOTPSignUp(
    (response) => {
      setReOtpToken(response.data.otpToken);
      timer.restart(dayjs().add(3, "s").toDate());
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.message || "OTP Sent",
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
        description: error.response.data.detail,
      });

      return error;
    }
  );
  const verifyQuery = useVerifyOTPSignUp(
    (response) => {
      successDisclosure.onOpen();
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
    otp: "",
    // UNCOMMENT:
    captcha: formData.captcha,
    uuid: formData.captchaToken,
    mobileno: formData.mobileNo,
  };

  const validationSchema = yup.object({
    otp: yup
      .number()
      .typeError("OTP should contain only numbers")
      .required("OTP is required"),
    // UNCOMMENT:
    captcha: yup.string().required("Captcha is required"),
    uuid: yup.string().required("Captcha token is required"),
    mobileno: yup
      .string()
      .matches(/^\d{10}$/, "Please enter a valid mobile number")
      .required("Mobile number is required"),
  });

  const onSubmit = (values) => {
    const publicKey = publicKeyQuery?.data?.data?.publicKey;

    const verifyFormData = {
      ...formData,
      otp: values.otp,
      otpToken: reOtpToken ? reOtpToken : otpToken,
    };

    verifyFormData.mobileNo = encryptRSA(formData.mobileNo, publicKey);
    verifyFormData.password = encryptRSA(formData.password, publicKey);
    delete verifyFormData.confirmPassword;

    verifyQuery.mutate(verifyFormData);
  };

  // Handlers
  const handleResendOtp = () => {
    const publicKey = publicKeyQuery?.data?.data?.publicKey;

    if (timer.totalSeconds !== 0) return;
    otpQuery.mutate({
      captcha: formData.captcha,
      uuid: formData.captchaToken,
      isSignUp: 1,
      mobileno: encryptRSA(formData.mobileNo, publicKey),
    });
  };

  return (
    <div>
      {/* Modals */}
      <RegisteredSuccessModal
        isOpen={successDisclosure.isOpen}
        onClose={successDisclosure.onClose}
      />

      {/* Form */}
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <Stack as={Form} spacing={4}>
              <Stack>
                <Heading size="md">Verify OTP</Heading>
                <Text color="body">
                  Enter the otp sent to {formData.mobileNo}
                </Text>
              </Stack>

              <InputField name="otp" label="OTP" placeholder="Enter the OTP" />

              <Button
                type="submit"
                variant="brand"
                isLoading={verifyQuery.isPending}
                loadingText="Verifying"
              >
                Verify
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={timer.totalSeconds !== 0}
                isLoading={otpQuery.isPending}
                loadingText="Sending OTP"
              >
                {timer.totalSeconds > 0
                  ? `You can resend OTP in: ${timer.totalSeconds} sec`
                  : "Resend OTP"}
              </Button>
            </Stack>
          );
        }}
      </Formik>
    </div>
  );
};

export default VerifyOtpForm;
