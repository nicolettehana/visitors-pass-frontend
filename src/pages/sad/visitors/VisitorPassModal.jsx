import { useEffect, useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Spinner,
  Flex,
  Text,
  Spacer,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useFetchVisitorPass } from "../../../hooks/visitorQueries";

const VisitorPassModal = ({
  isOpen,
  onClose,
  visitorCode,
  vPassNo,
  initialBlob,
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const iframeRef = useRef(null);

  const { data: fetchedBlob, isLoading } = useFetchVisitorPass(
    visitorCode,
    !initialBlob && isOpen,
  );

  useEffect(() => {
    if (!initialBlob && !fetchedBlob) return;

    let blob;

    if (initialBlob) {
      blob = initialBlob;
    } else if (fetchedBlob) {
      // If fetchedBlob is ArrayBuffer or Uint8Array
      blob = new Blob([fetchedBlob], { type: "application/pdf" });
    }

    const url = URL.createObjectURL(blob);
    setPdfUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [initialBlob, fetchedBlob]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${vPassNo}.pdf`;
    a.click();
  };

  const handlePrint = () => {
    if (!iframeRef.current) return;

    iframeRef.current.contentWindow?.focus();
    iframeRef.current.contentWindow?.print();
  };

  // const handlePrint = () => {
  //   if (!pdfUrl) return;
  //   const w = window.open(pdfUrl);
  //   w?.print();
  // };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>Visitor Pass</ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0}>
          {isLoading || !pdfUrl ? (
            <Flex h="500px" align="center" justify="center" direction="column">
              <Spinner size="xl" />
              <Text mt={3}>Loading visitor pass...</Text>
            </Flex>
          ) : (
            <iframe
              ref={iframeRef}
              src={pdfUrl}
              width="100%"
              height="620px"
              style={{ border: "none" }}
              title="Visitor Pass"
            />
          )}
        </ModalBody>

        <ModalFooter
          gap={3}
          bg="gray.50" // solid background
          borderTop="1px solid" // optional top border
          borderColor="gray.200"
        >
          <Button onClick={handleDownload} isDisabled={!pdfUrl} variant="brand">
            Download
          </Button>
          <Button onClick={handlePrint} isDisabled={!pdfUrl} variant="brand">
            Print
          </Button>
          {/* <Spacer />
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VisitorPassModal;
