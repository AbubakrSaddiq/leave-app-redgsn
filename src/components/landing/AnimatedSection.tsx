// File: src/components/landing/AnimatedSection.tsx
import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import { useAnimatedVisibility } from "@/hooks/useAnimatedVisibility";

interface AnimatedSectionProps extends BoxProps {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  ...rest
}) => {
  const { ref, isVisible } = useAnimatedVisibility();

  return (
    <Box
      ref={ref}
      opacity={isVisible ? 1 : 0}
      transform={isVisible ? "translateY(0)" : "translateY(28px)"}
      transition={`opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`}
      {...rest}
    >
      {children}
    </Box>
  );
};
