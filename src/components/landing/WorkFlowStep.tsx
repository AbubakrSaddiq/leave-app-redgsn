// File: src/components/landing/WorkflowStep.tsx (UPDATED with NASENI brand)
import React from "react";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface WorkflowStepProps {
  number: string;
  title: string;
  description: string;
  icon: IconType;
  isLast?: boolean;
}

export const WorkflowStep: React.FC<WorkflowStepProps> = ({
  number,
  title,
  description,
  icon,
  isLast,
}) => (
  <Flex gap={5} align="flex-start" position="relative">
    {!isLast && (
      <Box
        position="absolute"
        left="27px"
        top="56px"
        width="2px"
        height="calc(100% + 16px)"
        bgGradient="landing.gradients.connector"
        zIndex={0}
      />
    )}

    <Box flexShrink={0} position="relative" zIndex={1}>
      <Box
        w="56px"
        h="56px"
        borderRadius="14px"
        bg="landing.brand.glow"
        border="1.5px solid"
        borderColor="landing.border.brand"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        _before={{
          content: `"${number}"`,
          position: "absolute",
          top: "-8px",
          right: "-8px",
          w: "20px",
          h: "20px",
          borderRadius: "full",
          bg: "landing.brand.500",
          color: "white",
          fontSize: "10px",
          fontWeight: "800",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <Icon as={icon} color="landing.brand.light" boxSize={5} />
      </Box>
    </Box>

    <Box pb={8}>
      <Text
        fontSize="sm"
        fontWeight="700"
        color="landing.text.primary"
        letterSpacing="0.02em"
        mb={1}
        fontFamily="'Sora', sans-serif"
      >
        {title}
      </Text>
      <Text
        fontSize="sm"
        color="landing.text.tertiary"
        lineHeight="1.65"
        fontFamily="'Lora', serif"
      >
        {description}
      </Text>
    </Box>
  </Flex>
);
