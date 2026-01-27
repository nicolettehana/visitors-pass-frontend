import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

const PhotoInput = ({ onChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Start camera when modal opens
  useEffect(() => {
    if (!isOpen) return;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [isOpen]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      onChange(
        new File([blob], "photo.jpg", {
          type: "image/jpeg",
        })
      );
      onClose();
    }, "image/jpeg");
  };

  return (
    <HStack spacing={4}>
      {/* Upload */}
      <Button as="label" leftIcon={<FaFileUpload />}>
        Upload Image
        <input
          hidden
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) =>
            onChange(e.target.files[0])
          }
        />
      </Button>

      {/* Capture */}
      <Button colorScheme="blue" onClick={onOpen} leftIcon={<FaCamera />}>
        Capture Image
      </Button>

      {/* Camera Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Capture Photo</ModalHeader>

          <ModalBody>
            <Box
              border="1px solid"
              borderColor="gray.200"
              rounded="md"
              overflow="hidden"
            >
              <video
                ref={videoRef}
                muted
                playsInline
                style={{ width: "100%" }}
              />
            </Box>

            <canvas ref={canvasRef} hidden />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={capturePhoto}>
              Capture
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default PhotoInput;
