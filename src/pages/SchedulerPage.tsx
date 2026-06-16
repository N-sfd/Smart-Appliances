import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import HandymanIcon from '@mui/icons-material/Handyman';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import OpacityIcon from '@mui/icons-material/Opacity';
import BoltIcon from '@mui/icons-material/Bolt';
import HomeIcon from '@mui/icons-material/Home';
import GarageIcon from '@mui/icons-material/Garage';
import KitchenIcon from '@mui/icons-material/Kitchen';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { colors, fonts } from '../theme';
import { HVAC_SERVICE_IMAGES } from '../data/hvacHub';
import { PLUMBING_SERVICE_IMAGES } from '../data/plumbingHub';
import { ELECTRICAL_SERVICE_IMAGES } from '../data/electricalHub';
import { APPLIANCE_SERVICE_IMAGES, APPLIANCE_DEFAULT_IMAGE } from '../data/applianceHub';
import { SMART_HOME_SERVICE_IMAGES } from '../data/smartHomeHub';
import {
  normalizeZipInput,
  validateZipCode,
  getZipFieldHelperText,
  isZipFieldError,
} from '../data/serviceAreas';
import {
  parseSchedulerPrefill,
  SchedulerServiceCategory,
} from '../data/schedulerPrefill';
import { insertBooking, updateEmailSent } from '../lib/supabaseBookings';
import { useAuth } from '../contexts/AuthContext';
import {
  addLocalDays,
  formatLocalDateIso,
  getTodayLocalDate,
  sanitizePreferredDate,
} from '../lib/localDate';
import {
  validateCityField,
  validateEmailAddress,
  validateFullName,
  validatePreferredDateField,
  validateStateField,
  validateStreetAddress,
  validateUsPhone,
  SERVICE_AREA_STATES,
} from '../lib/schedulerContactValidation';

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

// ── Scheduler config ──────────────────────────────────────────────────────────

// ── Step labels ───────────────────────────────────────────────────────────────
const STEPS = ['Service Type', 'Service Details', 'Contact Info', 'Review & Submit'];

// ── Service types (Step 0) ────────────────────────────────────────────────────
const SERVICE_TYPES = [
  {
    id: 'repair',
    label: 'Repair',
    icon: <BuildIcon sx={{ fontSize: 30 }} />,
    desc: 'Fix a broken or malfunctioning product.',
    accentColor: colors.primaryBlue,
  },
  {
    id: 'installation',
    label: 'Installation',
    icon: <HomeRepairServiceIcon sx={{ fontSize: 30 }} />,
    desc: 'Install or set up a new product or system.',
    accentColor: '#10B981',
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: <HandymanIcon sx={{ fontSize: 30 }} />,
    desc: 'Routine tune-up or preventive care.',
    accentColor: '#8B5CF6',
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: <WarningAmberIcon sx={{ fontSize: 30 }} />,
    desc: 'Urgent same-day service for critical issues.',
    accentColor: colors.emergency,
  },
] as const;

// ── Service categories (Step 1) ───────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  { id: 'Appliance', label: 'Appliance', icon: <KitchenIcon /> },
  { id: 'HVAC', label: 'HVAC', icon: <AcUnitIcon /> },
  { id: 'Plumbing', label: 'Plumbing', icon: <OpacityIcon /> },
  { id: 'Electrical', label: 'Electrical', icon: <BoltIcon /> },
  { id: 'Smart Home', label: 'Smart Home', icon: <HomeIcon /> },
  { id: 'Garage Door', label: 'Garage Door', icon: <GarageIcon /> },
];

const BRANDS = [
  'Samsung', 'LG', 'Whirlpool', 'Bosch', 'GE', 'Maytag',
  'Frigidaire', 'KitchenAid', 'Electrolux', 'Amana', 'Other',
];

// ── Left-panel info per category ──────────────────────────────────────────────
interface PanelInfo { image: string; title: string; desc: string; bullets: string[] }

const CATEGORY_PANEL: Record<string, PanelInfo> = {
  Appliance: {
    image: APPLIANCE_SERVICE_IMAGES['washer-dryer'],
    title: 'Appliance Service',
    desc: 'Certified technicians for all major home appliances.',
    bullets: ['All major brands serviced', 'Same-day service available', 'Upfront transparent pricing'],
  },
  HVAC: {
    image: HVAC_SERVICE_IMAGES['ac-repair'],
    title: 'HVAC Service',
    desc: 'Heating, cooling, and ventilation by certified technicians.',
    bullets: ['Licensed HVAC technicians', 'Emergency service available', 'All system types serviced'],
  },
  Plumbing: {
    image: PLUMBING_SERVICE_IMAGES['leak-repair'],
    title: 'Plumbing Service',
    desc: 'Quality plumbing repairs and installations done right.',
    bullets: ['Licensed plumbers on call', 'Same-day response available', 'All plumbing issues handled'],
  },
  Electrical: {
    image: ELECTRICAL_SERVICE_IMAGES['outlet-switch-repair'],
    title: 'Electrical Service',
    desc: 'Licensed electricians for safe, reliable electrical work.',
    bullets: ['Licensed & insured electricians', 'Safety-first approach', 'Outlet, panel & wiring work'],
  },
  'Smart Home': {
    image: SMART_HOME_SERVICE_IMAGES['smart-thermostat-setup'],
    title: 'Smart Home Setup',
    desc: 'Professional installation and configuration for all smart devices.',
    bullets: ['All smart home brands', 'App setup & pairing included', 'Wi-Fi troubleshooting'],
  },
  'Garage Door': {
    image: '/images/services/garage-door/tech-1.webp',
    title: 'Garage Door Service',
    desc: 'Spring, opener, track, and sensor repair by specialists.',
    bullets: ['Same-day service available', 'All door brands & models', 'Spring & opener specialists'],
  },
};

const GARAGE_DOOR_IMG: Record<string, string> = {
  'Repair': '/images/services/garage-door/tech-1.webp',
  'Installation': '/images/services/garage-door/tech-4.webp',
  'Opener Repair': '/images/services/garage-door/tech-1.webp',
  'Spring Repair': '/images/services/garage-door/tech-4.webp',
  'Track Issue': '/images/services/garage-door/hero.webp',
  'Remote / Sensor Issue': '/images/services/garage-door/tech-1.webp',
};

const DEFAULT_PANEL: PanelInfo = {
  image: APPLIANCE_DEFAULT_IMAGE,
  title: 'Home Services',
  desc: 'Certified technicians ready for any home service need.',
  bullets: ['Licensed & insured technicians', 'Upfront transparent pricing', 'Satisfaction guaranteed'],
};

const APPLIANCE_IMG: Record<string, string> = {
  Refrigerator: APPLIANCE_SERVICE_IMAGES['refrigerator-repair'],
  Washer: APPLIANCE_SERVICE_IMAGES['washer-repair'],
  Dryer: APPLIANCE_SERVICE_IMAGES['dryer-repair'],
  Dishwasher: APPLIANCE_SERVICE_IMAGES['dishwasher-repair'],
  'Oven / Stove': APPLIANCE_SERVICE_IMAGES['oven-stove-repair'],
  Microwave: APPLIANCE_SERVICE_IMAGES['microwave-repair'],
  'Garbage Disposal': APPLIANCE_SERVICE_IMAGES['garbage-disposal-repair'],
  'Smart Appliance': SMART_HOME_SERVICE_IMAGES['smart-thermostat-setup'],
};

// ── Appointment slots ─────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { id: '8-10', label: '8am – 10am', startHour: 8 },
  { id: '10-12', label: '10am – 12pm', startHour: 10 },
  { id: '12-2', label: '12pm – 2pm', startHour: 12 },
  { id: '2-4', label: '2pm – 4pm', startHour: 14 },
  { id: '4-6', label: '4pm – 6pm', startHour: 16 },
];
const MAX_SLOTS = 4;
const VISIBLE_DAYS = 3;

interface DaySlot {
  date: Date;
  iso: string;
  slots: { id: string; label: string; available: boolean }[];
}

const slotKey = (iso: string, id: string) => `${iso}|${id}`;

const parseSlotKey = (key: string): string => {
  const [iso, slotId] = key.split('|');
  const slot = TIME_SLOTS.find((s) => s.id === slotId);
  const date = new Date(`${iso}T12:00:00`);
  const dayLabel = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  return `${dayLabel} · ${slot?.label ?? slotId}`;
};

const hashStr = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const buildSchedule = (days: number): DaySlot[] => {
  const result: DaySlot[] = [];
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const iso = formatLocalDateIso(date);
    const isToday = i === 0;
    const isSun = date.getDay() === 0;
    const slots = TIME_SLOTS.map((slot) => {
      const seed = hashStr(`${iso}-${slot.id}`);
      if (isToday && now.getHours() >= slot.startHour) {
        return { id: slot.id, label: slot.label, available: false };
      }
      if (isSun) return { id: slot.id, label: slot.label, available: seed % 5 === 0 };
      return { id: slot.id, label: slot.label, available: seed % 10 < 8 };
    });
    result.push({ date, iso, slots });
  }
  return result;
};

// ── ChipGroup (defined outside to avoid stale closure / remount) ─────────────
interface ChipGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}

const ChipGroup: React.FC<ChipGroupProps> = ({ label, options, value, onChange, required }) => (
  <Box sx={{ mb: 2.5 }}>
    <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, color: colors.navy, mb: 1, fontSize: '0.875rem' }}>
      {label}
      {required && <Box component="span" sx={{ color: colors.emergency }}> *</Box>}
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {options.map((opt) => {
        const sel = value === opt;
        return (
          <Box
            key={opt}
            onClick={() => onChange(sel ? '' : opt)}
            sx={{
              cursor: 'pointer',
              px: 1.75,
              py: 0.65,
              borderRadius: '999px',
              border: `1.5px solid ${sel ? colors.primaryBlue : colors.border}`,
              backgroundColor: sel ? colors.lightBlueBg : '#fff',
              color: sel ? colors.primaryBlue : colors.darkText,
              fontFamily: fonts.body,
              fontSize: '0.85rem',
              fontWeight: sel ? 700 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              transition: 'all 0.15s',
              userSelect: 'none',
              '&:hover': {
                borderColor: colors.primaryBlue,
                backgroundColor: sel ? colors.lightBlueBg : '#F0F7FF',
              },
            }}
          >
            {sel && <CheckIcon sx={{ fontSize: 13 }} />}
            {opt}
          </Box>
        );
      })}
    </Box>
  </Box>
);

const isUrgentSchedulerService = (
  type: string,
  urgency: string,
): boolean =>
  type === 'emergency' || urgency === 'Emergency' || urgency === 'Same-Day';

const getInitialPreferredDate = (
  urgent: boolean,
  paramDate: string | null,
): string => {
  const today = getTodayLocalDate();
  if (paramDate) {
    const sanitized = sanitizePreferredDate(paramDate, today);
    if (sanitized) return sanitized;
  }
  return urgent ? today : addLocalDays(1);
};

// ── Request number generator ──────────────────────────────────────────────────
const generateRequestNumber = (): string => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `SA-${year}-${suffix}`;
};

// ── Main component ────────────────────────────────────────────────────────────
const SchedulerPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const navContact = (location.state as { prefillName?: string; prefillEmail?: string; prefillPhone?: string } | null) ?? {};
  const prefillZip = params.get('zipCode') ?? '';
  const prefill = useMemo(() => parseSchedulerPrefill(params), [params]);
  const paramPreferredDate = params.get('preferredDate');
  const todayLocal = getTodayLocalDate();

  // Step — skip service-type picker when both type and category come from URL
  const [step, setStep] = useState(
    prefill.serviceTypeFromUrl && Boolean(prefill.category) ? 1 : 0,
  );

  // Step 0
  const [serviceType, setServiceType] = useState(prefill.serviceType);

  // Step 1 — category
  const [category, setCategory] = useState<SchedulerServiceCategory | ''>(prefill.category);
  const [showCategoryPicker, setShowCategoryPicker] = useState(!prefill.skipCategoryPicker);

  // Appliance fields
  const [appliance, setAppliance] = useState(prefill.fields.appliance ?? '');

  // HVAC fields
  const [hvacService, setHvacService] = useState(prefill.fields.hvacService ?? '');
  const [applianceIssue, setApplianceIssue] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  // HVAC fields (hvacService initialized above)
  const [hvacIssue, setHvacIssue] = useState('');
  const [hvacSystemType, setHvacSystemType] = useState('');
  const [hvacUrgency, setHvacUrgency] = useState('');

  // Plumbing fields
  const [plumbingIssue, setPlumbingIssue] = useState(prefill.fields.plumbingIssue ?? '');
  const [plumbingLocation, setPlumbingLocation] = useState('');
  const [waterLeaking, setWaterLeaking] = useState('');

  // Electrical fields
  const [electricalIssue, setElectricalIssue] = useState(prefill.fields.electricalIssue ?? '');
  const [electricalSafety, setElectricalSafety] = useState('');

  // Smart Home fields
  const [smartDevice, setSmartDevice] = useState(prefill.fields.smartDevice ?? '');
  const [smartHelp, setSmartHelp] = useState('');

  // Garage Door fields
  const [garageDoorService, setGarageDoorService] = useState(prefill.fields.garageDoorService ?? '');
  const [garageDoorProblem, setGarageDoorProblem] = useState('');

  // Common
  const [issueDescription, setIssueDescription] = useState('');

  // Step 2 — contact + location + appointment
  const [zipCode, setZipCode] = useState(prefillZip);
  const [zipTouched, setZipTouched] = useState(false);
  const [address, setAddress] = useState('');
  const [addressTouched, setAddressTouched] = useState(false);
  const [suiteApt, setSuiteApt] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('MD');
  const [name, setName] = useState(navContact.prefillName ?? '');
  const [email, setEmail] = useState(navContact.prefillEmail ?? '');
  const [phone, setPhone] = useState(navContact.prefillPhone ?? '');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [cityTouched, setCityTouched] = useState(false);
  const [stateTouched, setStateTouched] = useState(false);
  const [preferredDate, setPreferredDate] = useState(() =>
    getInitialPreferredDate(
      isUrgentSchedulerService(prefill.serviceType, ''),
      paramPreferredDate,
    ),
  );
  const [preferredDateTouched, setPreferredDateTouched] = useState(false);
  const [contactSubmitAttempted, setContactSubmitAttempted] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [dateOffset, setDateOffset] = useState(0);

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const next = parseSchedulerPrefill(params);
    if (next.serviceTypeFromUrl) setServiceType(next.serviceType);
    if (next.category) {
      setCategory(next.category);
      setShowCategoryPicker(!next.skipCategoryPicker);
    }
    if (next.serviceTypeFromUrl && Boolean(next.category)) setStep(1);
    if (next.fields.appliance) setAppliance(next.fields.appliance);
    if (next.fields.hvacService) setHvacService(next.fields.hvacService);
    if (next.fields.plumbingIssue) setPlumbingIssue(next.fields.plumbingIssue);
    if (next.fields.electricalIssue) setElectricalIssue(next.fields.electricalIssue);
    if (next.fields.smartDevice) setSmartDevice(next.fields.smartDevice);
    if (next.fields.garageDoorService) setGarageDoorService(next.fields.garageDoorService);
  }, [params]);

  useEffect(() => {
    if (preferredDateTouched) return;
    setPreferredDate(
      getInitialPreferredDate(
        isUrgentSchedulerService(serviceType, hvacUrgency),
        paramPreferredDate,
      ),
    );
  }, [serviceType, hvacUrgency, paramPreferredDate, preferredDateTouched]);

  useEffect(() => {
    if (step !== 2) setContactSubmitAttempted(false);
  }, [step]);

  const showContactError = (touched: boolean, message: string | null): boolean =>
    Boolean(message) && (touched || contactSubmitAttempted);

  const nameError = validateFullName(name);
  const emailError = validateEmailAddress(email);
  const phoneError = validateUsPhone(phone);
  const addressError = validateStreetAddress(address);
  const cityError = validateCityField(city);
  const stateError = validateStateField(stateField);
  const preferredDateError = validatePreferredDateField(preferredDate);
  const zipValidation = validateZipCode(zipCode);

  const schedule = useMemo(() => buildSchedule(14), []);
  const visibleDays = schedule.slice(dateOffset, dateOffset + VISIBLE_DAYS);
  const slotLabels = selectedSlots.map(parseSlotKey);
  const viewCount = useMemo(
    () => 24 + ((new Date().getHours() * 7 + new Date().getDate()) % 17),
    [],
  );

  // ── Dynamic left-panel image/info ─────────────────────────────────────────
  const panelInfo = useMemo<PanelInfo>(() => {
    if (!category) return DEFAULT_PANEL;
    const base = CATEGORY_PANEL[category] ?? DEFAULT_PANEL;

    if (category === 'Appliance' && appliance && APPLIANCE_IMG[appliance]) {
      return { ...base, image: APPLIANCE_IMG[appliance], title: `${appliance} Service` };
    }
    if (category === 'HVAC' && hvacService) {
      const map: Record<string, string> = {
        'AC Repair': HVAC_SERVICE_IMAGES['ac-repair'],
        'Heating / Furnace Repair': HVAC_SERVICE_IMAGES['heating-furnace-repair'],
        'Thermostat Installation': HVAC_SERVICE_IMAGES['thermostat-installation'],
        'HVAC Maintenance': HVAC_SERVICE_IMAGES['hvac-maintenance'],
        'Duct Cleaning': HVAC_SERVICE_IMAGES['duct-cleaning'],
      };
      if (map[hvacService]) return { ...base, image: map[hvacService], title: hvacService };
    }
    if (category === 'Plumbing' && plumbingIssue) {
      const map: Record<string, string> = {
        'Leak Repair': PLUMBING_SERVICE_IMAGES['leak-repair'],
        'Drain Cleaning': PLUMBING_SERVICE_IMAGES['drain-cleaning'],
        'Toilet Repair': PLUMBING_SERVICE_IMAGES['toilet-repair'],
        'Faucet Repair': PLUMBING_SERVICE_IMAGES['faucet-repair'],
        'Water Heater': PLUMBING_SERVICE_IMAGES['water-heater-service'],
        'Pipe Repair': PLUMBING_SERVICE_IMAGES['leak-repair'],
      };
      if (map[plumbingIssue]) return { ...base, image: map[plumbingIssue], title: plumbingIssue };
    }
    if (category === 'Electrical' && electricalIssue) {
      const map: Record<string, string> = {
        'Outlet / Switch': ELECTRICAL_SERVICE_IMAGES['outlet-switch-repair'],
        'Light Fixture': ELECTRICAL_SERVICE_IMAGES['light-fixture-installation'],
        'Ceiling Fan': ELECTRICAL_SERVICE_IMAGES['ceiling-fan-installation'],
        'Breaker / Panel': ELECTRICAL_SERVICE_IMAGES['breaker-panel-inspection'],
        'Smart Switch': ELECTRICAL_SERVICE_IMAGES['smart-device-wiring'],
        'Appliance Electrical Connection': ELECTRICAL_SERVICE_IMAGES['appliance-electrical-connection'],
      };
      if (map[electricalIssue]) return { ...base, image: map[electricalIssue], title: electricalIssue };
    }
    if (category === 'Smart Home' && smartDevice) {
      const map: Record<string, string> = {
        'Smart Thermostat': SMART_HOME_SERVICE_IMAGES['smart-thermostat-setup'],
        'Security Camera': SMART_HOME_SERVICE_IMAGES['camera-installation'],
        'Smart Doorbell': SMART_HOME_SERVICE_IMAGES['doorbell-installation'],
        'Smart Lock': SMART_HOME_SERVICE_IMAGES['smart-lock-installation'],
        'Wi-Fi Device': SMART_HOME_SERVICE_IMAGES['wifi-setup'],
      };
      if (map[smartDevice]) return { ...base, image: map[smartDevice], title: `${smartDevice} Service` };
    }
    if (category === 'Garage Door' && garageDoorService && GARAGE_DOOR_IMG[garageDoorService]) {
      return { ...base, image: GARAGE_DOOR_IMG[garageDoorService], title: garageDoorService };
    }
    return base;
  }, [category, appliance, hvacService, plumbingIssue, electricalIssue, smartDevice, garageDoorService]);

  // ── Summary title / subtitle ──────────────────────────────────────────────
  const serviceTitle = useMemo(() => {
    const typeLabel = SERVICE_TYPES.find((t) => t.id === serviceType)?.label ?? '';
    if (category === 'Appliance' && appliance) return `${appliance} ${typeLabel}`;
    if (category === 'HVAC' && hvacService) return hvacService;
    if (category === 'Plumbing' && plumbingIssue) return plumbingIssue;
    if (category === 'Electrical' && electricalIssue) return electricalIssue;
    if (category === 'Smart Home' && smartDevice) return `${smartDevice} ${smartHelp || typeLabel}`;
    if (category === 'Garage Door' && garageDoorService) return garageDoorService;
    if (category) return `${category} ${typeLabel}`;
    return 'Home Service';
  }, [category, serviceType, appliance, hvacService, plumbingIssue, electricalIssue, smartDevice, smartHelp, garageDoorService]);

  const serviceSubtitle = useMemo(() => {
    const parts: string[] = [];
    const typeLabel = SERVICE_TYPES.find((t) => t.id === serviceType)?.label ?? 'Service';
    if (category) parts.push(`${category} ${typeLabel}`);
    // avoid double "Emergency" when serviceType is already emergency
    if (hvacUrgency === 'Emergency' && serviceType !== 'emergency') parts.push('Emergency');
    else if (hvacUrgency === 'Same-Day') parts.push('Same-Day Service');
    return parts.filter(Boolean).join(' • ');
  }, [category, serviceType, hvacUrgency]);

  // ── Per-step validation ───────────────────────────────────────────────────
  const canContinue = useMemo<boolean>(() => {
    if (step === 0) return Boolean(serviceType);
    if (step === 1) {
      if (!category) return false;
      if (category === 'Appliance') return Boolean(appliance);
      if (category === 'HVAC') return Boolean(hvacService);
      if (category === 'Plumbing') return Boolean(plumbingIssue);
      if (category === 'Electrical') return Boolean(electricalIssue);
      if (category === 'Smart Home') return Boolean(smartDevice);
      if (category === 'Garage Door') return Boolean(garageDoorService);
      return true;
    }
    if (step === 2) {
      return (
        zipValidation.isValid &&
        !nameError &&
        !emailError &&
        !phoneError &&
        !addressError &&
        !cityError &&
        !stateError &&
        !preferredDateError
      );
    }
    return true;
  }, [
    step,
    serviceType,
    category,
    appliance,
    hvacService,
    plumbingIssue,
    electricalIssue,
    smartDevice,
    garageDoorService,
    zipValidation.isValid,
    nameError,
    emailError,
    phoneError,
    addressError,
    cityError,
    stateError,
    preferredDateError,
  ]);

  const handleNext = () => {
    if (serviceType === 'emergency' && step === 0) {
      navigate('/emergency-service');
      return;
    }
    if (step === 2) {
      setContactSubmitAttempted(true);
      if (!canContinue) return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const isPrefilled = prefill.serviceTypeFromUrl && Boolean(prefill.category);

  const handleBack = () => {
    if (isPrefilled && step === 1) {
      navigate(-1);
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  const resetCategoryFields = () => {
    setAppliance(''); setApplianceIssue(''); setBrand(''); setModel('');
    setHvacService(''); setHvacIssue(''); setHvacSystemType(''); setHvacUrgency('');
    setPlumbingIssue(''); setPlumbingLocation(''); setWaterLeaking('');
    setElectricalIssue(''); setElectricalSafety('');
    setSmartDevice(''); setSmartHelp('');
    setGarageDoorService(''); setGarageDoorProblem('');
    setIssueDescription('');
  };

  const handleChangeCategory = () => {
    setShowCategoryPicker(true);
    resetCategoryFields();
    setCategory('');
  };

  const handleSelectCategory = (catId: SchedulerServiceCategory) => {
    if (category !== catId) resetCategoryFields();
    setCategory(catId);
    setShowCategoryPicker(false);
  };

  const categorySummaryVisible = Boolean(category) && !showCategoryPicker;

  const toggleSlot = (iso: string, slotId: string, available: boolean) => {
    if (!available) return;
    const key = slotKey(iso, slotId);
    setSelectedSlots((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= MAX_SLOTS) return prev;
      return [...prev, key];
    });
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);

    const isEmergency = serviceType === 'emergency' || hvacUrgency === 'Emergency';
    const [firstDate] = selectedSlots[0]?.split('|') ?? [''];
    const resolvedPreferredDate = preferredDate || firstDate || null;

    const noteParts: string[] = [];
    if (appliance) noteParts.push(`Appliance: ${appliance}`);
    if (applianceIssue) noteParts.push(`Issue: ${applianceIssue}`);
    if (brand) noteParts.push(`Brand: ${brand}`);
    if (hvacService) noteParts.push(`HVAC: ${hvacService}`);
    if (hvacIssue) noteParts.push(`Problem: ${hvacIssue}`);
    if (hvacSystemType) noteParts.push(`System: ${hvacSystemType}`);
    if (plumbingIssue) noteParts.push(`Plumbing: ${plumbingIssue}`);
    if (plumbingLocation) noteParts.push(`Location: ${plumbingLocation}`);
    if (waterLeaking) noteParts.push(`Active leak: ${waterLeaking}`);
    if (electricalIssue) noteParts.push(`Electrical: ${electricalIssue}`);
    if (electricalSafety && electricalSafety !== 'No safety concern')
      noteParts.push(`Safety: ${electricalSafety}`);
    if (smartDevice) noteParts.push(`Device: ${smartDevice}`);
    if (smartHelp) noteParts.push(`Help: ${smartHelp}`);
    if (garageDoorService) noteParts.push(`Garage door: ${garageDoorService}`);
    if (garageDoorProblem) noteParts.push(`Problem: ${garageDoorProblem}`);
    if (issueDescription) noteParts.push(`Notes: ${issueDescription}`);

    const reqNum = generateRequestNumber();
    console.log('[Booking] FormData', { name, email, phone, city, stateField, zipCode, reqNum });

    try {
      const { id: bookingId, error: insertError } = await insertBooking({
        user_id: user?.id ?? null,
        request_number: reqNum,
        admin_status: 'New',
        customer_name: name,
        email,
        phone,
        zip_code: zipCode,
        street_address: address || null,
        suite_apt: suiteApt || null,
        city: city || null,
        state: stateField || null,
        service_type: SERVICE_TYPES.find((t) => t.id === serviceType)?.label ?? serviceType,
        service_category: category || (SERVICE_TYPES.find((t) => t.id === serviceType)?.label ?? ''),
        product_name: prefill.productName || appliance || hvacService || plumbingIssue || electricalIssue || smartDevice || garageDoorService || null,
        problem_type: applianceIssue || hvacIssue || plumbingIssue || electricalIssue || garageDoorProblem || null,
        system_type: hvacSystemType || null,
        brand: brand || null,
        model_number: model || null,
        issue_description: noteParts.join('\n') || issueDescription || null,
        urgency: hvacUrgency || (isEmergency ? 'Emergency' : 'Regular'),
        preferred_date: resolvedPreferredDate,
        preferred_time: slotLabels.join('; ') || null,
        status: 'New',
      });

      if (insertError) {
        console.error('[Booking] Error', insertError);
        setSubmitError('We could not save your request. Please check your information and try again.');
        setIsSubmitting(false);
        return;
      }

      console.log('[Booking] Success', { bookingId, reqNum });

      // Fire-and-forget email — booking navigation is never blocked by this
      fetch('/.netlify/functions/send-booking-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestNumber: reqNum,
          customerName: name,
          email,
          service: serviceTitle,
          preferredDate: resolvedPreferredDate ?? '',
          preferredTime: slotLabels.join('; ') || '',
        }),
      })
        .then(async (r) => {
          if (!r.ok) return;
          const json = await r.json().catch(() => ({}));
          if (json.skipped) {
            console.warn('[Booking] Email skipped because RESEND_API_KEY is missing');
            return;
          }
          if (json.success && bookingId) updateEmailSent(bookingId);
        })
        .catch((err) => console.warn('[Booking] Email send failed (non-blocking):', err));

      navigate(`/booking-confirmation/${reqNum}`, {
        replace: true,
        state: {
          requestNumber: reqNum,
          customerName: name,
          service: serviceTitle,
          category,
          preferredDate: resolvedPreferredDate ?? '',
          preferredTime: slotLabels.join('; ') || '',
        },
      });
    } catch (error) {
      console.error('[Booking] Unexpected error:', error);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared nav button bar ─────────────────────────────────────────────────
  const NavButtons = ({ isSubmitStep }: { isSubmitStep: boolean }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
      <Button
        onClick={step === 0 ? () => navigate(-1) : handleBack}
        variant="outlined"
        sx={{
          borderColor: colors.navy,
          color: colors.navy,
          textTransform: 'none',
          borderRadius: '10px',
          px: 3,
          py: 1.2,
          fontWeight: 600,
          fontFamily: fonts.body,
          '&:hover': { borderColor: colors.navy, backgroundColor: 'rgba(11,61,145,0.04)' },
        }}
      >
        {step === 0 || (isPrefilled && step === 1) ? 'Cancel' : 'Back'}
      </Button>

      {isSubmitStep ? (
        <>
          {submitError ? (
            <Typography sx={{ color: colors.emergency, fontSize: '14px', alignSelf: 'center' }}>
              {submitError}
            </Typography>
          ) : null}
          <Button
            variant="contained"
            disabled={isSubmitting}
            onClick={handleSubmit}
            sx={{
              backgroundColor: colors.primaryBlue,
              color: '#fff',
              fontFamily: fonts.body,
              fontWeight: 700,
              px: 4,
              py: 1.4,
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { backgroundColor: colors.navy },
            }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Request'}
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          disabled={step !== 2 && !canContinue}
          onClick={handleNext}
          sx={{
            color: '#fff',
            fontFamily: fonts.body,
            fontWeight: 700,
            px: 4,
            py: 1.4,
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: 'none',
            ...(step === 2 && !canContinue
              ? {
                  backgroundColor: '#CBD5E1',
                  '&:hover': { backgroundColor: '#CBD5E1' },
                }
              : {
                  backgroundColor:
                    serviceType === 'emergency' && step === 0
                      ? colors.emergency
                      : colors.primaryBlue,
                  '&:hover': {
                    backgroundColor:
                      serviceType === 'emergency' && step === 0
                        ? colors.emergencyHover
                        : colors.navy,
                  },
                }),
          }}
        >
          {serviceType === 'emergency' && step === 0 ? 'Get Emergency Help' : 'Continue'}
        </Button>
      )}
    </Box>
  );

  // ── Left panel (desktop sticky sidebar) ──────────────────────────────────
  const LeftPanel = (
    <Box sx={{ position: { md: 'sticky' }, top: { md: '152px' } }}>
      {/* Image */}
      <Box
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          mb: 2,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 8px 24px rgba(10,37,64,0.08)',
        }}
      >
        <Box
          component="img"
          src={panelInfo.image}
          alt={panelInfo.title}
          sx={{
            width: '100%',
            height: 200,
            objectFit: 'cover',
            display: 'block',
            transition: 'opacity 0.35s ease',
          }}
        />
      </Box>

      {/* Service summary */}
      {category && (
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '14px',
            border: `1px solid ${colors.border}`,
            p: 2.5,
            mb: 2,
            boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.body,
              color: colors.mutedText,
              fontSize: '0.7rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              mb: 0.5,
            }}
          >
            Selected Service
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              color: colors.navy,
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.3,
              mb: serviceSubtitle ? 0.4 : 0,
            }}
          >
            {serviceTitle}
          </Typography>
          {serviceSubtitle && (
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: colors.primaryBlue,
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              {serviceSubtitle}
            </Typography>
          )}
        </Box>
      )}

      {/* Trust bullets */}
      <Box
        sx={{
          backgroundColor: colors.lightBlueBg,
          borderRadius: '14px',
          p: 2,
          border: `1px solid ${colors.border}`,
        }}
      >
        {panelInfo.bullets.map((bullet) => (
          <Box
            key={bullet}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}
          >
            <CheckCircleIcon sx={{ fontSize: 15, color: colors.primaryBlue, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.navy }}>
              {bullet}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1.5 }} />
        <Typography
          sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.mutedText, lineHeight: 1.5 }}
        >
          Questions? Call{' '}
          <Box
            component="a"
            href="tel:3017830977"
            sx={{ color: colors.primaryBlue, fontWeight: 700, textDecoration: 'none' }}
          >
            301-783-0977
          </Box>
        </Typography>
      </Box>
    </Box>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <Box
      sx={{ minHeight: '100vh', backgroundColor: colors.background, py: { xs: 4, md: 6 } }}
    >
      <Container maxWidth="lg">
        {/* Page header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: fonts.heading,
              color: colors.navy,
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.2rem' },
            }}
          >
            Schedule Your Service
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>
            Tell us what you need and pick a time that works for you.
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={step}
          alternativeLabel
          sx={{ mb: 4, maxWidth: 640, mx: 'auto' }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  '& .MuiStepLabel-label': {
                    fontFamily: fonts.body,
                    fontSize: '0.78rem',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* ───────── Step 0: Service Type ───────── */}
        {step === 0 && (
          <Box sx={{ maxWidth: 720, mx: 'auto' }}>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                border: `1px solid ${colors.border}`,
                boxShadow: colors.cardShadow,
                p: { xs: 3, md: 5 },
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontFamily: fonts.heading, color: colors.navy, mb: 0.75 }}
              >
                What type of service do you need?
              </Typography>
              <Typography
                sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: 3, fontSize: '0.9rem' }}
              >
                Select the best description for your request.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {SERVICE_TYPES.map((type) => {
                  const active = serviceType === type.id;
                  const isEmerg = type.id === 'emergency';
                  return (
                    <Box
                      key={type.id}
                      onClick={() => setServiceType(type.id)}
                      sx={{
                        cursor: 'pointer',
                        p: { xs: 2, md: 2.5 },
                        borderRadius: '16px',
                        border: `2px solid ${active ? type.accentColor : colors.border}`,
                        backgroundColor: active
                          ? isEmerg
                            ? '#FFF5F5'
                            : colors.lightBlueBg
                          : '#fff',
                        transition: 'all 0.18s',
                        userSelect: 'none',
                        '&:hover': {
                          borderColor: type.accentColor,
                          backgroundColor: isEmerg ? '#FFF5F5' : '#F0F7FF',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          color: active ? type.accentColor : colors.mutedText,
                          mb: 1,
                          transition: 'color 0.18s',
                        }}
                      >
                        {type.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontWeight: 700,
                          color: active
                            ? isEmerg
                              ? colors.emergency
                              : colors.navy
                            : colors.navy,
                          fontSize: '0.95rem',
                          mb: 0.3,
                        }}
                      >
                        {type.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontSize: '0.78rem',
                          color: colors.mutedText,
                          lineHeight: 1.5,
                        }}
                      >
                        {type.desc}
                      </Typography>
                      {isEmerg && (
                        <Box
                          sx={{
                            mt: 1.25,
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.4,
                            backgroundColor: '#FEF2F2',
                            borderRadius: '8px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: fonts.body,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: colors.emergency,
                            }}
                          >
                            Same-day service
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {serviceType === 'emergency' && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2.5,
                    backgroundColor: '#FFF5F5',
                    borderRadius: '12px',
                    border: '1px solid #FECACA',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: 700,
                      color: colors.emergency,
                      mb: 0.5,
                      fontSize: '0.9rem',
                    }}
                  >
                    Emergency Service
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontSize: '0.85rem',
                      color: '#7F1D1D',
                      lineHeight: 1.6,
                    }}
                  >
                    Clicking Continue will open our emergency request form for priority same-day
                    response.
                  </Typography>
                </Box>
              )}

              <NavButtons isSubmitStep={false} />
            </Box>
          </Box>
        )}

        {/* ───────── Steps 1–3: Two-column layout ───────── */}
        {step > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 3 },
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'flex-start',
            }}
          >
            {/* Left panel */}
            <Box sx={{ width: { xs: '100%', md: '288px' }, flexShrink: 0 }}>
              {LeftPanel}
            </Box>

            {/* Right card */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: '20px',
                border: `1px solid ${colors.border}`,
                boxShadow: colors.cardShadow,
                p: { xs: 3, md: 4 },
                minWidth: 0,
              }}
            >
              {/* ── Step 1: Service Details ── */}
              {step === 1 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: fonts.heading, color: colors.navy, mb: 0.5 }}
                  >
                    Service Details
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      color: colors.mutedText,
                      mb: 3,
                      fontSize: '0.88rem',
                    }}
                  >
                    {categorySummaryVisible
                      ? `Tell us more about your ${category} service.`
                      : 'Select a category, then answer a few quick questions.'}
                  </Typography>

                  {categorySummaryVisible && (
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: '14px',
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.lightBlueBg,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: fonts.body,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: colors.mutedText,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            mb: 0.35,
                          }}
                        >
                          {isPrefilled && prefill.productName ? 'Selected Service' : 'Selected Service Category'}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: fonts.heading,
                            fontWeight: 700,
                            color: colors.navy,
                            fontSize: '1.05rem',
                          }}
                        >
                          {isPrefilled && prefill.productName ? prefill.productName : category}
                        </Typography>
                        {isPrefilled && prefill.productName && (
                          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.mutedText, mt: 0.25 }}>
                            {category}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                        {isPrefilled && (
                          <Button
                            variant="text"
                            onClick={() => setStep(0)}
                            sx={{
                              textTransform: 'none',
                              fontFamily: fonts.body,
                              fontWeight: 600,
                              color: colors.mutedText,
                              px: 1,
                              minWidth: 'auto',
                            }}
                          >
                            Change Service Type
                          </Button>
                        )}
                        <Button
                          variant="text"
                          onClick={handleChangeCategory}
                          sx={{
                            textTransform: 'none',
                            fontFamily: fonts.body,
                            fontWeight: 600,
                            color: colors.primaryBlue,
                            px: 1,
                            minWidth: 'auto',
                          }}
                        >
                          Change Category
                        </Button>
                      </Box>
                    </Box>
                  )}

                  {showCategoryPicker && (
                    <>
                  {/* Category grid */}
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      fontWeight: 600,
                      color: colors.navy,
                      mb: 1.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    Service Category{' '}
                    <Box component="span" sx={{ color: colors.emergency }}>
                      *
                    </Box>
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                      gap: 1.5,
                      mb: 3.5,
                    }}
                  >
                    {SERVICE_CATEGORIES.map((cat) => {
                      const active = category === cat.id;
                      return (
                        <Box
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.id as SchedulerServiceCategory)}
                          sx={{
                            cursor: 'pointer',
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: '14px',
                            textAlign: 'center',
                            border: `2px solid ${active ? colors.primaryBlue : colors.border}`,
                            backgroundColor: active ? colors.lightBlueBg : '#fff',
                            transition: 'all 0.18s',
                            userSelect: 'none',
                            '&:hover': {
                              borderColor: colors.primaryBlue,
                              backgroundColor: '#F0F7FF',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              color: active ? colors.primaryBlue : colors.mutedText,
                              mb: 0.5,
                              display: 'flex',
                              justifyContent: 'center',
                              transition: 'color 0.18s',
                            }}
                          >
                            {cat.icon}
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: fonts.body,
                              fontWeight: active ? 700 : 500,
                              color: active ? colors.navy : colors.darkText,
                              fontSize: '0.8rem',
                            }}
                          >
                            {cat.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                    </>
                  )}

                  {/* ── Appliance ── */}
                  {category === 'Appliance' && (
                    <>
                      <ChipGroup
                        label="Which appliance?"
                        required
                        options={[
                          'Refrigerator', 'Washer', 'Dryer', 'Dishwasher',
                          'Oven / Stove', 'Microwave', 'Garbage Disposal', 'Smart Appliance',
                        ]}
                        value={appliance}
                        onChange={setAppliance}
                      />
                      {appliance && (
                        <>
                          <ChipGroup
                            label="What issue are you having?"
                            options={[
                              'Not cooling', 'Leaking', 'Not spinning', 'Not draining',
                              'Not heating', 'Error code', 'Strange noise', 'Power issue',
                            ]}
                            value={applianceIssue}
                            onChange={setApplianceIssue}
                          />
                          <ChipGroup
                            label="Brand (optional)"
                            options={BRANDS}
                            value={brand}
                            onChange={setBrand}
                          />
                          <TextField
                            label="Model number (optional)"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            fullWidth
                            size="small"
                            sx={{ mb: 2.5 }}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* ── HVAC ── */}
                  {category === 'HVAC' && (
                    <>
                      <ChipGroup
                        label="What HVAC service?"
                        required
                        options={[
                          'AC Repair', 'Heating / Furnace Repair', 'Thermostat Installation',
                          'HVAC Maintenance', 'Duct Cleaning',
                        ]}
                        value={hvacService}
                        onChange={setHvacService}
                      />
                      {hvacService && (
                        <>
                          <ChipGroup
                            label="What problem are you having?"
                            options={[
                              'No cooling', 'No heat', 'Weak airflow',
                              'Strange noise', 'Thermostat issue', 'System not turning on',
                            ]}
                            value={hvacIssue}
                            onChange={setHvacIssue}
                          />
                          <ChipGroup
                            label="System type"
                            options={['Central AC', 'Furnace', 'Heat Pump', 'Mini Split', 'Thermostat', 'Other']}
                            value={hvacSystemType}
                            onChange={setHvacSystemType}
                          />
                          <ChipGroup
                            label="How urgent is this?"
                            options={['Regular', 'Same-Day', 'Emergency']}
                            value={hvacUrgency}
                            onChange={setHvacUrgency}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* ── Plumbing ── */}
                  {category === 'Plumbing' && (
                    <>
                      <ChipGroup
                        label="What plumbing issue?"
                        required
                        options={[
                          'Leak Repair', 'Drain Cleaning', 'Toilet Repair',
                          'Faucet Repair', 'Water Heater', 'Garbage Disposal', 'Pipe Repair',
                        ]}
                        value={plumbingIssue}
                        onChange={setPlumbingIssue}
                      />
                      {plumbingIssue && (
                        <>
                          <ChipGroup
                            label="Where is the issue?"
                            options={['Kitchen', 'Bathroom', 'Laundry Room', 'Basement', 'Outside', 'Whole House']}
                            value={plumbingLocation}
                            onChange={setPlumbingLocation}
                          />
                          <ChipGroup
                            label="Is water actively leaking?"
                            options={['Yes', 'No']}
                            value={waterLeaking}
                            onChange={setWaterLeaking}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* ── Electrical ── */}
                  {category === 'Electrical' && (
                    <>
                      <ChipGroup
                        label="What electrical issue?"
                        required
                        options={[
                          'Outlet / Switch', 'Light Fixture', 'Ceiling Fan',
                          'Breaker / Panel', 'Smart Switch', 'Appliance Electrical Connection',
                        ]}
                        value={electricalIssue}
                        onChange={setElectricalIssue}
                      />
                      {electricalIssue && (
                        <ChipGroup
                          label="Any safety concern?"
                          options={[
                            'Burning smell', 'Sparks', 'Breaker keeps tripping',
                            'Power outage', 'No safety concern',
                          ]}
                          value={electricalSafety}
                          onChange={setElectricalSafety}
                        />
                      )}
                    </>
                  )}

                  {/* ── Smart Home ── */}
                  {category === 'Smart Home' && (
                    <>
                      <ChipGroup
                        label="What smart device?"
                        required
                        options={[
                          'Smart Thermostat', 'Security Camera', 'Smart Doorbell',
                          'Smart Lock', 'Smart Switch', 'Smart Appliance', 'Wi-Fi Device',
                        ]}
                        value={smartDevice}
                        onChange={setSmartDevice}
                      />
                      {smartDevice && (
                        <ChipGroup
                          label="What help do you need?"
                          options={['Installation', 'Setup', 'Troubleshooting', 'App Pairing', 'Wi-Fi Connection']}
                          value={smartHelp}
                          onChange={setSmartHelp}
                        />
                      )}
                    </>
                  )}

                  {/* ── Garage Door ── */}
                  {category === 'Garage Door' && (
                    <>
                      <ChipGroup
                        label="What garage door service?"
                        required
                        options={[
                          'Repair', 'Installation', 'Opener Repair',
                          'Spring Repair', 'Track Issue', 'Remote / Sensor Issue',
                        ]}
                        value={garageDoorService}
                        onChange={setGarageDoorService}
                      />
                      {garageDoorService && (
                        <ChipGroup
                          label="What problem?"
                          options={[
                            'Door stuck', 'Noisy operation', 'Broken spring',
                            'Opener not working', 'Sensor issue',
                          ]}
                          value={garageDoorProblem}
                          onChange={setGarageDoorProblem}
                        />
                      )}
                    </>
                  )}

                  {/* Issue description (shown once category is selected) */}
                  {category && (
                    <Box sx={{ mt: 0.5 }}>
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontWeight: 600,
                          color: colors.navy,
                          mb: 1,
                          fontSize: '0.875rem',
                        }}
                      >
                        Describe the issue (optional)
                      </Typography>
                      <Box
                        component="textarea"
                        value={issueDescription}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setIssueDescription(e.target.value)
                        }
                        placeholder="Share any details that will help our technician prepare."
                        sx={{
                          width: '100%',
                          minHeight: '96px',
                          padding: '13px',
                          boxSizing: 'border-box',
                          border: `1px solid ${colors.border}`,
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontFamily: fonts.body,
                          color: colors.darkText,
                          resize: 'vertical',
                          outline: 'none',
                          transition: 'border-color 0.15s, box-shadow 0.15s',
                          '&:focus': {
                            borderColor: colors.primaryBlue,
                            boxShadow: `0 0 0 3px ${colors.lightBlueBg}`,
                          },
                          '&::placeholder': { color: colors.mutedText },
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* ── Step 2: Contact Info + Appointment ── */}
              {step === 2 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: fonts.heading, color: colors.navy, mb: 0.5 }}
                  >
                    Contact Info
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      color: colors.mutedText,
                      mb: 3,
                      fontSize: '0.88rem',
                    }}
                  >
                    We'll use this to confirm your appointment and send technician details.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="ZIP Code *"
                      value={zipCode}
                      onChange={(e) => setZipCode(normalizeZipInput(e.target.value))}
                      onBlur={() => setZipTouched(true)}
                      inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                      error={isZipFieldError(zipCode, zipTouched || contactSubmitAttempted)}
                      helperText={getZipFieldHelperText(
                        zipCode,
                        zipTouched || contactSubmitAttempted,
                      )}
                      fullWidth
                      size="small"
                    />

                    {zipValidation.isValid && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#2E7D32',
                          mt: -1,
                        }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 17 }} />
                        <Typography
                          sx={{ fontFamily: fonts.body, fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          Great — we service {zipCode}.
                        </Typography>
                      </Box>
                    )}

                    {zipValidation.isValidFormat &&
                      !zipValidation.isInServiceArea &&
                      zipCode.length === 5 && (
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '10px',
                            backgroundColor: '#FFFBEB',
                            border: '1px solid #FDE68A',
                            mt: -1,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: fonts.body,
                              fontSize: '0.85rem',
                              color: '#92400E',
                              lineHeight: 1.6,
                            }}
                          >
                            ⚠️ We can't confirm service in that area. Call{' '}
                            <Box
                              component="a"
                              href="tel:3017830977"
                              sx={{ color: '#92400E', fontWeight: 700 }}
                            >
                              301-783-0977
                            </Box>{' '}
                            to check availability.
                          </Typography>
                        </Box>
                      )}

                    <TextField
                      label="Street address (optional)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onBlur={() => setAddressTouched(true)}
                      error={showContactError(addressTouched, addressError)}
                      helperText={showContactError(addressTouched, addressError) ? addressError : ''}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Suite / Apt (optional)"
                      value={suiteApt}
                      onChange={(e) => setSuiteApt(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="City *"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => setCityTouched(true)}
                        error={showContactError(cityTouched, cityError)}
                        helperText={showContactError(cityTouched, cityError) ? cityError : ''}
                        size="small"
                        sx={{ flex: '0 0 68%' }}
                        required
                      />
                      <FormControl
                        size="small"
                        sx={{ flex: '0 0 32%' }}
                        error={showContactError(stateTouched, stateError)}
                      >
                        <InputLabel id="state-label">State *</InputLabel>
                        <Select
                          labelId="state-label"
                          label="State *"
                          value={stateField}
                          onChange={(e) => setStateField(e.target.value)}
                          onBlur={() => setStateTouched(true)}
                        >
                          {SERVICE_AREA_STATES.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </Select>
                        {showContactError(stateTouched, stateError) && (
                          <FormHelperText>{stateError}</FormHelperText>
                        )}
                      </FormControl>
                    </Box>

                    <Divider />

                    <TextField
                      label="Full name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setNameTouched(true)}
                      error={showContactError(nameTouched, nameError)}
                      helperText={showContactError(nameTouched, nameError) ? nameError : ''}
                      fullWidth
                      size="small"
                      required
                    />
                    <TextField
                      label="Email address *"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      error={showContactError(emailTouched, emailError)}
                      helperText={showContactError(emailTouched, emailError) ? emailError : ''}
                      fullWidth
                      size="small"
                      required
                    />
                    <TextField
                      label="Phone number *"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      onBlur={() => setPhoneTouched(true)}
                      error={showContactError(phoneTouched, phoneError)}
                      helperText={showContactError(phoneTouched, phoneError) ? phoneError : ''}
                      inputProps={{ inputMode: 'tel' }}
                      fullWidth
                      size="small"
                      required
                    />

                    <TextField
                      label="Preferred Date *"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => {
                        setPreferredDateTouched(true);
                        setPreferredDate(e.target.value);
                      }}
                      onBlur={() => setPreferredDateTouched(true)}
                      error={showContactError(preferredDateTouched, preferredDateError)}
                      helperText={
                        showContactError(preferredDateTouched, preferredDateError)
                          ? preferredDateError
                          : ''
                      }
                      inputProps={{ min: todayLocal }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                      required
                    />
                  </Box>

                  {/* Appointment time slots */}
                  <Box sx={{ mt: 3.5 }}>
                    <Typography
                      sx={{
                        fontFamily: fonts.heading,
                        fontWeight: 700,
                        color: colors.navy,
                        mb: 0.5,
                        fontSize: '1rem',
                      }}
                    >
                      Preferred appointment times
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: fonts.body,
                        color: colors.mutedText,
                        fontSize: '0.85rem',
                        mb: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      Select up to {MAX_SLOTS} time slots — more options helps us match you
                      faster.
                    </Typography>

                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.75,
                        py: 0.65,
                        mb: 2.5,
                        borderRadius: '999px',
                        backgroundColor: colors.lightBlueBg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 16, color: colors.primaryBlue }} />
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontSize: '0.8rem',
                          color: colors.navy,
                          fontWeight: 600,
                        }}
                      >
                        {viewCount} users viewing right now
                      </Typography>
                    </Box>

                    {selectedSlots.length > 0 && (
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          fontSize: '0.82rem',
                          color: colors.mutedText,
                          mb: 1.5,
                        }}
                      >
                        {selectedSlots.length} of {MAX_SLOTS} slots selected
                      </Typography>
                    )}

                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}
                    >
                      <Button
                        onClick={() => setDateOffset((o) => Math.max(0, o - 1))}
                        disabled={dateOffset === 0}
                        sx={{
                          minWidth: 36,
                          width: 36,
                          height: 36,
                          p: 0,
                          borderRadius: '50%',
                          color: dateOffset > 0 ? colors.navy : '#CBD5E1',
                        }}
                      >
                        <ChevronLeftIcon />
                      </Button>

                      <Box
                        sx={{
                          flex: 1,
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: `repeat(${VISIBLE_DAYS}, 1fr)`,
                          },
                          gap: 1.5,
                          minWidth: 0,
                        }}
                      >
                        {visibleDays.map((day) => (
                          <Box key={day.iso}>
                            <Typography
                              sx={{
                                fontFamily: fonts.body,
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                color: colors.navy,
                                textAlign: 'center',
                                mb: 1,
                              }}
                            >
                              {day.date.toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                              {day.slots.map((slot) => {
                                const key = slotKey(day.iso, slot.id);
                                const isSel = selectedSlots.includes(key);
                                const isDisabled =
                                  !slot.available ||
                                  (!isSel && selectedSlots.length >= MAX_SLOTS);
                                return (
                                  <Box
                                    key={key}
                                    component="button"
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() =>
                                      toggleSlot(day.iso, slot.id, slot.available)
                                    }
                                    sx={{
                                      width: '100%',
                                      py: 1,
                                      px: 1,
                                      borderRadius: '999px',
                                      border: `1px solid ${isSel ? colors.primaryBlue : '#E4E7EB'}`,
                                      backgroundColor: isSel
                                        ? colors.lightBlueBg
                                        : slot.available
                                        ? '#F5F7FA'
                                        : '#FAFBFC',
                                      color: slot.available ? colors.navy : '#CBD5E1',
                                      fontFamily: fonts.body,
                                      fontSize: '0.78rem',
                                      fontWeight: isSel ? 700 : 500,
                                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                                      opacity: slot.available ? 1 : 0.5,
                                      transition: 'all 0.15s',
                                      boxShadow: isSel
                                        ? '0 2px 8px rgba(26,115,232,0.12)'
                                        : 'none',
                                      '&:hover': !isDisabled
                                        ? {
                                            borderColor: colors.primaryBlue,
                                            backgroundColor: isSel
                                              ? colors.lightBlueBg
                                              : '#fff',
                                          }
                                        : {},
                                    }}
                                  >
                                    {slot.label}
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        ))}
                      </Box>

                      <Button
                        onClick={() =>
                          setDateOffset((o) =>
                            Math.min(schedule.length - VISIBLE_DAYS, o + 1),
                          )
                        }
                        disabled={dateOffset + VISIBLE_DAYS >= schedule.length}
                        sx={{
                          minWidth: 36,
                          width: 36,
                          height: 36,
                          p: 0,
                          borderRadius: '50%',
                          color:
                            dateOffset + VISIBLE_DAYS < schedule.length
                              ? colors.navy
                              : '#CBD5E1',
                        }}
                      >
                        <ChevronRightIcon />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* ── Step 3: Review & Submit ── */}
              {step === 3 && (
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontFamily: fonts.heading, color: colors.navy, mb: 0.5 }}
                  >
                    Review Your Request
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body,
                      color: colors.mutedText,
                      mb: 3,
                      fontSize: '0.88rem',
                    }}
                  >
                    Please verify your details before submitting.
                  </Typography>

                  <Box
                    sx={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: '14px',
                      overflow: 'hidden',
                    }}
                  >
                    {[
                      [
                        'Service Type',
                        SERVICE_TYPES.find((t) => t.id === serviceType)?.label ?? '',
                      ],
                      ['Category', category || '—'],
                      ['Service', serviceTitle],
                      ...(brand ? [['Brand', brand]] : []),
                      ...(model ? [['Model', model]] : []),
                      ...(hvacSystemType ? [['System Type', hvacSystemType]] : []),
                      ...(hvacUrgency ? [['Urgency', hvacUrgency]] : []),
                      ...(plumbingLocation ? [['Issue Location', plumbingLocation]] : []),
                      ...(waterLeaking ? [['Active Leak', waterLeaking]] : []),
                      ...(electricalSafety ? [['Safety Concern', electricalSafety]] : []),
                      ...(smartHelp ? [['Help Needed', smartHelp]] : []),
                      ['ZIP Code', zipCode],
                      ...(address ? [['Address', [address, suiteApt].filter(Boolean).join(', ')]] : []),
                      ...([city, stateField].filter(Boolean).length > 0 ? [['City / State', [city, stateField].filter(Boolean).join(', ')]] : []),
                      ['Name', name],
                      ['Email', email],
                      ['Phone', phone],
                      ['Preferred Date', preferredDate || '—'],
                      [
                        'Availability',
                        slotLabels.length ? slotLabels.join('; ') : 'Will confirm by phone',
                      ],
                    ].map(([label, value], idx, arr) => (
                      <React.Fragment key={label}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            px: 2.5,
                            py: 1.2,
                            gap: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: fonts.body,
                              color: colors.mutedText,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: fonts.body,
                              color: colors.navy,
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              textAlign: 'right',
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                        {idx < arr.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </Box>

                  {issueDescription && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: colors.lightBlueBg,
                        borderRadius: '10px',
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          color: colors.mutedText,
                          fontSize: '0.75rem',
                          mb: 0.5,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Issue Description
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.body,
                          color: colors.navy,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {issueDescription}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <NavButtons isSubmitStep={step === STEPS.length - 1} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SchedulerPage;
