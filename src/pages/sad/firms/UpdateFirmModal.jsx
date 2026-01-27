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
import UpdateFirmForm from "../../../forms/firms/UpdateFirmForm";

const UpdateFirmModal = ({ id, firm, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Update Firm
        </ModalHeader>
        <ModalBody>
          <UpdateFirmForm id={id} firm={firm} onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UpdateFirmModal;
