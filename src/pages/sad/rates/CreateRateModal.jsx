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
import CreateRateForm from "../../../forms/rates/CreateRateForm";

const CreateRateModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Add Rate
        </ModalHeader>
        <ModalBody>
          <CreateRateForm onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateRateModal;
