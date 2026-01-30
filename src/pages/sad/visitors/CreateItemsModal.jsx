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
import CreateItemForm from "../../../forms/items/CreateItemForm";

const CreateYearRangeModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader fontSize="lg" fontWeight="bold">
          Create Item
        </ModalHeader>
        <ModalBody>
          <CreateItemForm onSuccess={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateYearRangeModal;
