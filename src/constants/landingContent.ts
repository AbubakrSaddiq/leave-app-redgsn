// File: src/data/landingContent.ts
import {
  FiCalendar,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

export const TRUST_SIGNALS = [
  { label: "6 leave types", icon: FiCalendar },
  { label: "3 staff roles", icon: FiUsers },
  { label: "Instant approvals", icon: FiZap },
];

export const LEAVE_BALANCES = [
  { label: "Annual Leave", pct: 72, color: "#3B82F6", days: "21.6 days" },
  { label: "Casual Leave", pct: 43, color: "#10B981", days: "3 days" },
  { label: "Sick Leave", pct: 20, color: "#EF4444", days: "2 days" },
  { label: "Study Leave", pct: 90, color: "#D4A843", days: "4 yrs" },
];

export const STAFF_WORKFLOW_STEPS = [
  {
    number: "1",
    icon: FiCalendar,
    title: "Select leave type & dates",
    description: "Choose from Annual, Casual, Sick, Maternity, Paternity, or Study leave. Working days are calculated automatically, excluding weekends and public holidays.",
  },
  {
    number: "2",
    icon: FiFileText,
    title: "Submit with reason",
    description: "Provide a reason and review your calculated resumption date before submitting. The system validates against your available balance in real time.",
  },
  {
    number: "3",
    icon: FiClock,
    title: "Track your application",
    description: "Monitor your application status — Pending Director, Pending HR, Approved, or Rejected — from your personal dashboard at any time.",
  },
  {
    number: "4",
    icon: FiCheckCircle,
    title: "Receive final decision",
    description: "Once both stages are complete you'll see the final outcome alongside any comments left by the Director or HR team.",
    isLast: true,
  },
];

export const APPROVER_WORKFLOW_STEPS = [
  {
    number: "1",
    icon: FiUsers,
    title: "Director reviews first",
    description: "Department directors review incoming applications, verify team coverage, and either approve — forwarding to HR — or reject with a documented reason.",
  },
  {
    number: "2",
    icon: FiShield,
    title: "HR validates policy",
    description: "HR administrators verify the application against leave policy, balance availability, and any outstanding obligations before the final approval.",
  },
  {
    number: "3",
    icon: FiTrendingUp,
    title: "Analytics & reporting",
    description: "HR and Admin access comprehensive dashboards: department utilisation, monthly trends, desired-month submissions, and downloadable PDF reports.",
  },
  {
    number: "4",
    icon: FiZap,
    title: "Manage allocations",
    description: "Admins can adjust individual leave balances, re-run allocation rules for any year, and manage user accounts, departments, and designations.",
    isLast: true,
  },
];

export const BENEFIT_CARDS = [
  {
    icon: FiZap,
    title: "Automatic day calculation",
    description: "Working days are computed in real time, skipping Nigerian public holidays and weekends. No manual counting, no errors.",
    stat: "0",
    statLabel: "Manual calculations needed",
  },
  {
    icon: FiShield,
    title: "Role-based access control",
    description: "Staff, Directors, HR Admins, and System Admins each see only what they need. Data privacy and policy compliance by design.",
    stat: "3",
    statLabel: "Distinct access roles",
  },
  {
    icon: FiCalendar,
    title: "Desired months planning",
    description: "Staff submit their two preferred annual leave months ahead of time, giving management clear visibility for workforce planning.",
    stat: "2",
    statLabel: "Preferred months per staff",
  },
  {
    icon: FiFileText,
    title: "PDF export & print",
    description: "Generate a professional leave application PDF for any approved record — individual or bulk — directly from your browser.",
  },
  {
    icon: FiUsers,
    title: "Full user management",
    description: "Admins can create accounts, assign departments and designations, toggle access, and re-run leave allocations for any year.",
  },
];

export const LEAVE_TYPES = [
  { name: "Annual", days: "30 days/yr", color: "#3B82F6" },
  { name: "Casual", days: "7 days/yr", color: "#10B981" },
  { name: "Sick", days: "10 days/yr", color: "#EF4444" },
  { name: "Maternity", days: "16 weeks", color: "#EC4899" },
  { name: "Paternity", days: "14 days", color: "#06B6D4" },
  { name: "Study", days: "BSc · MSc · PhD", color: "#D4A843" },
];

export const CTA_CHECKLIST = [
  "Secure login",
  "Role-based access",
  "Data stays private",
];