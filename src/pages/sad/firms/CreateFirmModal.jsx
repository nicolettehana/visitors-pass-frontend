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
import CreateFirmForm from "../../../forms/firms/CreateFirmForm";

const CreateFirmModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Add New Firm
        </ModalHeader>
        <ModalBody>
          <CreateFirmForm onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateFirmModal;
