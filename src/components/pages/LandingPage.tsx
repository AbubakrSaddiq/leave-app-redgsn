import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { keyframes } from "@emotion/react";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiFileText,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
  FiCalendar,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import { LoginForm } from "@/components/auth/LoginForm";

// ─── Animations ────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-12px) rotate(1deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.8; transform: scale(1.05); }
`;

// ─── Types ──────────────────────────────────────────────────────────────────

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  [key: string]: any;
}

// ─── Animated wrapper (intersection-observer fade-up) ───────────────────────

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(28px)"}
      transition={`opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`}
      {...rest}
    >
      {children}
    </Box>
  );
};

// ─── Workflow Step ───────────────────────────────────────────────────────────

interface WorkflowStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  number,
  title,
  description,
  icon,
  isLast,
}) => (
  <Flex gap={5} align="flex-start" position="relative">
    {/* Connector line */}
    {!isLast && (
      <Box
        position="absolute"
        left="27px"
        top="56px"
        width="2px"
        height="calc(100% + 16px)"
        bgGradient="linear(to-b, #D4A843, transparent)"
        zIndex={0}
      />
    )}

    {/* Step icon */}
    <Box flexShrink={0} position="relative" zIndex={1}>
      <Box
        w="56px"
        h="56px"
        borderRadius="14px"
        bg="rgba(212,168,67,0.12)"
        border="1.5px solid rgba(212,168,67,0.35)"
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
          bg: "#D4A843",
          color: "#0D1B3E",
          fontSize: "10px",
          fontWeight: "800",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <Icon as={icon} color="#D4A843" boxSize={5} />
      </Box>
    </Box>

    {/* Content */}
    <Box pb={8}>
      <Text
        fontSize="sm"
        fontWeight="700"
        color="white"
        letterSpacing="0.02em"
        mb={1}
        fontFamily="'Sora', sans-serif"
      >
        {title}
      </Text>
      <Text
        fontSize="sm"
        color="rgba(255,255,255,0.55)"
        lineHeight="1.65"
        fontFamily="'Lora', serif"
      >
        {description}
      </Text>
    </Box>
  </Flex>
);

// ─── Benefit Card ────────────────────────────────────────────────────────────

interface BenefitCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
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

// ─── Main Landing Page ───────────────────────────────────────────────────────

export const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080f22; }
        ::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.4); border-radius: 3px; }
      `}</style>

      <Box
        minH="100vh"
        bg="#080f22"
        fontFamily="'Sora', sans-serif"
        overflowX="hidden"
      >
        {/* ── Background atmosphere ── */}
        <Box
          position="fixed"
          inset={0}
          zIndex={0}
          pointerEvents="none"
          overflow="hidden"
        >
          {/* Radial glow top-right */}
          <Box
            position="absolute"
            top="-15%"
            right="-10%"
            w="700px"
            h="700px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(212,168,67,0.07) 0%, transparent 70%)"
            animation={`${pulse} 8s ease-in-out infinite`}
          />
          {/* Radial glow bottom-left */}
          <Box
            position="absolute"
            bottom="-10%"
            left="-5%"
            w="500px"
            h="500px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(29,78,178,0.12) 0%, transparent 70%)"
            animation={`${pulse} 10s ease-in-out infinite 2s`}
          />
          {/* Subtle grid */}
          <Box
            position="absolute"
            inset={0}
            opacity={0.018}
            backgroundImage="linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)"
            backgroundSize="60px 60px"
          />
        </Box>

        {/* ── NAV ── */}
        <Box
          as="nav"
          position="sticky"
          top={0}
          zIndex={100}
          borderBottom="1px solid rgba(255,255,255,0.06)"
          bg="rgba(8,15,34,0.85)"
          backdropFilter="blur(20px)"
        >
          <Container maxW="1200px" py={4}>
            <Flex justify="space-between" align="center">
              <HStack spacing={3}>
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="10px"
                  bg="linear-gradient(135deg, #D4A843 0%, #B8862A 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  shadow="0 4px 12px rgba(212,168,67,0.4)"
                >
                  <Icon as={FiLayers} color="white" boxSize={4} />
                </Box>
                <VStack spacing={0} align="flex-start">
                  <Text
                    fontSize="sm"
                    fontWeight="800"
                    color="white"
                    lineHeight={1}
                    letterSpacing="0.03em"
                  >
                    NASENI
                  </Text>
                  <Text
                    fontSize="9px"
                    color="rgba(212,168,67,0.8)"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                    fontFamily="'DM Mono', monospace"
                  >
                    Leave Portal
                  </Text>
                </VStack>
              </HStack>

              <Button
                size="sm"
                onClick={onOpen}
                bg="transparent"
                border="1px solid rgba(212,168,67,0.4)"
                color="#D4A843"
                fontFamily="'Sora', sans-serif"
                fontWeight="600"
                fontSize="xs"
                letterSpacing="0.05em"
                px={5}
                borderRadius="8px"
                transition="all 0.2s"
                _hover={{
                  bg: "rgba(212,168,67,0.1)",
                  border: "1px solid rgba(212,168,67,0.8)",
                  shadow: "0 0 20px rgba(212,168,67,0.15)",
                }}
                rightIcon={<FiArrowRight />}
              >
                Sign In
              </Button>
            </Flex>
          </Container>
        </Box>

        {/* ── HERO ── */}
        <Box
          position="relative"
          zIndex={1}
          pt={{ base: 20, md: 28 }}
          pb={{ base: 16, md: 24 }}
        >
          <Container maxW="1200px">
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={16}
              alignItems="center"
            >
              {/* Left — copy */}
              <GridItem>
                <Box
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(212,168,67,0.08)"
                  border="1px solid rgba(212,168,67,0.22)"
                  mb={6}
                  animation={`${fadeIn} 0.6s ease both`}
                >
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="#D4A843"
                    animation={`${pulse} 2s ease-in-out infinite`}
                  />
                  <Text
                    fontSize="11px"
                    fontWeight="600"
                    color="rgba(212,168,67,0.9)"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    fontFamily="'DM Mono', monospace"
                  >
                    Leave Management System
                  </Text>
                </Box>

                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="800"
                  color="white"
                  lineHeight="1.12"
                  letterSpacing="-0.02em"
                  mb={6}
                  fontFamily="'Sora', sans-serif"
                  animation={`${fadeUp} 0.7s ease 0.1s both`}
                >
                  Streamlined leave
                  <br />
                  <Box
                    as="span"
                    bgGradient="linear(to-r, #D4A843, #F0C96A, #D4A843)"
                    bgClip="text"
                    backgroundSize="200% auto"
                    animation={`${shimmer} 4s linear infinite`}
                  >
                    for every NASENI
                  </Box>
                  <br />
                  staff member.
                </Heading>

                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  color="rgba(255,255,255,0.55)"
                  lineHeight="1.75"
                  mb={10}
                  maxW="480px"
                  fontFamily="'Lora', serif"
                  animation={`${fadeUp} 0.7s ease 0.2s both`}
                >
                  A centralized platform replacing paper forms and email chains.
                  Apply, track, and approve leave requests — transparently and
                  efficiently — across all departments.
                </Text>

                <HStack spacing={4} animation={`${fadeUp} 0.7s ease 0.3s both`}>
                  <Button
                    size="lg"
                    onClick={onOpen}
                    bg="linear-gradient(135deg, #D4A843 0%, #B8862A 100%)"
                    color="#0D1B3E"
                    fontFamily="'Sora', sans-serif"
                    fontWeight="700"
                    fontSize="sm"
                    letterSpacing="0.04em"
                    px={8}
                    h="52px"
                    borderRadius="12px"
                    shadow="0 8px 24px rgba(212,168,67,0.35)"
                    transition="all 0.25s ease"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "0 12px 32px rgba(212,168,67,0.5)",
                      bg: "linear-gradient(135deg, #E0B54F 0%, #C49130 100%)",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    rightIcon={<FiArrowRight />}
                  >
                    Access Dashboard
                  </Button>

                  <Button
                    size="lg"
                    as="a"
                    href="#workflow"
                    variant="ghost"
                    color="rgba(255,255,255,0.5)"
                    fontFamily="'Sora', sans-serif"
                    fontWeight="500"
                    fontSize="sm"
                    h="52px"
                    borderRadius="12px"
                    _hover={{ color: "white", bg: "rgba(255,255,255,0.05)" }}
                  >
                    See how it works
                  </Button>
                </HStack>

                {/* Trust signals */}
                <HStack
                  mt={10}
                  spacing={6}
                  animation={`${fadeUp} 0.7s ease 0.4s both`}
                >
                  {[
                    { label: "6 leave types", icon: FiCalendar },
                    { label: "4 staff roles", icon: FiUsers },
                    { label: "Instant approvals", icon: FiZap },
                  ].map((item) => (
                    <HStack key={item.label} spacing={1.5}>
                      <Icon
                        as={item.icon}
                        color="rgba(212,168,67,0.6)"
                        boxSize={3.5}
                      />
                      <Text
                        fontSize="xs"
                        color="rgba(255,255,255,0.38)"
                        fontFamily="'DM Mono', monospace"
                        letterSpacing="0.04em"
                      >
                        {item.label}
                      </Text>
                    </HStack>
                  ))}
                </HStack>
              </GridItem>

              {/* Right — floating dashboard mockup */}
              <GridItem display={{ base: "none", lg: "block" }}>
                <Box
                  position="relative"
                  animation={`${float} 6s ease-in-out infinite`}
                >
                  {/* Main card */}
                  <Box
                    borderRadius="24px"
                    bg="rgba(255,255,255,0.04)"
                    border="1px solid rgba(255,255,255,0.1)"
                    backdropFilter="blur(20px)"
                    p={6}
                    shadow="0 40px 80px rgba(0,0,0,0.5)"
                    overflow="hidden"
                    position="relative"
                  >
                    {/* Fake header */}
                    <HStack mb={5} spacing={2}>
                      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                        <Box
                          key={c}
                          w="10px"
                          h="10px"
                          borderRadius="full"
                          bg={c}
                        />
                      ))}
                      <Box flex={1} />
                      <Box
                        px={3}
                        py={1}
                        borderRadius="full"
                        bg="rgba(212,168,67,0.12)"
                        border="1px solid rgba(212,168,67,0.2)"
                      >
                        <Text
                          fontSize="9px"
                          color="#D4A843"
                          fontFamily="'DM Mono', monospace"
                        >
                          Leave Dashboard
                        </Text>
                      </Box>
                    </HStack>

                    {/* Balance bars */}
                    <Text
                      fontSize="xs"
                      color="rgba(255,255,255,0.35)"
                      mb={3}
                      fontFamily="'DM Mono', monospace"
                      letterSpacing="0.08em"
                    >
                      LEAVE BALANCES — 2025
                    </Text>
                    {[
                      {
                        label: "Annual Leave",
                        pct: 72,
                        color: "#3B82F6",
                        days: "21.6 days",
                      },
                      {
                        label: "Casual Leave",
                        pct: 43,
                        color: "#10B981",
                        days: "3 days",
                      },
                      {
                        label: "Sick Leave",
                        pct: 20,
                        color: "#EF4444",
                        days: "2 days",
                      },
                      {
                        label: "Study Leave",
                        pct: 90,
                        color: "#D4A843",
                        days: "4 yrs",
                      },
                    ].map((item) => (
                      <Box key={item.label} mb={3.5}>
                        <Flex justify="space-between" mb={1.5}>
                          <Text
                            fontSize="11px"
                            color="rgba(255,255,255,0.6)"
                            fontFamily="'Sora', sans-serif"
                          >
                            {item.label}
                          </Text>
                          <Text
                            fontSize="11px"
                            color="rgba(255,255,255,0.35)"
                            fontFamily="'DM Mono', monospace"
                          >
                            {item.days}
                          </Text>
                        </Flex>
                        <Box
                          h="5px"
                          borderRadius="full"
                          bg="rgba(255,255,255,0.06)"
                          overflow="hidden"
                        >
                          <Box
                            h="full"
                            borderRadius="full"
                            bg={item.color}
                            w={`${item.pct}%`}
                            opacity={0.75}
                          />
                        </Box>
                      </Box>
                    ))}

                    {/* Recent application chip */}
                    <Box
                      mt={5}
                      p={3.5}
                      borderRadius="12px"
                      bg="rgba(212,168,67,0.07)"
                      border="1px solid rgba(212,168,67,0.15)"
                    >
                      <Flex justify="space-between" align="center">
                        <VStack spacing={0.5} align="flex-start">
                          <Text
                            fontSize="11px"
                            fontWeight="700"
                            color="white"
                            fontFamily="'Sora', sans-serif"
                          >
                            Annual Leave · 5 days
                          </Text>
                          <Text
                            fontSize="10px"
                            color="rgba(255,255,255,0.4)"
                            fontFamily="'Lora', serif"
                          >
                            Dec 23 — Dec 27, 2025
                          </Text>
                        </VStack>
                        <Box
                          px={2.5}
                          py={1}
                          borderRadius="full"
                          bg="rgba(16,185,129,0.15)"
                          border="1px solid rgba(16,185,129,0.3)"
                        >
                          <Text
                            fontSize="9px"
                            fontWeight="700"
                            color="#10B981"
                            fontFamily="'DM Mono', monospace"
                            letterSpacing="0.06em"
                          >
                            APPROVED
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>

                  {/* Floating badge — Director approved */}
                  <Box
                    position="absolute"
                    top="-16px"
                    right="-20px"
                    px={3.5}
                    py={2}
                    borderRadius="12px"
                    bg="rgba(16,185,129,0.12)"
                    border="1px solid rgba(16,185,129,0.25)"
                    backdropFilter="blur(12px)"
                    shadow="0 8px 24px rgba(0,0,0,0.3)"
                  >
                    <HStack spacing={2}>
                      <Icon as={FiCheckCircle} color="#10B981" boxSize={3.5} />
                      <Text
                        fontSize="10px"
                        color="#10B981"
                        fontWeight="600"
                        fontFamily="'DM Mono', monospace"
                      >
                        Director approved
                      </Text>
                    </HStack>
                  </Box>

                  {/* Floating badge — pending */}
                  <Box
                    position="absolute"
                    bottom="-14px"
                    left="-24px"
                    px={3.5}
                    py={2}
                    borderRadius="12px"
                    bg="rgba(212,168,67,0.1)"
                    border="1px solid rgba(212,168,67,0.25)"
                    backdropFilter="blur(12px)"
                    shadow="0 8px 24px rgba(0,0,0,0.3)"
                  >
                    <HStack spacing={2}>
                      <Icon as={FiClock} color="#D4A843" boxSize={3.5} />
                      <Text
                        fontSize="10px"
                        color="#D4A843"
                        fontWeight="600"
                        fontFamily="'DM Mono', monospace"
                      >
                        2 awaiting HR review
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </Container>
        </Box>

        {/* ── WORKFLOW ── */}
        <Box
          id="workflow"
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 24 }}
          borderTop="1px solid rgba(255,255,255,0.05)"
        >
          <Container maxW="1200px">
            <AnimatedSection>
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={2}
                align={{ base: "flex-start", md: "center" }}
                mb={3}
              >
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color="rgba(212,168,67,0.7)"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  fontFamily="'DM Mono', monospace"
                >
                  How it works
                </Text>
              </Flex>
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="800"
                color="white"
                mb={3}
                fontFamily="'Sora', sans-serif"
                letterSpacing="-0.02em"
              >
                A clear, two-stage approval flow
              </Heading>
              <Text
                fontSize="md"
                color="rgba(255,255,255,0.45)"
                mb={14}
                maxW="520px"
                fontFamily="'Lora', serif"
                lineHeight="1.7"
              >
                Every leave request follows a transparent, documented journey
                from application to final approval — no lost emails, no
                ambiguity.
              </Text>
            </AnimatedSection>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={16}>
              {/* Staff workflow */}
              <AnimatedSection delay={100}>
                <Box
                  mb={6}
                  pb={4}
                  borderBottom="1px solid rgba(255,255,255,0.08)"
                >
                  <Text
                    fontSize="xs"
                    color="rgba(212,168,67,0.6)"
                    fontFamily="'DM Mono', monospace"
                    letterSpacing="0.14em"
                    textTransform="uppercase"
                    mb={1}
                  >
                    For Staff & Directors
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="700"
                    color="white"
                    fontFamily="'Sora', sans-serif"
                  >
                    Applying for Leave
                  </Text>
                </Box>

                <WorkflowStep
                  number="1"
                  icon={FiCalendar}
                  title="Select leave type & dates"
                  description="Choose from Annual, Casual, Sick, Maternity, Paternity, or Study leave. Working days are calculated automatically, excluding weekends and public holidays."
                />
                <WorkflowStep
                  number="2"
                  icon={FiFileText}
                  title="Submit with reason"
                  description="Provide a reason and review your calculated resumption date before submitting. The system validates against your available balance in real time."
                />
                <WorkflowStep
                  number="3"
                  icon={FiClock}
                  title="Track your application"
                  description="Monitor your application status — Pending Director, Pending HR, Approved, or Rejected — from your personal dashboard at any time."
                />
                <WorkflowStep
                  number="4"
                  icon={FiCheckCircle}
                  title="Receive final decision"
                  description="Once both stages are complete you'll see the final outcome alongside any comments left by the Director or HR team."
                  isLast
                />
              </AnimatedSection>

              {/* Approver workflow */}
              <AnimatedSection delay={200}>
                <Box
                  mb={6}
                  pb={4}
                  borderBottom="1px solid rgba(255,255,255,0.08)"
                >
                  <Text
                    fontSize="xs"
                    color="rgba(212,168,67,0.6)"
                    fontFamily="'DM Mono', monospace"
                    letterSpacing="0.14em"
                    textTransform="uppercase"
                    mb={1}
                  >
                    For Directors & HR Admins
                  </Text>
                  <Text
                    fontSize="lg"
                    fontWeight="700"
                    color="white"
                    fontFamily="'Sora', sans-serif"
                  >
                    Reviewing Applications
                  </Text>
                </Box>

                <WorkflowStep
                  number="1"
                  icon={FiUsers}
                  title="Director reviews first"
                  description="Department directors review incoming applications, verify team coverage, and either approve — forwarding to HR — or reject with a documented reason."
                />
                <WorkflowStep
                  number="2"
                  icon={FiShield}
                  title="HR validates policy"
                  description="HR administrators verify the application against leave policy, balance availability, and any outstanding obligations before the final approval."
                />
                <WorkflowStep
                  number="3"
                  icon={FiTrendingUp}
                  title="Analytics & reporting"
                  description="HR and Admin access comprehensive dashboards: department utilisation, monthly trends, desired-month submissions, and downloadable PDF reports."
                />
                <WorkflowStep
                  number="4"
                  icon={FiZap}
                  title="Manage allocations"
                  description="Admins can adjust individual leave balances, re-run allocation rules for any year, and manage user accounts, departments, and designations."
                  isLast
                />
              </AnimatedSection>
            </Grid>
          </Container>
        </Box>

        {/* ── BENEFITS ── */}
        <Box
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 24 }}
          borderTop="1px solid rgba(255,255,255,0.05)"
        >
          <Container maxW="1200px">
            <AnimatedSection mb={14}>
              <Text
                fontSize="10px"
                fontWeight="600"
                color="rgba(212,168,67,0.7)"
                letterSpacing="0.18em"
                textTransform="uppercase"
                fontFamily="'DM Mono', monospace"
                mb={3}
              >
                Why it matters
              </Text>
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="800"
                color="white"
                mb={3}
                fontFamily="'Sora', sans-serif"
                letterSpacing="-0.02em"
              >
                Built for how NASENI works
              </Heading>
              <Text
                fontSize="md"
                color="rgba(255,255,255,0.45)"
                maxW="480px"
                fontFamily="'Lora', serif"
                lineHeight="1.7"
              >
                Every feature was designed around the actual workflows, roles,
                and policies of NASENI staff and administration.
              </Text>
            </AnimatedSection>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={5}
            >
              {[
                {
                  icon: FiZap,
                  title: "Automatic day calculation",
                  description:
                    "Working days are computed in real time, skipping Nigerian public holidays and weekends. No manual counting, no errors.",
                  stat: "0",
                  statLabel: "Manual calculations needed",
                },
                {
                  icon: FiShield,
                  title: "Role-based access control",
                  description:
                    "Staff, Directors, HR Admins, and System Admins each see only what they need. Data privacy and policy compliance by design.",
                  stat: "4",
                  statLabel: "Distinct access roles",
                },
                {
                  icon: FiFileText,
                  title: "PDF export & print",
                  description:
                    "Generate a professional leave application PDF for any approved record — individual or bulk — directly from your browser.",
                },
                {
                  icon: FiTrendingUp,
                  title: "Live analytics",
                  description:
                    "Department utilisation rates, monthly application trends, and leave-type breakdowns — all updated in real time.",
                },
                {
                  icon: FiCalendar,
                  title: "Desired months planning",
                  description:
                    "Staff submit their two preferred annual leave months ahead of time, giving management clear visibility for workforce planning.",
                  stat: "2",
                  statLabel: "Preferred months per staff",
                },
                {
                  icon: FiUsers,
                  title: "Full user management",
                  description:
                    "Admins can create accounts, assign departments and designations, toggle access, and re-run leave allocations for any year.",
                },
              ].map((card, i) => (
                <AnimatedSection key={card.title} delay={i * 60}>
                  <BenefitCard {...card} />
                </AnimatedSection>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ── LEAVE TYPES STRIP ── */}
        <Box
          position="relative"
          zIndex={1}
          py={{ base: 12, md: 16 }}
          borderTop="1px solid rgba(255,255,255,0.05)"
          overflow="hidden"
        >
          <Container maxW="1200px">
            <AnimatedSection mb={8}>
              <Text
                fontSize="10px"
                fontWeight="600"
                color="rgba(212,168,67,0.7)"
                letterSpacing="0.18em"
                textTransform="uppercase"
                fontFamily="'DM Mono', monospace"
                textAlign="center"
              >
                Supported Leave Types
              </Text>
            </AnimatedSection>
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(6, 1fr)",
              }}
              gap={3}
            >
              {[
                { name: "Annual", days: "30 days/yr", color: "#3B82F6" },
                { name: "Casual", days: "7 days/yr", color: "#10B981" },
                { name: "Sick", days: "10 days/yr", color: "#EF4444" },
                { name: "Maternity", days: "16 weeks", color: "#EC4899" },
                { name: "Paternity", days: "14 days", color: "#06B6D4" },
                { name: "Study", days: "BSc · MSc · PhD", color: "#D4A843" },
              ].map((lt, i) => (
                <AnimatedSection key={lt.name} delay={i * 50}>
                  <Box
                    p={4}
                    borderRadius="14px"
                    bg="rgba(255,255,255,0.025)"
                    border="1px solid rgba(255,255,255,0.06)"
                    textAlign="center"
                    transition="all 0.25s ease"
                    _hover={{
                      bg: "rgba(255,255,255,0.05)",
                      borderColor: `${lt.color}44`,
                      transform: "translateY(-3px)",
                    }}
                  >
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={lt.color}
                      mx="auto"
                      mb={3}
                      opacity={0.8}
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="white"
                      fontFamily="'Sora', sans-serif"
                      mb={1}
                    >
                      {lt.name}
                    </Text>
                    <Text
                      fontSize="10px"
                      color="rgba(255,255,255,0.35)"
                      fontFamily="'DM Mono', monospace"
                    >
                      {lt.days}
                    </Text>
                  </Box>
                </AnimatedSection>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* ── CTA ── */}
        <Box
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 24 }}
          borderTop="1px solid rgba(255,255,255,0.05)"
        >
          <Container maxW="800px" textAlign="center">
            <AnimatedSection>
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w="64px"
                h="64px"
                borderRadius="20px"
                bg="rgba(212,168,67,0.1)"
                border="1px solid rgba(212,168,67,0.2)"
                mb={8}
                mx="auto"
              >
                <Icon as={FiZap} color="#D4A843" boxSize={6} />
              </Box>

              <Heading
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="800"
                color="white"
                mb={5}
                fontFamily="'Sora', sans-serif"
                letterSpacing="-0.02em"
                lineHeight={1.15}
              >
                Ready to manage leave
                <br />
                the modern way?
              </Heading>

              <Text
                fontSize="md"
                color="rgba(255,255,255,0.45)"
                mb={10}
                fontFamily="'Lora', serif"
                lineHeight="1.7"
                maxW="420px"
                mx="auto"
              >
                Sign in with your NASENI credentials to access your personal
                dashboard and submit leave requests.
              </Text>

              <Button
                size="lg"
                onClick={onOpen}
                bg="linear-gradient(135deg, #D4A843 0%, #B8862A 100%)"
                color="#0D1B3E"
                fontFamily="'Sora', sans-serif"
                fontWeight="700"
                fontSize="sm"
                letterSpacing="0.05em"
                px={10}
                h="56px"
                borderRadius="14px"
                shadow="0 8px 32px rgba(212,168,67,0.4)"
                transition="all 0.25s ease"
                _hover={{
                  transform: "translateY(-3px)",
                  shadow: "0 16px 40px rgba(212,168,67,0.55)",
                  bg: "linear-gradient(135deg, #E0B54F 0%, #C49130 100%)",
                }}
                _active={{ transform: "translateY(0)" }}
                rightIcon={<FiArrowRight />}
              >
                Sign in to NASENI Portal
              </Button>

              {/* Checklist */}
              <Flex
                justify="center"
                gap={{ base: 4, md: 8 }}
                mt={10}
                flexWrap="wrap"
              >
                {[
                  "Secure Supabase auth",
                  "Role-based access",
                  "Data stays private",
                ].map((item) => (
                  <HStack key={item} spacing={2}>
                    <Icon
                      as={FiCheck}
                      color="rgba(212,168,67,0.6)"
                      boxSize={3}
                    />
                    <Text
                      fontSize="xs"
                      color="rgba(255,255,255,0.35)"
                      fontFamily="'DM Mono', monospace"
                      letterSpacing="0.04em"
                    >
                      {item}
                    </Text>
                  </HStack>
                ))}
              </Flex>
            </AnimatedSection>
          </Container>
        </Box>

        {/* ── FOOTER ── */}
        <Box
          borderTop="1px solid rgba(255,255,255,0.06)"
          py={8}
          position="relative"
          zIndex={1}
        >
          <Container maxW="1200px">
            <Flex
              justify="space-between"
              align="center"
              direction={{ base: "column", md: "row" }}
              gap={4}
            >
              <HStack spacing={3}>
                <Box
                  w="28px"
                  h="28px"
                  borderRadius="8px"
                  bg="rgba(212,168,67,0.1)"
                  border="1px solid rgba(212,168,67,0.15)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={FiLayers}
                    color="rgba(212,168,67,0.6)"
                    boxSize={3}
                  />
                </Box>
                <Text
                  fontSize="xs"
                  color="rgba(255,255,255,0.25)"
                  fontFamily="'DM Mono', monospace"
                  letterSpacing="0.06em"
                >
                  NASENI Leave Management System
                </Text>
              </HStack>
              <Text
                fontSize="xs"
                color="rgba(255,255,255,0.2)"
                fontFamily="'DM Mono', monospace"
                letterSpacing="0.04em"
              >
                © {new Date().getFullYear()} National Agency for Science and
                Engineering Infrastructure
              </Text>
            </Flex>
          </Container>
        </Box>
      </Box>

      {/* ── LOGIN MODAL ── */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(16px)" bg="rgba(8,15,34,0.85)" />
        <ModalContent
          bg="#0D1B3E"
          border="1px solid rgba(255,255,255,0.1)"
          borderRadius="20px"
          overflow="hidden"
          mx={4}
        >
          {/* Gold accent line */}
          <Box
            h="3px"
            bgGradient="linear(to-r, transparent, #D4A843, transparent)"
          />
          <ModalCloseButton color="rgba(255,255,255,0.4)" top={4} right={4} />
          <ModalBody p={0}>
            {/* Override LoginForm styles via CSS scoping */}
            <Box
              sx={{
                "& > div": {
                  bg: "transparent",
                  boxShadow: "none",
                  border: "none",
                  borderWidth: 0,
                  p: 8,
                },
                "& label": { color: "rgba(255,255,255,0.7)" },
                "& input": {
                  bg: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                  _focus: {
                    borderColor: "rgba(212,168,67,0.6)",
                    boxShadow: "0 0 0 1px rgba(212,168,67,0.3)",
                  },
                  _placeholder: { color: "rgba(255,255,255,0.25)" },
                },
                "& h2, & h3": {
                  color: "white",
                  fontFamily: "'Sora', sans-serif",
                },
                "& p": { color: "rgba(255,255,255,0.45)" },
                "& button[type='submit']": {
                  bg: "linear-gradient(135deg, #D4A843 0%, #B8862A 100%)",
                  color: "#0D1B3E",
                  fontWeight: 700,
                  _hover: {
                    bg: "linear-gradient(135deg, #E0B54F 0%, #C49130 100%)",
                    transform: "translateY(-1px)",
                  },
                },
              }}
            >
              <LoginForm />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
