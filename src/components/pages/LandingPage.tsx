// File: src/pages/LandingPage.tsx (UPDATED with NASENI brand)
import React from "react";
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

import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiLayers,
  FiCheckCircle,
  FiZap,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import { LoginForm } from "@/components/auth/LoginForm";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { BenefitCard } from "@/components/landing/BenefitCard";
import { fadeUp, shimmer, float, pulse } from "@/utils/keyframes";

// Updated data with NASENI brand colors
const TRUST_SIGNALS = [
  { label: "6 leave types", icon: FiCalendar },
  { label: "3 staff roles", icon: FiUsers },
  { label: "Instant approvals", icon: FiZap },
];

const LEAVE_BALANCES = [
  { label: "Annual Leave", pct: 72, color: "#003366", days: "21.6 days" },
  { label: "Casual Leave", pct: 43, color: "#407ebd", days: "3 days" },
  { label: "Sick Leave", pct: 20, color: "#00a86b", days: "2 days" },
  { label: "Study Leave", pct: 90, color: "#407ebd", days: "4 yrs" },
];

const STAFF_WORKFLOW_STEPS = [
  {
    number: "1",
    icon: FiCalendar,
    title: "Select leave type & dates",
    description:
      "Choose from Annual, Casual, Sick, Maternity, Paternity, or Study leave. Working days are calculated automatically, excluding weekends and public holidays.",
  },
  {
    number: "2",
    icon: FiLayers,
    title: "Submit with reason",
    description:
      "Provide a reason and review your calculated resumption date before submitting. The system validates against your available balance in real time.",
  },
  {
    number: "3",
    icon: FiClock,
    title: "Track your application",
    description:
      "Monitor your application status — Pending Director, Pending HR, Approved, or Rejected — from your personal dashboard at any time.",
  },
  {
    number: "4",
    icon: FiCheckCircle,
    title: "Receive final decision",
    description:
      "Once both stages are complete you'll see the final outcome alongside any comments left by the Director or HR team.",
    isLast: true,
  },
];

const APPROVER_WORKFLOW_STEPS = [
  {
    number: "1",
    icon: FiUsers,
    title: "Director reviews first",
    description:
      "Department directors review incoming applications, verify team coverage, and either approve — forwarding to HR — or reject with a documented reason.",
  },
  {
    number: "2",
    icon: FiCheckCircle,
    title: "HR validates policy",
    description:
      "HR administrators verify the application against leave policy, balance availability, and any outstanding obligations before the final approval.",
  },
  {
    number: "3",
    icon: FiZap,
    title: "Analytics & reporting",
    description:
      "HR and Admin access comprehensive dashboards: department utilisation, monthly trends, desired-month submissions, and downloadable PDF reports.",
  },
  {
    number: "4",
    icon: FiUsers,
    title: "Manage allocations",
    description:
      "Admins can adjust individual leave balances, re-run allocation rules for any year, and manage user accounts, departments, and designations.",
    isLast: true,
  },
];

const BENEFIT_CARDS = [
  {
    icon: FiZap,
    title: "Automatic day calculation",
    description:
      "Working days are computed in real time, skipping Nigerian public holidays and weekends. No manual counting, no errors.",
    stat: "0",
    statLabel: "Manual calculations needed",
  },
  {
    icon: FiCheckCircle,
    title: "Role-based access control",
    description:
      "Staff, Directors, HR Admins, and System Admins each see only what they need. Data privacy and policy compliance by design.",
    stat: "3",
    statLabel: "Distinct access roles",
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
    icon: FiLayers,
    title: "PDF export & print",
    description:
      "Generate a professional leave application PDF for any approved record — individual or bulk — directly from your browser.",
  },
  {
    icon: FiUsers,
    title: "Full user management",
    description:
      "Admins can create accounts, assign departments and designations, toggle access, and re-run leave allocations for any year.",
  },
];

const LEAVE_TYPES = [
  { name: "Annual", days: "30 days/yr", color: "#003366" },
  { name: "Casual", days: "7 days/yr", color: "#407ebd" },
  { name: "Sick", days: "10 days/yr", color: "#00a86b" },
  { name: "Maternity", days: "16 weeks", color: "#407ebd" },
  { name: "Paternity", days: "14 days", color: "#003366" },
  { name: "Study", days: "BSc · MSc · PhD", color: "#407ebd" },
];

const CTA_CHECKLIST = [
  "Secure login",
  "Role-based access",
  "Data stays private",
];

export const LandingPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        minH="100vh"
        bg="landing.bg.primary"
        overflowX="hidden"
        width="100%"
        mx="auto"
      >
        {/* Background atmosphere - enhanced visibility with NASENI colors */}
        <Box
          position="fixed"
          inset={0}
          zIndex={0}
          pointerEvents="none"
          overflow="hidden"
        >
          {/* Primary brand glow - top right */}
          <Box
            position="absolute"
            top="-15%"
            right="-10%"
            w="700px"
            h="700px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(0,51,102,0.12) 0%, transparent 70%)"
            animation={`${pulse} 8s ease-in-out infinite`}
          />
          {/* Secondary brand glow - bottom left */}
          <Box
            position="absolute"
            bottom="-10%"
            left="-5%"
            w="500px"
            h="500px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(64,126,189,0.1) 0%, transparent 70%)"
            animation={`${pulse} 10s ease-in-out infinite 2s`}
          />
          {/* Subtle grid pattern */}
          <Box
            position="absolute"
            inset={0}
            opacity={0.03}
            backgroundImage="linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)"
            backgroundSize="60px 60px"
          />
        </Box>

        {/* Navigation */}
        <Box
          position="sticky"
          top={0}
          zIndex={100}
          borderBottom="1px solid"
          borderBottomColor="landing.border.light"
          bg="landing.bg.overlay"
          backdropFilter="blur(20px)"
          w="100%"
        >
          <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={4}>
            <Flex justify="space-between" align="center">
              <HStack spacing={3}>
                <Box
                  w="36px"
                  h="36px"
                  borderRadius="10px"
                  bg="landing.gradients.brand"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  shadow="landing.shadows.brand"
                >
                  <Icon as={FiLayers} color="white" boxSize={4} />
                </Box>
                <VStack spacing={0} align="flex-start">
                  <Text
                    fontSize="sm"
                    fontWeight="800"
                    color="landing.text.primary"
                    lineHeight={1}
                    letterSpacing="0.03em"
                  >
                    NASENI
                  </Text>
                  <Text
                    fontSize="9px"
                    color="landing.brand.light"
                    letterSpacing="0.18em"
                    textTransform="uppercase"
                    fontFamily="'DM Mono', monospace"
                  >
                    Leave Portal
                  </Text>
                </VStack>
              </HStack>

              <Button
                variant="landing-outline"
                size="sm"
                onClick={onOpen}
                px={5}
                rightIcon={<FiArrowRight />}
              >
                Sign In
              </Button>
            </Flex>
          </Box>
        </Box>

        {/* Hero Section */}
        <Box
          position="relative"
          zIndex={1}
          pt={{ base: 20, md: 28 }}
          pb={{ base: 16, md: 24 }}
        >
          <Container maxW="1400px" px={{ base: 6, md: 10 }}>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={{ base: 14, lg: 20 }}
              alignItems="center"
              minH="80vh"
            >
              <GridItem display="flex" alignItems="center">
                <Heading
                  variant="landing-hero"
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  lineHeight="1.12"
                  mb={6}
                  animation={`${fadeUp} 0.7s ease 0.1s both`}
                >
                  Streamlined leave
                  <br />
                  <Box
                    as="span"
                    bgGradient="landing.gradients.brandShimmer"
                    bgClip="text"
                    backgroundSize="200% auto"
                    animation={`${shimmer} 4s linear infinite`}
                  >
                    for every NASENI
                  </Box>
                  <br />
                  staff member.
                </Heading>
              </GridItem>

              <GridItem display="flex" alignItems="center">
                <VStack>
                  <Text
                    fontSize={{ base: "md", md: "lg" }}
                    color="landing.text.tertiary"
                    lineHeight="1.75"
                    mb={10}
                    maxW="480px"
                    animation={`${fadeUp} 0.7s ease 0.2s both`}
                    fontFamily="'Lora', serif"
                  >
                    A centralized platform replacing paper forms and email
                    chains. Apply, track, and approve leave requests —
                    transparently and efficiently — across all departments.
                  </Text>
                  <HStack
                    spacing={4}
                    animation={`${fadeUp} 0.7s ease 0.3s both`}
                  >
                    <Button
                      size="lg"
                      onClick={onOpen}
                      variant="landing-brand"
                      px={8}
                      h="52px"
                      rightIcon={<FiArrowRight />}
                    >
                      Access Dashboard
                    </Button>

                    <Button
                      size="lg"
                      as="a"
                      href="#workflow"
                      variant="landing-ghost"
                      h="52px"
                    >
                      See how it works
                    </Button>
                  </HStack>

                  <HStack
                    mt={10}
                    spacing={6}
                    animation={`${fadeUp} 0.7s ease 0.4s both`}
                  >
                    {TRUST_SIGNALS.map((item) => (
                      <HStack key={item.label} spacing={1.5}>
                        <Icon
                          as={item.icon}
                          color="landing.brand.light"
                          boxSize={3.5}
                          opacity={0.7}
                        />
                        <Text
                          fontSize="xs"
                          color="landing.text.muted"
                          fontFamily="'DM Mono', monospace"
                          letterSpacing="0.04em"
                        >
                          {item.label}
                        </Text>
                      </HStack>
                    ))}
                  </HStack>
                </VStack>
              </GridItem>

              {/* Dashboard Mockup */}
              <GridItem display={{ base: "none", lg: "block" }}>
                <Box
                  position="relative"
                  animation={`${float} 6s ease-in-out infinite`}
                >
                  <Box variant="landing-glass">
                    <Box p={6}>
                      <HStack mb={5} spacing={2}>
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="full"
                          bg="#FF5F57"
                        />
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="full"
                          bg="#FEBC2E"
                        />
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="full"
                          bg="#28C840"
                        />
                        <Box flex={1} />
                        <Box
                          px={3}
                          py={1}
                          borderRadius="full"
                          bg="landing.brand.glow"
                          border="1px solid"
                          borderColor="landing.border.brandLight"
                        >
                          <Text
                            fontSize="9px"
                            color="landing.brand.light"
                            fontFamily="'DM Mono', monospace"
                          >
                            Leave Dashboard
                          </Text>
                        </Box>
                      </HStack>

                      <Text
                        fontSize="xs"
                        color="landing.text.muted"
                        mb={3}
                        fontFamily="'DM Mono', monospace"
                        letterSpacing="0.08em"
                      >
                        LEAVE BALANCES — 2025
                      </Text>

                      {LEAVE_BALANCES.map((item) => (
                        <Box key={item.label} mb={3.5}>
                          <Flex justify="space-between" mb={1.5}>
                            <Text
                              fontSize="11px"
                              color="landing.text.secondary"
                              fontFamily="'Sora', sans-serif"
                            >
                              {item.label}
                            </Text>
                            <Text
                              fontSize="11px"
                              color="landing.text.muted"
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
                              opacity={0.8}
                            />
                          </Box>
                        </Box>
                      ))}

                      <Box
                        mt={5}
                        p={3.5}
                        borderRadius="12px"
                        bg="landing.brand.glow"
                        border="1px solid"
                        borderColor="landing.border.brandLight"
                      >
                        <Flex justify="space-between" align="center">
                          <VStack spacing={0.5} align="flex-start">
                            <Text
                              fontSize="11px"
                              fontWeight="700"
                              color="landing.text.primary"
                              fontFamily="'Sora', sans-serif"
                            >
                              Annual Leave · 5 days
                            </Text>
                            <Text
                              fontSize="10px"
                              color="landing.text.quaternary"
                              fontFamily="'Lora', serif"
                            >
                              Dec 23 — Dec 27, 2025
                            </Text>
                          </VStack>
                          <Box
                            px={2.5}
                            py={1}
                            borderRadius="full"
                            bg="rgba(0,168,107,0.15)"
                            border="1px solid"
                            borderColor="rgba(0,168,107,0.3)"
                          >
                            <Text
                              fontSize="9px"
                              fontWeight="700"
                              color="landing.status.success"
                              fontFamily="'DM Mono', monospace"
                              letterSpacing="0.06em"
                            >
                              APPROVED
                            </Text>
                          </Box>
                        </Flex>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    position="absolute"
                    top="-16px"
                    right="-20px"
                    px={3.5}
                    py={2}
                    borderRadius="12px"
                    bg="rgba(0,168,107,0.12)"
                    border="1px solid"
                    borderColor="rgba(0,168,107,0.25)"
                    backdropFilter="blur(12px)"
                    shadow="landing.shadows.floating"
                  >
                    <HStack spacing={2}>
                      <Icon
                        as={FiCheckCircle}
                        color="landing.status.success"
                        boxSize={3.5}
                      />
                      <Text
                        fontSize="10px"
                        color="landing.status.success"
                        fontWeight="600"
                        fontFamily="'DM Mono', monospace"
                      >
                        Director approved
                      </Text>
                    </HStack>
                  </Box>

                  <Box
                    position="absolute"
                    bottom="-14px"
                    left="-24px"
                    px={3.5}
                    py={2}
                    borderRadius="12px"
                    bg="landing.brand.glow"
                    border="1px solid"
                    borderColor="landing.border.brand"
                    backdropFilter="blur(12px)"
                    shadow="landing.shadows.floating"
                  >
                    <HStack spacing={2}>
                      <Icon
                        as={FiClock}
                        color="landing.brand.light"
                        boxSize={3.5}
                      />
                      <Text
                        fontSize="10px"
                        color="landing.brand.light"
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

        {/* Workflow Section */}
        <Box
          id="workflow"
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 24 }}
          borderTop="1px solid"
          borderTopColor="landing.border.light"
        >
          <Container maxW="1200px">
            <AnimatedSection>
              <Text
                fontSize="10px"
                fontWeight="600"
                color="landing.brand.light"
                letterSpacing="0.18em"
                textTransform="uppercase"
                fontFamily="'DM Mono', monospace"
                mb={3}
              >
                How it works
              </Text>
              <Heading
                variant="landing-section"
                fontSize={{ base: "2xl", md: "3xl" }}
                mb={3}
              >
                A clear, three-stage approval flow
              </Heading>
              <Text
                fontSize="md"
                color="landing.text.quaternary"
                mb={14}
                maxW="520px"
                fontFamily="'Lora', serif"
                lineHeight="1.7"
              >
                Every leave request follows a transparent, documented journey
                from application to final approval — no ambiguity.
              </Text>
            </AnimatedSection>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={16}>
              <AnimatedSection delay={100}>
                <Box
                  mb={6}
                  pb={4}
                  borderBottom="1px solid"
                  borderBottomColor="landing.border.light"
                >
                  <Text
                    fontSize="xs"
                    color="landing.brand.light"
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
                    color="landing.text.primary"
                    fontFamily="'Sora', sans-serif"
                  >
                    Applying for Leave
                  </Text>
                </Box>
                {STAFF_WORKFLOW_STEPS.map((step) => (
                  <WorkflowStep key={step.number} {...step} />
                ))}
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <Box
                  mb={6}
                  pb={4}
                  borderBottom="1px solid"
                  borderBottomColor="landing.border.light"
                >
                  <Text
                    fontSize="xs"
                    color="landing.brand.light"
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
                    color="landing.text.primary"
                    fontFamily="'Sora', sans-serif"
                  >
                    Reviewing Applications
                  </Text>
                </Box>
                {APPROVER_WORKFLOW_STEPS.map((step) => (
                  <WorkflowStep key={step.number} {...step} />
                ))}
              </AnimatedSection>
            </Grid>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Box
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 24 }}
          borderTop="1px solid"
          borderTopColor="landing.border.light"
        >
          <Container maxW="1200px">
            <AnimatedSection mb={14}>
              <Text
                fontSize="10px"
                fontWeight="600"
                color="landing.brand.light"
                letterSpacing="0.18em"
                textTransform="uppercase"
                fontFamily="'DM Mono', monospace"
                mb={3}
              >
                Why it matters
              </Text>
              <Heading
                variant="landing-section"
                fontSize={{ base: "2xl", md: "3xl" }}
                mb={3}
              >
                Built for how NASENI works
              </Heading>
              <Text
                fontSize="md"
                color="landing.text.quaternary"
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
              {BENEFIT_CARDS.map((card, i) => (
                <AnimatedSection key={card.title} delay={i * 60}>
                  <BenefitCard {...card} />
                </AnimatedSection>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Leave Types Strip */}
        <Box
          position="relative"
          zIndex={1}
          py={{ base: 12, md: 16 }}
          borderTop="1px solid"
          borderTopColor="landing.border.light"
          overflow="hidden"
        >
          <Container maxW="1200px">
            <AnimatedSection mb={8}>
              <Text
                fontSize="10px"
                fontWeight="600"
                color="landing.brand.light"
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
              {LEAVE_TYPES.map((lt, i) => (
                <AnimatedSection key={lt.name} delay={i * 50}>
                  <Box
                    p={4}
                    borderRadius="14px"
                    bg="rgba(255,255,255,0.025)"
                    border="1px solid"
                    borderColor="landing.border.medium"
                    textAlign="center"
                    transition="all 0.25s ease"
                    _hover={{
                      bg: "landing.brand.glow",
                      borderColor: "landing.border.brand",
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
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="landing.text.primary"
                      fontFamily="'Sora', sans-serif"
                      mb={1}
                    >
                      {lt.name}
                    </Text>
                    <Text
                      fontSize="10px"
                      color="landing.text.muted"
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

        {/* CTA Section */}
        <Box
          position="relative"
          zIndex={1}
          py={{ base: 16, md: 24 }}
          borderTop="1px solid"
          borderTopColor="landing.border.light"
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
                bg="landing.brand.glow"
                border="1px solid"
                borderColor="landing.border.brandLight"
                mb={8}
                mx="auto"
              >
                <Icon as={FiZap} color="landing.brand.light" boxSize={6} />
              </Box>

              <Heading
                variant="landing-section"
                fontSize={{ base: "2xl", md: "4xl" }}
                mb={5}
                lineHeight={1.15}
              >
                Ready to go on leave?
              </Heading>

              <Text
                fontSize="md"
                color="landing.text.quaternary"
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
                variant="landing-brand"
                px={10}
                h="56px"
                rightIcon={<FiArrowRight />}
              >
                Sign in to NASENI Portal
              </Button>

              <Flex
                justify="center"
                gap={{ base: 4, md: 8 }}
                mt={10}
                flexWrap="wrap"
              >
                {CTA_CHECKLIST.map((item) => (
                  <HStack key={item} spacing={2}>
                    <Icon
                      as={FiCheck}
                      color="landing.brand.light"
                      boxSize={3}
                      opacity={0.7}
                    />
                    <Text
                      fontSize="xs"
                      color="landing.text.muted"
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

        {/* Footer */}
        <Box
          borderTop="1px solid"
          borderTopColor="landing.border.light"
          py={8}
          position="relative"
          zIndex={1}
        >
          <Container maxW="1200px">
            <Flex
              justify="center"
              align="center"
              direction={{ base: "column", md: "row" }}
            >
              <Text
                fontSize="xs"
                color="landing.text.subtle"
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

      {/* Login Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(16px)" bg="landing.bg.overlay" />
        <ModalContent
          bg="landing.bg.secondary"
          border="1px solid"
          borderColor="landing.border.strong"
          borderRadius="20px"
          overflow="hidden"
          mx={4}
        >
          <Box h="3px" bgGradient="landing.gradients.modalAccent" />
          <ModalCloseButton color="landing.text.quaternary" top={4} right={4} />
          <ModalBody p={0}>
            <Box
              sx={{
                "& > div": {
                  bg: "transparent",
                  boxShadow: "none",
                  border: "none",
                  borderWidth: 0,
                  p: 8,
                },
                "& label": { color: "landing.text.secondary" },
                "& input": {
                  bg: "rgba(255,255,255,0.05)",
                  border: "1px solid",
                  borderColor: "landing.border.strong",
                  color: "landing.text.primary",
                  _focus: {
                    borderColor: "landing.border.brandStrong",
                    boxShadow: "0 0 0 1px rgba(64,126,189,0.3)",
                  },
                  _placeholder: { color: "landing.text.subtle" },
                },
                "& h2, & h3": {
                  color: "landing.text.primary",
                  fontFamily: "'Sora', sans-serif",
                },
                "& p": { color: "landing.text.quaternary" },
                "& button[type='submit']": {
                  bg: "landing.gradients.brand",
                  color: "white",
                  fontWeight: 700,
                  _hover: {
                    bg: "landing.gradients.brandHover",
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

export default LandingPage;
