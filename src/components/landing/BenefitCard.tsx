// File: src/components/landing/BenefitCard.tsx (UPDATED with NASENI brand)
import React from "react";
import { Box, Icon, Text } from "@chakra-ui/react";
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
  <Box variant="landing-benefit" role="group">
    <Box
      w="44px"
      h="44px"
      borderRadius="12px"
      bg="landing.brand.glow"
      border="1px solid"
      borderColor="landing.border.brandLight"
      display="flex"
      alignItems="center"
      justifyContent="center"
      mb={4}
      transition="all 0.3s ease"
      _groupHover={{ bg: "rgba(64,126,189,0.25)", transform: "scale(1.1)" }}
    >
      <Icon as={icon} color="landing.brand.light" boxSize={5} />
    </Box>

    <Text
      fontSize="md"
      fontWeight="700"
      color="landing.text.primary"
      mb={2}
      fontFamily="'Sora', sans-serif"
    >
      {title}
    </Text>
    <Text
      fontSize="sm"
      color="landing.text.quaternary"
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
          color="landing.brand.light"
          fontFamily="'Sora', sans-serif"
          lineHeight={1}
        >
          {stat}
        </Text>
        <Text
          fontSize="xs"
          color="landing.text.muted"
          mt={1}
          fontFamily="'Lora', serif"
        >
          {statLabel}
        </Text>
      </Box>
    )}
  </Box>
);
