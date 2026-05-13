// File: src/components/landing/BenefitCard.tsx
import React from "react";
import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface BenefitCardProps {
  icon: IconType;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  description,
  stat,
  statLabel,
}) => (
  <Box
    p={7}
    borderRadius="20px"
    bg="rgba(255,255,255,0.032)"
    border="1px solid rgba(255,255,255,0.075)"
    backdropFilter="blur(12px)"
    position="relative"
    overflow="hidden"
    role="group"
    transition="all 0.3s ease"
    _hover={{
      bg: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(212,168,67,0.3)",
      transform: "translateY(-4px)",
      shadow: "0 20px 40px rgba(0,0,0,0.3)",
    }}
    _before={{
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "1px",
      bgGradient:
        "linear(to-r, transparent, rgba(212,168,67,0.5), transparent)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    }}
    sx={{
      "&:hover::before": { opacity: 1 },
    }}
  >
    <Box
      w="44px"
      h="44px"
      borderRadius="12px"
      bg="rgba(212,168,67,0.1)"
      border="1px solid rgba(212,168,67,0.2)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb={4}
      transition="all 0.3s ease"
      _groupHover={{ bg: "rgba(212,168,67,0.18)", transform: "scale(1.1)" }}
    >
      <Icon as={icon} color="#D4A843" boxSize={5} />
    </Box>

    <Text
      fontSize="md"
      fontWeight="700"
      color="white"
      mb={2}
      fontFamily="'Sora', sans-serif"
    >
      {title}
    </Text>
    <Text
      fontSize="sm"
      color="rgba(255,255,255,0.5)"
      lineHeight="1.7"
      fontFamily="'Lora', serif"
    >
      {description}
    </Text>

    {stat && (
      <Box mt={5} pt={5} borderTop="1px solid rgba(255,255,255,0.07)">
        <Text
          fontSize="2xl"
          fontWeight="800"
          color="#D4A843"
          fontFamily="'Sora', sans-serif"
          lineHeight={1}
        >
          {stat}
        </Text>
        <Text
          fontSize="xs"
          color="rgba(255,255,255,0.4)"
          mt={1}
          fontFamily="'Lora', serif"
        >
          {statLabel}
        </Text>
      </Box>
    )}
  </Box>
);
