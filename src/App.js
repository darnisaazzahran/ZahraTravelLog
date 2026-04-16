import React, { useState, useEffect, useMemo, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

// --- ICONS (Inline SVG) ---
const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);
const WalletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PlaneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 5.5-4 4-2.5-.5L1 18l4 2.5L7.5 23l1-1.5-.5-2.5 4-4 5.5 6h1.2c.4-.2.7-.6.6-1.1Z" />
  </svg>
);
const TrainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="16" x="4" y="3" rx="2" />
    <path d="M4 11h16" />
    <path d="M12 3v8" />
    <path d="m8 19-2 3" />
    <path d="m16 19 2 3" />
    <path d="M8 15h0" />
    <path d="M16 15h0" />
  </svg>
);
const BusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6v6" />
    <path d="M15 6v6" />
    <path d="M2 12h19.6" />
    <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="15" cy="18" r="2" />
  </svg>
);
const ShipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
    <path d="M12 10v4" />
  </svg>
);
const CarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);
const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>
);
const RouteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </svg>
);
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);
const CloudIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);
const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);
const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const LogOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const AlertTriangleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// --- DYNAMIC ICON COMPONENT ---
const TransportIcon = ({ type }) => {
  switch (type) {
    case "Pesawat":
      return <PlaneIcon />;
    case "Kereta":
      return <TrainIcon />;
    case "Bus":
      return <BusIcon />;
    case "Kapal":
      return <ShipIcon />;
    case "Travel/Mobil":
      return <CarIcon />;
    default:
      return <PlaneIcon />;
  }
};

// --- HELPERS ---
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return (
    d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) +
    " " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
};
const getDaysArray = (start, end) => {
  const arr = [];
  let dt = new Date(start);
  const endDt = new Date(end);
  let dayNum = 1;
  while (dt <= endDt) {
    arr.push({
      day: `Hari ${dayNum}`,
      date: new Date(dt).toISOString().split("T")[0],
    });
    dt.setDate(dt.getDate() + 1);
    dayNum++;
  }
  return arr;
};

const generateGCalLink = (title, date, time, location, details) => {
  try {
    const startDateTime = new Date(`${date}T${time || "08:00"}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const formatStr = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates = `${formatStr(startDateTime)}/${formatStr(endDateTime)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${dates}&location=${encodeURIComponent(
      location || ""
    )}&details=${encodeURIComponent(details || "")}`;
  } catch (e) {
    return "#";
  }
};

// --- FIREBASE SETUP ---
const myFirebaseConfig = {
  apiKey: "AIzaSyCI5Qk3PfoVdSuQVzoqszdDGvvJVH2aZnA",
  authDomain: "tripplanner-921c2.firebaseapp.com",
  projectId: "tripplanner-921c2",
  storageBucket: "tripplanner-921c2.firebasestorage.app",
  messagingSenderId: "836982568011",
  appId: "1:836982568011:web:d5ec4d532357b0adc489ce",
  measurementId: "G-X4BC08WF9H",
};

const firebaseConfig =
  myFirebaseConfig ||
  (typeof __firebase_config !== "undefined"
    ? JSON.parse(__firebase_config)
    : null);
const appInit = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = appInit ? getAuth(appInit) : null;
const db = appInit ? getFirestore(appInit) : null;
const appId = typeof __app_id !== "undefined" ? __app_id : "trip-planner-v2";

// --- KODE REGISTRASI MASTER (Hanya untuk Pemilik Aplikasi Pertama Kali) ---
const MASTER_ADMIN_CODE = "JALANBARENG";

// --- COMPONENT: TOAST NOTIFICATION ---
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-indigo-600 text-white px-5 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-start gap-3 animate-in slide-in-from-top-10 fade-in duration-300">
      <BellIcon className="shrink-0 mt-0.5" />
      <p className="flex-1 leading-snug">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 bg-indigo-800/50 hover:bg-indigo-800 p-1.5 rounded-full transition-colors"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

// --- COMPONENT: CONFIRMATION MODAL (Pengganti window.confirm) ---
const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  isDanger = true,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <div
          className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full mb-4 ${
            isDanger
              ? "bg-red-100 text-red-600"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          <AlertTriangleIcon />
        </div>
        <p className="text-slate-800 font-bold mb-6 text-lg">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 text-white font-bold py-3.5 rounded-xl shadow-md transition-colors ${
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!document.getElementById("tailwind-cdn")) {
      const script = document.createElement("script");
      script.id = "tailwind-cdn";
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (usr) => {
        if (usr && usr.isAnonymous) {
          signOut(auth).then(() => {
            setUser(null);
            setAuthLoading(false);
          });
        } else {
          setUser(usr);
          setAuthLoading(false);
        }
      });
      return () => unsubscribe();
    } else {
      setAuthLoading(false);
    }
  }, []);

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">
        Memuat TravelPlanner...
      </div>
    );

  if (!user) return <AuthScreen />;

  return <TripManager user={user} />;
}

// --- AUTHENTICATION SCREEN (PRIVATE APP MODE: DENGAN PIN) ---
function AuthScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");

  // Generate "email bayangan" dari username yang diketik teman Anda
  const generateDummyEmail = (name) => {
    const cleanName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    return `${cleanName}@tripplanner.local`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Nama panggilan minimal 3 karakter!");
      return;
    }

    if (pin.length < 6) {
      setError("PIN harus berisi minimal 6 karakter/angka!");
      return;
    }

    const dummyEmail = generateDummyEmail(username);

    try {
      if (isRegister) {
        let isCodeValid = false;
        let isAdmin = false;
        let inviteDocRef = null;

        // Cek Apakah Menggunakan Kode Master Admin
        if (accessCode.trim().toUpperCase() === MASTER_ADMIN_CODE) {
          isCodeValid = true;
          isAdmin = true;
        } else {
          // Cek ke Database Firestore: Apakah Kode Registrasi dari Admin Valid?
          inviteDocRef = doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            "invitations",
            accessCode.trim().toUpperCase()
          );
          const snap = await getDoc(inviteDocRef);
          if (snap.exists() && !snap.data().usedBy) {
            isCodeValid = true;
          }
        }

        // Jika Kode Tidak Valid, Tolak Masuk
        if (!isCodeValid) {
          setError(
            "Akses Ditolak: Kode Registrasi salah atau sudah pernah digunakan!"
          );
          return;
        }

        // Buat Akun Firebase dengan Email Bayangan & PIN sebagai Password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          dummyEmail,
          pin
        );

        // Simpan Profil Nama
        await updateProfile(userCredential.user, {
          displayName: username.trim(),
        });
        await setDoc(
          doc(
            db,
            "artifacts",
            appId,
            "users",
            userCredential.user.uid,
            "profile",
            "data"
          ),
          {
            name: username.trim(),
            isAdmin,
          }
        );

        // Hanguskan Kode Undangan agar tidak dipakai orang lain
        if (inviteDocRef) {
          await updateDoc(inviteDocRef, {
            usedBy: username.trim(),
            usedAt: new Date().toISOString(),
            usedByUid: userCredential.user.uid,
          });
        }
      } else {
        // LOGIN (MASUK LOG) dengan Username dan PIN
        await signInWithEmailAndPassword(auth, dummyEmail, pin);
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError(
          "Nama ini sudah dipakai oleh anggota lain di grup. Mohon gunakan nama yang berbeda (misal: Budi 2)."
        );
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Nama atau PIN Pribadi yang Anda masukkan salah!");
      } else {
        setError("Gagal: " + err.message.replace("Firebase: ", ""));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80')] bg-cover bg-center flex items-center justify-center p-4 font-sans relative">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>

      <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-white/50">
        {/* Lock Icon Indicator */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white p-3 rounded-full shadow-lg border-4 border-white">
          <LockIcon />
        </div>

        <div className="text-center mb-8 mt-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Zah's <span className="text-indigo-600">TravelLog</span>
          </h1>
          <p className="text-slate-500 font-medium text-xs mt-2 bg-slate-100 py-1.5 px-3 rounded-full inline-block">
            Private Application
          </p>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl mb-4 font-bold border border-red-100 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="text"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-center"
            required
          />

          {isRegister && (
            <div className="relative animate-in slide-in-from-top-2 fade-in">
              <input
                type="text"
                placeholder="Kode Undangan (Dari Admin)"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="w-full p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-indigo-700 placeholder-indigo-400 uppercase tracking-widest text-center"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500">
                <ShieldIcon />
              </span>
            </div>
          )}

          <input
            type="password"
            placeholder="Masukkan PIN (Min. 6 Angka)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-center tracking-widest"
            required
          />

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-full shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors mt-2"
          >
            {isRegister ? "Daftar & Bergabung" : "Masuk Aplikasi"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-bold text-slate-500">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
              setAccessCode("");
            }}
            className="text-indigo-600 hover:underline"
          >
            {isRegister
              ? "Sudah punya akun? Masuk dengan PIN"
              : "Pengguna baru? Daftar dengan kode"}
          </button>

          {!isRegister && (
            <p className="text-[10px] text-slate-400 font-medium mt-4">
              Lupa PIN? Hubungi pembuat aplikasi (Admin) untuk mereset akun
              Anda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MODAL: KELOLA KODE AKSES (ADMIN ONLY) ---
function AccessManagerModal({ onClose, userName }) {
  const [invites, setInvites] = useState([]);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState(null);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "invitations"),
      (snapshot) => {
        const loaded = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        loaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInvites(loaded);
      }
    );
    return () => unsub();
  }, []);

  const handleGenerate = async () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    await setDoc(
      doc(db, "artifacts", appId, "public", "data", "invitations", newCode),
      {
        code: newCode,
        createdBy: userName,
        createdAt: new Date().toISOString(),
        usedBy: null,
        usedAt: null,
      }
    );
  };

  const executeDelete = async () => {
    if (confirmDeleteCode) {
      await deleteDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "invitations",
          confirmDeleteCode
        )
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl max-h-[85vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <ShieldIcon /> Kelola Kode Registrasi
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 bg-slate-50 rounded-full"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mb-5 shrink-0">
            <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
              Anda adalah Admin karena mendaftar dengan kode Master{" "}
              <span className="font-mono bg-amber-100 px-1 rounded">
                {MASTER_ADMIN_CODE}
              </span>
              . Buatlah kode baru di bawah ini lalu berikan kepada kawan Anda
              agar mereka bisa mendaftar di aplikasi ini. (Satu kode = Satu
              akun).
            </p>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-full shadow-md transition-colors mb-5 shrink-0 flex items-center justify-center gap-2"
          >
            <PlusIcon width="16" height="16" /> Buat Kode Akses Baru
          </button>

          <div className="overflow-y-auto pr-2 space-y-3 flex-1 scrollbar-hide">
            {invites.length === 0 && (
              <div className="text-center text-xs text-slate-400 font-bold py-8 bg-slate-50 rounded-2xl border border-slate-100">
                Belum ada riwayat kode undangan.
              </div>
            )}
            {invites.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group flex items-center justify-between hover:border-indigo-200 transition-colors"
              >
                <div>
                  <span className="font-mono font-bold text-xl text-slate-800 tracking-widest">
                    {inv.code}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    Dibuat: {formatDateTime(inv.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  {inv.usedBy ? (
                    <div>
                      <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md border border-teal-100 uppercase tracking-widest">
                        Terpakai
                      </span>
                      <p className="text-[11px] font-bold text-slate-600 mt-1.5 flex items-center gap-1 justify-end">
                        <UsersIcon width="12" height="12" /> {inv.usedBy}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 uppercase tracking-widest flex items-center gap-1">
                        <LockIcon width="10" height="10" /> Siap Pakai
                      </span>
                      <button
                        onClick={() => setConfirmDeleteCode(inv.id)}
                        className="text-[10px] text-red-500 font-bold hover:bg-red-50 px-2 py-1 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Hapus Kode
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={!!confirmDeleteCode}
        message="Hapus kode ini secara permanen?"
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteCode(null)}
      />
    </>
  );
}

// --- TRIP MANAGER (Handles Cloud/Local Data Routing) ---
function TripManager({ user }) {
  const userName = user.displayName || "Anonim";

  // Admin Verification State
  const [isAdmin, setIsAdmin] = useState(false);

  // Check Admin Role from Firestore Profile
  useEffect(() => {
    if (!db || !user) return;
    const fetchProfile = async () => {
      const snap = await getDoc(
        doc(db, "artifacts", appId, "users", user.uid, "profile", "data")
      );
      if (snap.exists() && snap.data().isAdmin) setIsAdmin(true);
    };
    fetchProfile();
  }, [user]);

  // Personal Trips (Firestore tied to UID)
  const [personalTrips, setPersonalTrips] = useState([]);

  // Shared Trips (Firestore public data + joined IDs)
  const [joinedIds, setJoinedIds] = useState(
    () => JSON.parse(localStorage.getItem("trip_manager_joined")) || []
  );
  const [sharedTrips, setSharedTrips] = useState([]);

  const [activeTripId, setActiveTripId] = useState(null);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const [globalToast, setGlobalToast] = useState(null); // System-wide toast messages

  // Sync Joined IDs
  useEffect(
    () =>
      localStorage.setItem("trip_manager_joined", JSON.stringify(joinedIds)),
    [joinedIds]
  );

  // Firebase Listeners
  useEffect(() => {
    if (!db) return;
    // Listen Personal
    const unsubPersonal = onSnapshot(
      collection(db, "artifacts", appId, "users", user.uid, "my_trips"),
      (snapshot) => {
        setPersonalTrips(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    );
    // Listen Shared
    const unsubShared = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "shared_trips"),
      (snapshot) => {
        setSharedTrips(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isShared: true,
          }))
        );
      }
    );

    return () => {
      unsubPersonal();
      unsubShared();
    };
  }, [user.uid]);

  const allTrips = useMemo(() => {
    const myShared = sharedTrips.filter((t) => joinedIds.includes(t.id));
    return [...personalTrips, ...myShared].sort((a, b) =>
      b.id.localeCompare(a.id)
    );
  }, [personalTrips, sharedTrips, joinedIds]);

  // Global Alarm / Reminder Checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const todayDate = now.toISOString().split("T")[0];
      const currentHourMin = now.toTimeString().substring(0, 5);

      allTrips.forEach((trip) => {
        if (todayDate > trip.endDate) return;
        (trip.notes || []).forEach((note) => {
          if (
            note.reminderTime === currentHourMin &&
            note.reminderFired !== true
          ) {
            setActiveAlarm(
              `ALARM [${trip.name}]: Saatnya untuk "${note.title}"!`
            );
            updateActiveTrip(
              trip.id,
              {
                notes: trip.notes.map((n) =>
                  n.id === note.id ? { ...n, reminderFired: true } : n
                ),
              },
              trip.isShared
            );
          }
        });
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [allTrips]);

  const activeTrip = allTrips.find((t) => t.id === activeTripId) || null;

  // Global Update Function
  const updateActiveTrip = async (
    tripId,
    updates,
    isShared,
    actionLogMsg = null
  ) => {
    if (!db) return;
    const targetTrip = allTrips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    let finalUpdates = { ...updates, lastEditedBy: userName };

    if (actionLogMsg) {
      const newLog = {
        id: Date.now().toString(),
        msg: actionLogMsg,
        user: userName,
        time: new Date().toISOString(),
      };
      finalUpdates.logs = [newLog, ...(targetTrip.logs || [])].slice(0, 50);
    }

    if (isShared) {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "shared_trips", tripId),
        finalUpdates
      ).catch((e) => console.error("Cloud Error", e));
    } else {
      await setDoc(
        doc(db, "artifacts", appId, "users", user.uid, "my_trips", tripId),
        { ...targetTrip, ...finalUpdates },
        { merge: true }
      );
    }
  };

  const createTrip = async (name, start, end) => {
    if (!db) return;
    const newTrip = {
      id: Date.now().toString(),
      name,
      startDate: start,
      endDate: end,
      status: "active",
      members: [userName],
      itinerary: [],
      transport: [],
      accommodation: [],
      budgets: [],
      expenses: [],
      packingList: [],
      payments: [],
      notes: [],
      logs: [
        {
          id: Date.now().toString(),
          msg: "Perjalanan dibuat",
          user: userName,
          time: new Date().toISOString(),
        },
      ],
      finalNotes: "",
    };
    await setDoc(
      doc(db, "artifacts", appId, "users", user.uid, "my_trips", newTrip.id),
      newTrip
    );
  };

  const deleteTrip = async (tripId, isShared) => {
    if (isShared) {
      setJoinedIds(joinedIds.filter((id) => id !== tripId));
    } else {
      await setDoc(
        doc(db, "artifacts", appId, "users", user.uid, "my_trips", tripId),
        { deleted: true },
        { merge: true }
      );
    }
  };

  const joinTrip = async (code) => {
    if (joinedIds.includes(code))
      return "Anda sudah ada di dalam perjalanan ini!";
    const target = sharedTrips.find((t) => t.id === code);
    if (!target)
      return "Oops! Kode tidak valid atau perjalanan tidak ditemukan.";

    setJoinedIds([...joinedIds, code]);

    if (!target.members.includes(userName)) {
      await updateActiveTrip(
        code,
        { members: [...target.members, userName] },
        true,
        `bergabung ke dalam perjalanan grup via kode.`
      );
    }
    return "OK";
  };

  const makeTripShared = async () => {
    if (!activeTrip || activeTrip.isShared || !db) return;

    const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const cleanTrip = {
      ...activeTrip,
      id: shortCode,
      logs: [
        {
          id: Date.now().toString(),
          msg: "Membuka akses sinkronasi ke anggota grup.",
          user: userName,
          time: new Date().toISOString(),
        },
      ],
    };
    delete cleanTrip.isShared;

    try {
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "shared_trips",
          shortCode
        ),
        cleanTrip
      );
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "users",
          user.uid,
          "my_trips",
          activeTripId
        ),
        { deleted: true },
        { merge: true }
      );

      setJoinedIds([...joinedIds, shortCode]);
      setActiveTripId(shortCode);
    } catch (e) {
      console.error("Gagal membagikan perjalanan", e);
    }
  };

  return (
    <>
      {activeAlarm && (
        <Toast message={activeAlarm} onClose={() => setActiveAlarm(null)} />
      )}
      {globalToast && (
        <Toast message={globalToast} onClose={() => setGlobalToast(null)} />
      )}

      {!activeTripId ? (
        <Dashboard
          trips={allTrips.filter((t) => !t.deleted)}
          onCreate={createTrip}
          onJoin={joinTrip}
          onDelete={deleteTrip}
          setActiveTripId={setActiveTripId}
          user={user}
          isAdmin={isAdmin}
          setGlobalToast={setGlobalToast}
        />
      ) : (
        <ActiveTripView
          trip={activeTrip}
          updateTrip={(updates, msg) =>
            updateActiveTrip(activeTrip.id, updates, activeTrip.isShared, msg)
          }
          goBack={() => setActiveTripId(null)}
          makeTripShared={makeTripShared}
          userName={userName}
          setGlobalToast={setGlobalToast}
        />
      )}
    </>
  );
}

// ==========================================
// KOMPONEN DASHBOARD (Manajemen Multi-Trip)
// ==========================================
function Dashboard({
  trips,
  onCreate,
  onJoin,
  onDelete,
  setActiveTripId,
  user,
  isAdmin,
  setGlobalToast,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showAccessManager, setShowAccessManager] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  // Modals Management
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !start || !end) return;
    onCreate(name, start, end);
    setShowAdd(false);
    setName("");
    setStart("");
    setEnd("");
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const res = await onJoin(joinCode.trim().toUpperCase());
    if (res === "OK") {
      setJoinCode("");
      setShowJoin(false);
      setGlobalToast("Berhasil bergabung ke dalam grup!");
    } else {
      setGlobalToast(res);
    }
  };

  const executeDeleteTrip = () => {
    if (tripToDelete) {
      onDelete(tripToDelete.id, tripToDelete.isShared);
      setTripToDelete(null);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80')] bg-cover bg-fixed bg-center text-slate-900 font-sans pb-20">
        <div className="fixed inset-0 bg-slate-100/85 backdrop-blur-[4px] -z-10"></div>

        {showAccessManager && (
          <AccessManagerModal
            onClose={() => setShowAccessManager(false)}
            userName={user.displayName}
          />
        )}

        <header className="px-5 pt-12 pb-8 relative z-10">
          <div className="flex justify-between items-start w-full max-w-md mx-auto mb-4">
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <span className="text-xs font-bold text-slate-700 truncate">
                {user.displayName || "Akun Pribadi"}{" "}
                {isAdmin && (
                  <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 rounded ml-1 tracking-widest uppercase shrink-0">
                    Admin
                  </span>
                )}
              </span>
            </div>

            <div className="flex gap-2 shrink-0 ml-2">
              {isAdmin && (
                <button
                  onClick={() => setShowAccessManager(true)}
                  className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-sm border border-white text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase shrink-0"
                  title="Kelola Kode Akses Pendaftaran"
                >
                  <ShieldIcon /> Akses
                </button>
              )}
              <button
                onClick={() => setConfirmLogout(true)}
                className="bg-white/80 backdrop-blur-md p-2.5 rounded-full shadow-sm border border-white text-slate-500 hover:text-red-500 transition-colors cursor-pointer relative z-20 shrink-0"
                title="Keluar"
              >
                <LogOutIcon />
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl px-10 py-7 rounded-[2.5rem] shadow-sm border border-white/60 text-center w-full max-w-md mx-auto mt-2">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Zah's <span className="text-indigo-600">TravelLog</span>
            </h1>
            {/* <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">
              Edisi Privat Lintas Perangkat
            </p> */}

            <div className="flex items-center justify-center py-1 px-4">
              <div className="text-center">
                {/* Main Quote */}
                <h1 className="text-1xl md:text-3xl font-semibold tracking-wide bg-gradient-to-r from-slate-700 via-slate-500 to-amber-600 bg-clip-text text-transparent font-serif">
                  Plan it. Go it. Live it.
                </h1>

                {/* Divider */}
                <div className="flex items-center justify-center my-2">
                  <div className="h-[1px] w-16 bg-slate-300"></div>
                  <span className="mx-3 text-slate-400 text-sm">✈️</span>
                  <div className="h-[1px] w-16 bg-slate-300"></div>
                </div>

                {/* Sub Quote */}
                <p className="text-sm md:text-base text-slate-500 italic tracking-wide">
                  Wujudkan wishlist, jelajahi dunia
                  <span className="ml-0.5 inline-block animate-pulse">🌍</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-md mx-auto px-5 mt-2 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl text-slate-900 drop-shadow-sm">
              Daftar Perjalanan
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowJoin(!showJoin);
                  setShowAdd(false);
                }}
                className="bg-white hover:bg-slate-50 text-indigo-600 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border border-slate-200"
              >
                <LinkIcon /> Gabung Kode
              </button>
              <button
                onClick={() => {
                  setShowAdd(!showAdd);
                  setShowJoin(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
              >
                <PlusIcon /> Trip Baru
              </button>
            </div>
          </div>

          {showJoin && (
            <form
              onSubmit={handleJoinSubmit}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg border border-white mb-8 animate-in fade-in slide-in-from-top-4"
            >
              <h3 className="font-bold text-lg mb-2 text-slate-900">
                Gabung Trip Bersama
              </h3>
              <p className="text-xs text-slate-500 font-medium mb-4">
                Masukkan 6 digit kode sinkronasi dari anggota grup.
              </p>
              <input
                type="text"
                placeholder="Cth: BALI24"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 text-center tracking-widest text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 shadow-md transition-colors"
              >
                Verifikasi & Gabung
              </button>
            </form>
          )}

          {showAdd && (
            <form
              onSubmit={handleCreate}
              className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg border border-white mb-8 animate-in fade-in slide-in-from-top-4"
            >
              <h3 className="font-bold text-lg mb-4 text-slate-900">
                Petualangan Baru
              </h3>
              <input
                type="text"
                placeholder="Destinasi (cth: Bali, Tokyo)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider ml-1 mb-1 block">
                    Mulai
                  </label>
                  <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 font-bold uppercase tracking-wider ml-1 mb-1 block">
                    Selesai
                  </label>
                  <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min={start}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
                >
                  Simpan Kisah
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {trips.length === 0 && !showAdd && !showJoin && (
              <div className="text-center py-14 bg-white/70 backdrop-blur-md rounded-[2rem] border-2 border-slate-300 border-dashed shadow-sm">
                <p className="text-slate-500 font-bold text-sm mb-1">
                  Daftar masih kosong.
                </p>
                <p className="text-[10px] font-medium text-slate-400">
                  Tekan "Trip Baru" untuk menulis rencana.
                </p>
              </div>
            )}
            {trips.map((trip) => {
              const isPastEnd = today > trip.endDate;
              const isOngoing =
                today >= trip.startDate && today <= trip.endDate;
              return (
                <div
                  key={trip.id}
                  onClick={() => setActiveTripId(trip.id)}
                  className="bg-white/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-sm border border-slate-200 cursor-pointer transition-all hover:scale-[1.02] flex justify-between items-center group relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 left-0 w-2.5 h-full ${
                      isPastEnd
                        ? "bg-slate-400"
                        : isOngoing
                        ? "bg-emerald-500"
                        : "bg-indigo-500"
                    } rounded-l-[2rem]`}
                  ></div>
                  <div className="pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-slate-900">
                        {trip.name}
                      </h3>
                      {isPastEnd && (
                        <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-slate-200">
                          Telah Usai
                        </span>
                      )}
                      {isOngoing && (
                        <span className="bg-emerald-50 text-emerald-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-200">
                          Sedang Berjalan
                        </span>
                      )}
                      {!isPastEnd && !isOngoing && (
                        <span className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-indigo-100">
                          Akan Datang
                        </span>
                      )}
                      {trip.isShared && (
                        <span className="bg-sky-50 text-sky-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-sky-100 flex items-center gap-1">
                          <CloudIcon width="10" height="10" /> Grup
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[10px] bg-slate-50 text-slate-600 px-3 py-1 rounded-full font-bold border border-slate-100">
                        {(trip.members || []).length} Anggota
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTripToDelete(trip);
                    }}
                    className="text-slate-400 hover:text-red-500 bg-white shadow-sm hover:bg-red-50 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-slate-100"
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={confirmLogout}
        message="Keluar dan kunci aplikasi ini?"
        onConfirm={() => signOut(auth)}
        onCancel={() => setConfirmLogout(false)}
      />
      <ConfirmModal
        isOpen={!!tripToDelete}
        message={
          tripToDelete?.isShared
            ? "Hapus grup ini dari daftar Anda? (Data di awan tetap ada untuk anggota lain)"
            : "Hapus jejak perjalanan ini secara permanen?"
        }
        onConfirm={executeDeleteTrip}
        onCancel={() => setTripToDelete(null)}
      />
    </>
  );
}

// ==========================================
// KOMPONEN ACTIVE TRIP (Detail Perjalanan)
// ==========================================
function ActiveTripView({
  trip,
  updateTrip,
  goBack,
  makeTripShared,
  userName,
  setGlobalToast,
}) {
  const todayDate = new Date().toISOString().split("T")[0];
  const isPastEnd = todayDate > trip.endDate;
  const shouldShowRecapFirst = isPastEnd;

  const [mainTab, setMainTab] = useState(
    shouldShowRecapFirst ? "recap" : "home"
  );
  const [showEditTrip, setShowEditTrip] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  // Edit Trip Handler
  const [editName, setEditName] = useState(trip.name);
  const [editStart, setEditStart] = useState(trip.startDate);
  const [editEnd, setEditEnd] = useState(trip.endDate);

  const handleUpdateTripInfo = (e) => {
    e.preventDefault();
    updateTrip(
      { name: editName, startDate: editStart, endDate: editEnd },
      `memperbarui info destinasi utama.`
    );
    setShowEditTrip(false);
  };

  const handleEndTrip = () => {
    setMainTab("recap");
  };

  const copyToClipboard = (text) => {
    document.execCommand("copy");
    setGlobalToast(
      `Kode Kolaborasi: ${text} berhasil disalin! Minta kawan mendaftar menggunakan Kode Rahasia Aplikasi, lalu gabung grup menggunakan kode kolaborasi ini.`
    );
  };

  const logs = trip.logs || [];

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80')] bg-cover bg-fixed bg-center text-slate-900 font-sans pb-28">
      <div className="fixed inset-0 bg-slate-100/85 backdrop-blur-md -z-10"></div>

      {/* HEADER KHUSUS TRIP */}
      <header className="bg-white/95 backdrop-blur-xl px-5 pt-12 pb-6 shadow-sm border-b border-slate-200 rounded-b-[2.5rem] relative z-20 flex flex-col items-center">
        <div className="flex justify-between items-center w-full max-w-md gap-3">
          <button
            onClick={goBack}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-700 rounded-full hover:bg-slate-100 transition-colors shrink-0 flex-none"
          >
            <HomeIcon />
          </button>

          <div className="text-center flex-1 min-w-0 overflow-hidden">
            <h1 className="text-xl font-bold text-slate-900 truncate leading-tight">
              {trip.name}
            </h1>
            <p className="text-slate-500 text-[11px] font-medium mt-1 truncate">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
            {trip.lastEditedBy && (
              <p className="text-[9px] text-indigo-500 font-bold mt-1.5 uppercase tracking-wider truncate">
                Aktivitas terakhir: {trip.lastEditedBy}
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0 flex-none">
            {trip.isShared && (
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="relative w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-700 rounded-full hover:bg-slate-100 transition-colors shrink-0 flex-none"
              >
                <BellIcon />
                {logs.length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>
            )}
            <button
              onClick={() => {
                setEditName(trip.name);
                setEditStart(trip.startDate);
                setEditEnd(trip.endDate);
                setShowEditTrip(true);
              }}
              className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-700 rounded-full hover:bg-slate-100 transition-colors shrink-0 flex-none"
            >
              <EditIcon />
            </button>
          </div>
        </div>

        {/* NOTIFICATION LOGS DROPDOWN */}
        {showLogs && trip.isShared && (
          <div className="absolute top-[80px] right-5 w-72 bg-white rounded-[1.5rem] shadow-2xl border border-slate-200 p-4 z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Jejak Aktivitas
              </h4>
              <button
                onClick={() => setShowLogs(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <CloseIcon />
              </button>
            </div>
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium">
                Belum ada aktivitas baru.
              </p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex gap-3 items-start border-b border-slate-50 pb-2"
                  >
                    <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                      {log.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700 leading-tight">
                        <span className="font-bold text-slate-900">
                          {log.user}
                        </span>{" "}
                        {log.msg}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1 font-bold">
                        {formatDateTime(log.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cloud Sync Status / Button */}
        <div className="w-full max-w-md mt-5 flex justify-center">
          {trip.isShared ? (
            <div
              onClick={() => copyToClipboard(trip.id)}
              className="bg-sky-50 border border-sky-100 px-4 py-2 rounded-full flex items-center gap-3 cursor-pointer hover:bg-sky-100 transition-colors shadow-sm"
              title="Klik untuk salin kode"
            >
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-sky-700 uppercase tracking-widest">
                <CloudIcon /> Grup Publik (Live)
              </span>
              <span className="w-px h-4 bg-sky-200"></span>
              <span className="text-xs font-bold text-sky-900 tracking-widest">
                KODE: {trip.id}
              </span>
              <CopyIcon className="text-sky-500" />
            </div>
          ) : (
            <button
              onClick={makeTripShared}
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full flex items-center gap-2 text-[11px] font-bold transition-all shadow-md"
            >
              <CloudIcon /> Jadikan Grup (Sinkronasi)
            </button>
          )}
        </div>
      </header>

      {/* EDIT TRIP INFO MODAL */}
      {showEditTrip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-slate-900 pr-2 truncate">
                Ubah Informasi Perjalanan
              </h3>
              <button
                onClick={() => setShowEditTrip(false)}
                className="text-slate-400 hover:text-slate-600 p-1 shrink-0 flex-none"
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleUpdateTripInfo}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-1">
                    Destinasi Baru
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-1">
                      Mulai
                    </label>
                    <input
                      type="date"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-1">
                      Selesai
                    </label>
                    <input
                      type="date"
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                      required
                      min={editStart}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold text-sm py-3.5 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto px-5 mt-6 relative z-10">
        {/* End Trip Button */}
        {mainTab === "home" && !isPastEnd && (
          <div className="flex justify-end mb-4 animate-in fade-in">
            <button
              onClick={handleEndTrip}
              className="text-xs bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 font-bold px-5 py-2.5 rounded-full transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <StarIcon /> Akhiri Petualangan
            </button>
          </div>
        )}

        {mainTab === "home" && (
          <TripDashboardTab
            trip={trip}
            updateTrip={updateTrip}
            userName={userName}
          />
        )}
        {mainTab === "plan" && (
          <PlanTab trip={trip} updateTrip={updateTrip} userName={userName} />
        )}
        {mainTab === "finance" && (
          <FinanceTab
            trip={trip}
            updateTrip={updateTrip}
            userName={userName}
            setGlobalToast={setGlobalToast}
          />
        )}
        {mainTab === "members" && (
          <MembersTab
            trip={trip}
            updateTrip={updateTrip}
            userName={userName}
            setGlobalToast={setGlobalToast}
          />
        )}
        {mainTab === "recap" && (
          <TripSummaryTab
            trip={trip}
            setMainTab={setMainTab}
            updateTrip={updateTrip}
            userName={userName}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 pb-safe shadow-[0_-5px_20px_rgb(0,0,0,0.05)] z-50 rounded-t-[2.5rem]">
        <div className="max-w-md mx-auto flex justify-around p-3">
          <button
            onClick={() => setMainTab("home")}
            className={`flex flex-col items-center p-2 w-16 transition-all ${
              mainTab === "home"
                ? "text-indigo-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <DashboardIcon />
            <span className="text-[10px] font-bold mt-1">Timeline</span>
          </button>
          <button
            onClick={() => setMainTab("plan")}
            className={`flex flex-col items-center p-2 w-16 transition-all ${
              mainTab === "plan"
                ? "text-indigo-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <MapIcon />
            <span className="text-[10px] font-bold mt-1">Rencana</span>
          </button>
          <button
            onClick={() => setMainTab("finance")}
            className={`flex flex-col items-center p-2 w-16 transition-all ${
              mainTab === "finance"
                ? "text-indigo-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <WalletIcon />
            <span className="text-[10px] font-bold mt-1">Keuangan</span>
          </button>
          <button
            onClick={() => setMainTab("members")}
            className={`flex flex-col items-center p-2 w-16 transition-all ${
              mainTab === "members"
                ? "text-indigo-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <UsersIcon />
            <span className="text-[10px] font-bold mt-1">Grup</span>
          </button>
          {(isPastEnd || mainTab === "recap") && (
            <button
              onClick={() => setMainTab("recap")}
              className={`flex flex-col items-center p-2 w-16 transition-all ${
                mainTab === "recap"
                  ? "text-orange-500 scale-110"
                  : "text-slate-400 hover:text-orange-400"
              }`}
            >
              <StarIcon />
              <span className="text-[10px] font-bold mt-1">Rekap</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

// ==========================================
// KOMPONEN DASHBOARD REKAP AKHIR (Trip Selesai)
// ==========================================
function TripSummaryTab({ trip, setMainTab, updateTrip, userName }) {
  const today = new Date().toISOString().split("T")[0];
  const totalDaysArray = getDaysArray(trip.startDate, trip.endDate);
  const totalDays = totalDaysArray.length;

  let elapsedDays = 0;
  if (today < trip.startDate) elapsedDays = 0;
  else if (today > trip.endDate) elapsedDays = totalDays;
  else elapsedDays = getDaysArray(trip.startDate, today).length;

  const remainingDays = totalDays - elapsedDays;

  // Calculations Financial
  const totalBudget = (trip.budgets || []).reduce(
    (sum, b) =>
      sum +
      (b.type === "person" ? b.amount * (trip.members || []).length : b.amount),
    0
  );
  const totalSpent = (trip.expenses || []).reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const budgetPercentage =
    totalBudget === 0 ? 0 : Math.min((totalSpent / totalBudget) * 100, 100);
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  // Calculate Settlement Status with proper payment reduction
  const balances = {};
  (trip.members || []).forEach((m) => (balances[m] = 0));
  (trip.expenses || []).forEach((exp) => {
    balances[exp.paidBy] += exp.amount;
    const splitCost = exp.amount / exp.split.length;
    exp.split.forEach((person) => {
      balances[person] -= splitCost;
    });
  });

  (trip.payments || []).forEach((pay) => {
    if (balances[pay.from] !== undefined) balances[pay.from] += pay.amount;
    if (balances[pay.to] !== undefined) balances[pay.to] -= pay.amount;
  });

  let debtors = [],
    creditors = [],
    remainingDebts = [];
  Object.keys(balances).forEach((p) => {
    if (balances[p] < -0.01) debtors.push({ p, amount: Math.abs(balances[p]) });
    else if (balances[p] > 0.01) creditors.push({ p, amount: balances[p] });
  });
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    let d = debtors[i],
      c = creditors[j];
    let amount = Math.min(d.amount, c.amount);
    remainingDebts.push({ from: d.p, to: c.p, amount });
    d.amount -= amount;
    c.amount -= amount;
    if (d.amount < 0.01) i++;
    if (c.amount < 0.01) j++;
  }

  const isAllSettled = remainingDebts.length === 0;

  // Calculate Itinerary Progress
  const totalItin = (trip.itinerary || []).length;
  const doneItinItems = (trip.itinerary || []).filter((i) => i.done);
  const missedItinItems = (trip.itinerary || []).filter((i) => !i.done);
  const doneItin = doneItinItems.length;
  const itinPercentage = totalItin === 0 ? 0 : (doneItin / totalItin) * 100;

  let payerMap = {};
  (trip.expenses || []).forEach((e) => {
    payerMap[e.paidBy] = (payerMap[e.paidBy] || 0) + e.amount;
  });
  const topPayer =
    Object.keys(payerMap).length > 0
      ? Object.keys(payerMap).sort((a, b) => payerMap[b] - payerMap[a])[0]
      : null;

  // Payment Handlers
  const handlePayDebt = (from, to, amount) => {
    updateTrip(
      {
        payments: [
          ...(trip.payments || []),
          {
            id: Date.now().toString(),
            from,
            to,
            amount,
            date: new Date().toISOString(),
          },
        ],
      },
      `mencatat pelunasan ${formatRupiah(amount)} dari ${from} ke ${to}.`
    );
  };

  const handleUndoPayment = (id) => {
    updateTrip(
      { payments: (trip.payments || []).filter((p) => p.id !== id) },
      `membatalkan status pelunasan.`
    );
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-5 pb-10">
      {/* Banner */}
      <div
        className={`bg-gradient-to-br ${
          remainingDays > 0
            ? "from-indigo-500 to-purple-600"
            : "from-orange-400 to-rose-500"
        } p-6 rounded-[2rem] text-white shadow-lg text-center relative overflow-hidden`}
      >
        <div className="absolute -top-10 -right-10 text-white/20">
          <StarIcon />
        </div>
        <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
          Rangkuman Perjalanan
        </p>

        {remainingDays > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Masih Berjalan! 🌍</h2>
            <p className="text-sm font-medium text-white/90">
              Ini adalah catatan di <b>hari ke-{elapsedDays}</b>. Teruskan
              langkahmu, masih ada sisa <b>{remainingDays} hari</b> untuk
              dieksplor!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-1">Perjalanan Selesai 📖</h2>
            <p className="text-sm font-medium text-white/90">
              Setiap perjalanan punya akhirnya. Semoga memori indah tersimpan
              abadi.
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => setMainTab("home")}
        className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-full shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
      >
        <HomeIcon /> Kembali ke Garis Waktu
      </button>

      {/* Recap Stats (Days & Member) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <span className="block text-2xl font-bold text-indigo-600">
            {totalDays}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Total Hari
          </span>
        </div>
        <div className="bg-white/95 backdrop-blur-xl p-5 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <span className="block text-2xl font-bold text-rose-500">
            {(trip.members || []).length}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Total Anggota
          </span>
        </div>
      </div>

      {/* Itinerary Details */}
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
          <MapIcon /> Status Agenda
        </h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 36 36"
              className="w-full h-full transform -rotate-90"
            >
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${itinPercentage}, 100`}
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-xs font-bold text-slate-900">
              {doneItin}/{totalItin}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Tercapai {itinPercentage.toFixed(0)}%
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Dari total {totalItin} agenda yang direncanakan.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {doneItinItems.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                ✅ Berhasil Dikunjungi:
              </p>
              <ul className="text-xs font-medium text-slate-700 space-y-1.5 pl-1">
                {doneItinItems.map((i) => (
                  <li key={i.id} className="flex gap-2 items-start">
                    <span className="text-indigo-500">•</span> {i.activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {missedItinItems.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">
                ❌ Terlewat / Dibatalkan:
              </p>
              <ul className="text-xs font-medium text-slate-500 space-y-1.5 pl-1">
                {missedItinItems.map((i) => (
                  <li key={i.id} className="flex gap-2 items-start">
                    <span className="text-orange-400">•</span> {i.activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg text-slate-900 mb-5 flex items-center gap-2">
          <WalletIcon /> Rekap Keuangan
        </h3>

        <div className="mb-5">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Pengeluaran
            </span>
            <span
              className={`text-xl font-bold ${
                isOverBudget ? "text-red-600" : "text-slate-900"
              }`}
            >
              {formatRupiah(totalSpent)}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isOverBudget ? "bg-red-500" : "bg-indigo-500"
              }`}
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>Anggaran: {formatRupiah(totalBudget)}</span>
            <span>{budgetPercentage.toFixed(0)}% Terpakai</span>
          </div>
          {isOverBudget && (
            <p className="text-[11px] text-red-600 mt-2 font-bold bg-red-50 p-2 rounded-lg border border-red-100">
              Over-budget sebesar {formatRupiah(totalSpent - totalBudget)} 😅
            </p>
          )}
          {!isOverBudget && totalBudget > 0 && (
            <p className="text-[11px] text-indigo-700 mt-2 font-bold bg-indigo-50 p-2 rounded-lg border border-indigo-100">
              Sisa anggaran {formatRupiah(totalBudget - totalSpent)} 🤑
            </p>
          )}
        </div>

        {/* Debt Settlement Status */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Status Tagihan Anggota
          </h4>
          {totalSpent === 0 ? (
            <p className="text-xs font-medium text-slate-500">
              Belum ada pengeluaran yang dicatat.
            </p>
          ) : isAllSettled ? (
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center gap-3">
              <div className="text-indigo-500">
                <CheckIcon />
              </div>
              <p className="text-xs font-bold text-indigo-700">
                Semua tagihan anggota telah lunas!
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
              <p className="text-[11px] font-bold text-red-600 mb-2">
                Masih ada tagihan yang belum lunas:
              </p>
              <div className="space-y-2">
                {remainingDebts.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className="font-semibold text-slate-700">
                      {s.from}{" "}
                      <span className="font-normal text-slate-500 text-[10px]">
                        berhutang ke
                      </span>{" "}
                      {s.to}
                    </span>
                    <span className="font-bold text-red-500">
                      {formatRupiah(s.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {topPayer && (
          <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-100 flex items-center gap-4 mt-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-lg shadow-sm">
              👑
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                Bendahara / Talangan Terbesar
              </p>
              <p className="text-sm font-bold text-slate-900">
                {topPayer}{" "}
                <span className="font-medium text-slate-600 text-xs">
                  ({formatRupiah(payerMap[topPayer])})
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Catatan Akhir Perjalanan */}
      <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
          <BookIcon /> Catatan Pribadi Perjalanan
        </h3>
        <p className="text-xs font-medium text-slate-500 mb-4">
          Tuliskan pengalaman seru, kejadian tak terduga, atau evaluasi untuk
          perjalanan berikutnya.
        </p>
        <textarea
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
          placeholder="Tuliskan pengalamanmu di sini..."
          value={trip.finalNotes || ""}
          onChange={(e) =>
            updateTrip(
              { finalNotes: e.target.value },
              `memperbarui catatan akhir perjalanan.`
            )
          }
        />
      </div>
    </div>
  );
}

// --- SUB-TABS: BERANDA (Master Timeline Gabungan) ---
function TripDashboardTab({ trip, updateTrip, userName }) {
  const mergedTimeline = useMemo(() => {
    let events = [];
    (trip.itinerary || []).forEach((i) => {
      events.push({
        ...i,
        source: "itinerary",
        icon: <MapPinIcon />,
        color: "bg-indigo-500 text-white",
      });
    });
    (trip.transport || []).forEach((t) => {
      const titleDep = `Keberangkatan: ${t.origin} ke ${t.dest}`;
      if (t.depDate)
        events.push({
          id: t.id + "-dep",
          date: t.depDate,
          time: t.depTime || "00:00",
          activity: titleDep,
          location: t.origin,
          source: "transport",
          icon: <TransportIcon type={t.type} />,
          color: "bg-sky-500 text-white",
          eventTitle: titleDep,
        });
      const titleArr = `Tiba di ${t.dest}`;
      if (t.arrDate)
        events.push({
          id: t.id + "-arr",
          date: t.arrDate,
          time: t.arrTime || "00:00",
          activity: titleArr,
          location: t.dest,
          source: "transport",
          icon: <MapPinIcon />,
          color: "bg-blue-400 text-white",
          eventTitle: titleArr,
        });
    });
    (trip.accommodation || []).forEach((h) => {
      const titleIn = `Check-in: ${h.name}`;
      if (h.inDate)
        events.push({
          id: h.id + "-in",
          date: h.inDate,
          time: "14:00",
          activity: titleIn,
          location: h.name,
          source: "hotel",
          icon: <BedIcon />,
          color: "bg-amber-500 text-white",
          eventTitle: titleIn,
        });
      const titleOut = `Check-out: ${h.name}`;
      if (h.outDate)
        events.push({
          id: h.id + "-out",
          date: h.outDate,
          time: "12:00",
          activity: titleOut,
          location: h.name,
          source: "hotel",
          icon: <BedIcon />,
          color: "bg-orange-500 text-white",
          eventTitle: titleOut,
        });
    });
    return events.sort((a, b) => {
      const dateA = a.date || "9999-99-99";
      const dateB = b.date || "9999-99-99";
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      const timeA = a.time || "23:59";
      const timeB = b.time || "23:59";
      return timeA.localeCompare(timeB);
    });
  }, [trip]);

  const todayDate = new Date().toISOString().split("T")[0];
  const isTripActiveNow =
    todayDate >= trip.startDate && todayDate <= trip.endDate;
  const [viewMode, setViewMode] = useState(isTripActiveNow ? "today" : "all");

  const displayedTimeline =
    viewMode === "today"
      ? mergedTimeline.filter((e) => e.date === todayDate)
      : mergedTimeline;
  const groupedTimeline = displayedTimeline.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const toggleItinDone = (id, activity) => {
    const newItin = trip.itinerary.map((i) =>
      i.id === id ? { ...i, done: !i.done } : i
    );
    const item = newItin.find((i) => i.id === id);
    const msg = item.done
      ? `telah mengunjungi ${activity}.`
      : `membatalkan kunjungan ke ${activity}.`;
    updateTrip({ itinerary: newItin }, msg);
  };

  // Filter notes for Dashboard display
  const dashboardNotes = (trip.notes || []).filter((n) => {
    if (viewMode === "all") return true;
    return n.noteDay === "Umum" || n.noteDay === todayDate;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Kartu Catatan Penting di Bagian Atas Dashboard */}
      {dashboardNotes.length > 0 && (
        <div className="mb-8 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookIcon /> Catatan & Pengingat
          </h3>
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
            {dashboardNotes.map((n) => (
              <div
                key={n.id}
                className="flex-shrink-0 w-64 bg-indigo-50/50 p-4 rounded-[1.5rem] border border-indigo-100 shadow-sm relative"
              >
                {n.reminderTime && (
                  <span className="absolute top-3 right-3 text-indigo-400">
                    <ClockIcon />
                  </span>
                )}
                <span className="text-[9px] font-bold text-indigo-500 bg-white px-2 py-0.5 rounded-full shadow-sm mb-2 inline-block border border-indigo-100">
                  {n.noteDay === "Umum"
                    ? "Catatan Umum"
                    : formatDate(n.noteDay)}{" "}
                  {n.reminderTime && `• ⏰ ${n.reminderTime}`}
                </span>
                <h4 className="font-bold text-sm text-indigo-900 mb-1">
                  {n.title}
                </h4>
                <p className="text-xs font-medium text-indigo-700 whitespace-pre-wrap leading-relaxed">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-slate-900 bg-white/90 backdrop-blur border border-slate-200 px-4 py-1.5 rounded-full shadow-sm">
          Garis Waktu
        </h2>
        {isTripActiveNow && (
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm flex text-xs font-bold border border-slate-200">
            <button
              onClick={() => setViewMode("today")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                viewMode === "today"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-1.5 rounded-full transition-all ${
                viewMode === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Semua
            </button>
          </div>
        )}
      </div>

      {Object.keys(groupedTimeline).length === 0 ? (
        <div className="text-center py-12 bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-sm border border-slate-200">
          <p className="text-slate-500 font-bold mb-1">
            Perjalanan belum dimulai.
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Buat agendamu di menu Rencana.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedTimeline).map((date) => (
            <div key={date} className="bg-transparent">
              <div className="inline-block bg-white px-4 py-1.5 rounded-full shadow-sm text-xs font-bold text-indigo-700 mb-5 ml-2 border border-slate-200">
                {formatDate(date)}
              </div>

              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-indigo-200 before:via-sky-200 before:to-transparent">
                {groupedTimeline[date].map((item, index, array) => (
                  <React.Fragment key={item.id}>
                    <div className="relative flex items-start gap-4 group z-10 pl-1">
                      <div
                        className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md border-[3px] border-white ${item.color} shrink-0`}
                      >
                        {item.source === "itinerary" && item.done ? (
                          <CheckIcon />
                        ) : (
                          item.icon
                        )}
                      </div>

                      <div
                        className={`flex-1 p-4 rounded-[1.5rem] transition-all ${
                          item.done
                            ? "bg-slate-50/80 border border-slate-200 opacity-70"
                            : "bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="pr-2">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md font-mono">
                              {item.time || "--:--"}
                            </span>
                            <p
                              className={`text-sm font-bold mt-2 leading-snug ${
                                item.done
                                  ? "line-through text-slate-500"
                                  : "text-slate-900"
                              }`}
                            >
                              {item.activity}
                            </p>
                          </div>
                          {/* Calendar & Checklist Buttons */}
                          <div className="flex flex-col gap-2 shrink-0">
                            {item.source === "itinerary" && (
                              <button
                                onClick={() =>
                                  toggleItinDone(item.id, item.activity)
                                }
                                className={`text-[10px] border px-3 py-1.5 rounded-full font-bold transition-colors ${
                                  item.done
                                    ? "bg-indigo-100 text-indigo-700 border-transparent"
                                    : "bg-white text-slate-500 hover:bg-slate-100 border-slate-200"
                                }`}
                              >
                                {item.done ? "Selesai" : "Kunjungi"}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                          {item.location ? (
                            <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 truncate">
                              <MapPinIcon /> {item.location}
                            </p>
                          ) : (
                            <div />
                          )}

                          {/* Add to Google Calendar Action */}
                          <a
                            href={generateGCalLink(
                              item.eventTitle || item.activity,
                              item.date,
                              item.time,
                              item.location,
                              `Jadwal Trip: ${trip.name}`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-sky-700 hover:text-white hover:bg-sky-600 bg-sky-50 border border-sky-100 px-2.5 py-1.5 rounded-full flex items-center gap-1 font-bold transition-colors"
                            title="Tambahkan Pengingat ke Kalender"
                          >
                            <CalendarIcon /> Kalender
                          </a>
                        </div>
                      </div>
                    </div>

                    {index < array.length - 1 &&
                      item.location &&
                      array[index + 1].location && (
                        <div className="relative flex items-center gap-4 z-10 py-1 pl-1">
                          <div className="w-8 flex justify-center shrink-0">
                            <div className="w-1 h-6 bg-sky-200/60 rounded-full"></div>
                          </div>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                              item.location
                            )}&destination=${encodeURIComponent(
                              array[index + 1].location
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-sky-50 text-sky-600 text-[11px] font-bold py-2 px-4 rounded-full flex items-center gap-1.5 w-max transition-all shadow-sm"
                          >
                            <RouteIcon /> Cek Peta
                          </a>
                        </div>
                      )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- SUB-TABS: PLAN (Input Data & Click-to-Edit) ---
function PlanTab({ trip, updateTrip, userName }) {
  const [subTab, setSubTab] = useState("itinerary");
  const tripDays = useMemo(
    () => getDaysArray(trip.startDate, trip.endDate),
    [trip.startDate, trip.endDate]
  );
  const [activeDay, setActiveDay] = useState(tripDays[0]?.date || "");

  const formRef = useRef(null);
  const hotelFormRef = useRef(null);

  // Edit States
  const [editItinId, setEditItinId] = useState(null);
  const [iTime, setITime] = useState("");
  const [iActivity, setIActivity] = useState("");
  const [iLocation, setILocation] = useState("");

  const [editTransportId, setEditTransportId] = useState(null);
  const [tType, setTType] = useState("Pesawat");
  const [tOrigin, setTOrigin] = useState("");
  const [tDest, setTDest] = useState("");
  const [tDepDate, setTDepDate] = useState("");
  const [tDepTime, setTDepTime] = useState("");
  const [tArrDate, setTArrDate] = useState("");
  const [tArrTime, setTArrTime] = useState("");

  const [editHotelId, setEditHotelId] = useState(null);
  const [hName, setHName] = useState("");
  const [hInDate, setHInDate] = useState("");
  const [hOutDate, setHOutDate] = useState("");

  const [editNoteId, setEditNoteId] = useState(null);
  const [nDay, setNDay] = useState("Umum"); // 'Umum' or date string
  const [nReminder, setNReminder] = useState("");
  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");

  const [packItem, setPackItem] = useState("");

  const resetItinForm = () => {
    setEditItinId(null);
    setITime("");
    setIActivity("");
    setILocation("");
  };
  const resetTransportForm = () => {
    setEditTransportId(null);
    setTOrigin("");
    setTDest("");
    setTDepDate("");
    setTDepTime("");
    setTArrDate("");
    setTArrTime("");
  };
  const resetHotelForm = () => {
    setEditHotelId(null);
    setHName("");
    setHInDate("");
    setHOutDate("");
  };
  const resetNoteForm = () => {
    setEditNoteId(null);
    setNTitle("");
    setNContent("");
    setNReminder("");
    setNDay("Umum");
  };

  // Handlers Itinerary
  const handleSaveItinerary = (e) => {
    e.preventDefault();
    if (!iActivity || !activeDay) return;
    const newItem = {
      id: editItinId || Date.now().toString(),
      date: activeDay,
      time: iTime,
      activity: iActivity,
      location: iLocation,
      done: false,
    };
    if (editItinId)
      updateTrip(
        {
          itinerary: (trip.itinerary || [])
            .map((i) => (i.id === editItinId ? newItem : i))
            .sort((a, b) => a.time.localeCompare(b.time)),
        },
        `mengubah agenda ${iActivity}.`
      );
    else
      updateTrip(
        {
          itinerary: [...(trip.itinerary || []), newItem].sort((a, b) =>
            a.time.localeCompare(b.time)
          ),
        },
        `menambahkan agenda baru: ${iActivity}.`
      );
    resetItinForm();
  };
  const handleEditItin = (item) => {
    setEditItinId(item.id);
    setITime(item.time);
    setIActivity(item.activity);
    setILocation(item.location || "");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dayItinerary = (trip.itinerary || []).filter(
    (i) => i.date === activeDay
  );

  // Handlers Transport
  const handleSaveTransport = (e) => {
    e.preventDefault();
    const newItem = {
      id: editTransportId || Date.now().toString(),
      type: tType,
      origin: tOrigin,
      dest: tDest,
      depDate: tDepDate,
      depTime: tDepTime,
      arrDate: tArrDate,
      arrTime: tArrTime,
    };
    if (editTransportId)
      updateTrip(
        {
          transport: (trip.transport || []).map((t) =>
            t.id === editTransportId ? newItem : t
          ),
        },
        `mengubah tiket ${tType}.`
      );
    else
      updateTrip(
        { transport: [...(trip.transport || []), newItem] },
        `menambahkan tiket ${tType} ke ${tDest}.`
      );
    resetTransportForm();
  };
  const handleEditTransport = (t) => {
    setEditTransportId(t.id);
    setTType(t.type);
    setTOrigin(t.origin);
    setTDest(t.dest);
    setTDepDate(t.depDate || "");
    setTDepTime(t.depTime || "");
    setTArrDate(t.arrDate || "");
    setTArrTime(t.arrTime || "");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handlers Hotel
  const handleSaveHotel = (e) => {
    e.preventDefault();
    const newItem = {
      id: editHotelId || Date.now().toString(),
      name: hName,
      inDate: hInDate,
      outDate: hOutDate,
    };
    if (editHotelId)
      updateTrip(
        {
          accommodation: (trip.accommodation || []).map((h) =>
            h.id === editHotelId ? newItem : h
          ),
        },
        `mengubah info penginapan ${hName}.`
      );
    else
      updateTrip(
        { accommodation: [...(trip.accommodation || []), newItem] },
        `menambahkan penginapan ${hName}.`
      );
    resetHotelForm();
  };
  const handleEditHotel = (h) => {
    setEditHotelId(h.id);
    setHName(h.name);
    setHInDate(h.inDate);
    setHOutDate(h.outDate);
    hotelFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handlers Daily Notes
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!nTitle) return;
    const newItem = {
      id: editNoteId || Date.now().toString(),
      title: nTitle,
      content: nContent,
      noteDay: nDay,
      reminderTime: nReminder,
      reminderFired: false,
      date: new Date().toISOString(),
    };
    if (editNoteId)
      updateTrip(
        {
          notes: (trip.notes || []).map((n) =>
            n.id === editNoteId ? newItem : n
          ),
        },
        `memperbarui catatan: ${nTitle}.`
      );
    else
      updateTrip(
        { notes: [newItem, ...(trip.notes || [])] },
        `menambahkan catatan baru: ${nTitle}.`
      );
    resetNoteForm();
  };
  const handleEditNote = (n) => {
    setEditNoteId(n.id);
    setNTitle(n.title);
    setNContent(n.content || "");
    setNDay(n.noteDay || "Umum");
    setNReminder(n.reminderTime || "");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handlers Packing
  const handleAddPacking = (e) => {
    e.preventDefault();
    if (!packItem.trim()) return;
    updateTrip(
      {
        packingList: [
          ...(trip.packingList || []),
          { id: Date.now().toString(), name: packItem, done: false },
        ],
      },
      `menambahkan ${packItem} ke barang bawaan.`
    );
    setPackItem("");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex w-full bg-white/95 backdrop-blur-md rounded-full shadow-sm mb-6 p-1.5 border border-slate-200">
        <button
          type="button"
          onClick={() => setSubTab("itinerary")}
          className={`flex-1 py-2.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all ${
            subTab === "itinerary"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Agenda
        </button>
        <button
          type="button"
          onClick={() => setSubTab("tiket")}
          className={`flex-1 py-2.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all ${
            subTab === "tiket"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Akomodasi
        </button>
        <button
          type="button"
          onClick={() => setSubTab("packing")}
          className={`flex-1 py-2.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all ${
            subTab === "packing"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Bawaan
        </button>
        <button
          type="button"
          onClick={() => setSubTab("notes")}
          className={`flex-1 py-2.5 text-[10px] md:text-[11px] font-bold rounded-full transition-all ${
            subTab === "notes"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Catatan
        </button>
      </div>

      {/* --- TAB ITINERARY --- */}
      {subTab === "itinerary" && (
        <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <div className="flex overflow-x-auto gap-2.5 mb-6 pb-2 scrollbar-hide">
            {tripDays.map((d) => (
              <button
                key={d.date}
                onClick={() => {
                  setActiveDay(d.date);
                  resetItinForm();
                }}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeDay === d.date
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {d.day}{" "}
                <span className="block text-[10px] font-medium opacity-90 mt-0.5">
                  {formatDate(d.date).split(" 20")[0]}
                </span>
              </button>
            ))}
          </div>

          <form
            ref={formRef}
            onSubmit={handleSaveItinerary}
            className={`mb-8 p-5 rounded-[1.5rem] transition-colors border ${
              editItinId
                ? "bg-indigo-50/80 border-indigo-200"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              {editItinId ? "Ubah Agenda" : "Buat Agenda Baru"}
            </h3>
            <div className="flex gap-3 mb-3">
              <input
                type="time"
                value={iTime}
                onChange={(e) => setITime(e.target.value)}
                className="w-1/3 p-3 bg-white rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border border-slate-100"
                required
              />
              <input
                type="text"
                placeholder="Aktivitas"
                value={iActivity}
                onChange={(e) => setIActivity(e.target.value)}
                className="flex-1 p-3 bg-white rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border border-slate-100"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Lokasi (cth: Stasiun, Bandara)"
                value={iLocation}
                onChange={(e) => setILocation(e.target.value)}
                className="w-full p-3 bg-white rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border border-slate-100"
              />
            </div>
            <div className="flex gap-2">
              {editItinId && (
                <button
                  type="button"
                  onClick={resetItinForm}
                  className="flex-1 bg-white text-slate-600 p-3 rounded-xl font-bold border border-slate-200 shadow-sm"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className={`flex-[2] text-white p-3 rounded-xl font-bold transition-all shadow-md ${
                  editItinId ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                {editItinId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {dayItinerary.length === 0 && (
              <p className="text-center text-[11px] font-bold text-slate-400 py-6">
                Hari ini masih kosong. Mari bertualang!
              </p>
            )}
            {dayItinerary.map((item) => (
              <div
                key={item.id}
                onClick={() => handleEditItin(item)}
                className="flex items-center justify-between bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-300 transition-colors group"
              >
                <div>
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md">
                    {item.time || "--:--"}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-2">
                    {item.activity}
                  </p>
                  {item.location && (
                    <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" /> {item.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTrip(
                      {
                        itinerary: trip.itinerary.filter(
                          (i) => i.id !== item.id
                        ),
                      },
                      `menghapus agenda ${item.activity}.`
                    );
                  }}
                  className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- TAB TIKET & HOTEL --- */}
      {subTab === "tiket" && (
        <div className="space-y-6">
          <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="font-bold text-lg mb-5 text-slate-900 flex items-center gap-2">
              <PlaneIcon /> Transportasi
            </h2>

            <form
              ref={formRef}
              onSubmit={handleSaveTransport}
              className={`mb-6 p-5 rounded-[1.5rem] transition-colors border ${
                editTransportId
                  ? "bg-sky-50 border-sky-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                {editTransportId ? "Ubah Rencana Jalan" : "Simpan Tiket Baru"}
              </h3>
              <select
                value={tType}
                onChange={(e) => setTType(e.target.value)}
                className="w-full p-3 mb-3 bg-white rounded-xl font-bold outline-none focus:ring-2 focus:ring-sky-500 shadow-sm border border-slate-100 text-sm text-slate-700"
              >
                <option>Pesawat</option>
                <option>Kereta</option>
                <option>Bus</option>
                <option>Kapal</option>
                <option>Travel/Mobil</option>
              </select>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Asal (cth: JKT)"
                  value={tOrigin}
                  onChange={(e) => setTOrigin(e.target.value)}
                  className="w-1/2 p-3 bg-white rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-sky-500 shadow-sm border border-slate-100"
                  required
                />
                <input
                  type="text"
                  placeholder="Tujuan (cth: DPS)"
                  value={tDest}
                  onChange={(e) => setTDest(e.target.value)}
                  className="w-1/2 p-3 bg-white rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-sky-500 shadow-sm border border-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Keberangkatan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tDepDate}
                      onChange={(e) => setTDepDate(e.target.value)}
                      className="w-[60%] p-2 bg-slate-50 rounded-lg text-xs font-medium outline-none"
                    />
                    <input
                      type="time"
                      value={tDepTime}
                      onChange={(e) => setTDepTime(e.target.value)}
                      className="w-[40%] p-2 bg-slate-50 rounded-lg text-xs font-medium outline-none"
                    />
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Kedatangan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tArrDate}
                      onChange={(e) => setTArrDate(e.target.value)}
                      className="w-[60%] p-2 bg-slate-50 rounded-lg text-xs font-medium outline-none"
                    />
                    <input
                      type="time"
                      value={tArrTime}
                      onChange={(e) => setTArrTime(e.target.value)}
                      className="w-[40%] p-2 bg-slate-50 rounded-lg text-xs font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {editTransportId && (
                  <button
                    type="button"
                    onClick={resetTransportForm}
                    className="flex-1 bg-white text-slate-600 p-3 rounded-xl font-bold border border-slate-200 shadow-sm"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-[2] text-white p-3 rounded-xl font-bold transition-all shadow-md ${
                    editTransportId ? "bg-sky-600" : "bg-slate-800"
                  }`}
                >
                  {editTransportId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {(trip.transport || []).map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleEditTransport(t)}
                  className="bg-white border border-slate-200 shadow-sm p-5 rounded-[1.5rem] relative cursor-pointer hover:border-sky-300 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-sky-50 text-sky-600 p-1.5 rounded-lg border border-sky-100">
                      <TransportIcon type={t.type} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {t.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <div className="text-center">
                      <p className="font-bold text-lg text-slate-900">
                        {t.origin}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 mt-1">
                        {t.depDate
                          ? formatDate(t.depDate).split(" 20")[0]
                          : "-"}{" "}
                        <br /> <span className="font-mono">{t.depTime}</span>
                      </p>
                    </div>
                    <div className="flex-1 px-3 text-center">
                      <div className="h-px bg-slate-200 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-slate-300">
                          <PlaneIcon />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg text-slate-900">
                        {t.dest}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 mt-1">
                        {t.arrDate
                          ? formatDate(t.arrDate).split(" 20")[0]
                          : "-"}{" "}
                        <br /> <span className="font-mono">{t.arrTime}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTrip(
                        {
                          transport: trip.transport.filter(
                            (x) => x.id !== t.id
                          ),
                        },
                        `menghapus tiket ${t.type}.`
                      );
                    }}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
            <h2 className="font-bold text-lg mb-5 text-slate-900 flex items-center gap-2">
              <BedIcon /> Tempat Penginapan
            </h2>
            <form
              ref={hotelFormRef}
              onSubmit={handleSaveHotel}
              className={`mb-6 p-5 rounded-[1.5rem] transition-colors border ${
                editHotelId
                  ? "bg-amber-50 border-amber-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                {editHotelId
                  ? "Edit Tempat Penginapan"
                  : "Simpan Tempat Penginapan"}
              </h3>
              <input
                type="text"
                placeholder="Nama Hotel / Villa"
                value={hName}
                onChange={(e) => setHName(e.target.value)}
                className="w-full p-3 mb-3 bg-white rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500 border border-slate-100 shadow-sm"
                required
              />
              <div className="flex gap-3 mb-4">
                <div className="w-1/2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={hInDate}
                    onChange={(e) => setHInDate(e.target.value)}
                    className="w-full p-1 bg-transparent text-xs font-medium outline-none"
                    required
                  />
                </div>
                <div className="w-1/2 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={hOutDate}
                    onChange={(e) => setHOutDate(e.target.value)}
                    className="w-full p-1 bg-transparent text-xs font-medium outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {editHotelId && (
                  <button
                    type="button"
                    onClick={resetHotelForm}
                    className="flex-1 bg-white text-slate-600 p-3 rounded-xl font-bold border border-slate-200 shadow-sm"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className={`flex-[2] text-white p-3 rounded-xl font-bold transition-all shadow-md ${
                    editHotelId ? "bg-amber-500" : "bg-slate-800"
                  }`}
                >
                  {editHotelId ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {(trip.accommodation || []).map((h) => (
                <div
                  key={h.id}
                  onClick={() => handleEditHotel(h)}
                  className="bg-white border border-slate-200 shadow-sm p-5 rounded-[1.5rem] relative cursor-pointer hover:border-amber-300 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-50 border border-amber-100 text-amber-600 p-2 rounded-xl mt-0.5">
                      <BedIcon />
                    </div>
                    <div>
                      <p className="font-bold text-base text-slate-900">
                        {h.name}
                      </p>
                      <div className="flex gap-5 mt-2 text-xs">
                        <div>
                          <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5">
                            Check-in
                          </span>
                          <span className="font-medium text-slate-600">
                            {formatDate(h.inDate).split(" 20")[0]}
                          </span>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-400 uppercase text-[9px] mb-0.5">
                            Check-out
                          </span>
                          <span className="font-medium text-slate-600">
                            {formatDate(h.outDate).split(" 20")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTrip(
                        {
                          accommodation: trip.accommodation.filter(
                            (x) => x.id !== h.id
                          ),
                        },
                        `menghapus penginapan ${h.name}.`
                      );
                    }}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {subTab === "packing" && (
        <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
            🎒 Barang Bawaan
          </h2>
          <form onSubmit={handleAddPacking} className="flex gap-3 mb-6">
            <input
              type="text"
              name="item"
              placeholder="Ketik barang bawaan..."
              value={packItem}
              onChange={(e) => setPackItem(e.target.value)}
              className="flex-1 p-3 bg-white border border-slate-200 shadow-sm rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-slate-800 text-white px-5 rounded-xl font-bold shadow-md hover:bg-slate-700"
            >
              Tambah
            </button>
          </form>
          <div className="space-y-2">
            {(trip.packingList || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl group transition-colors"
              >
                <button
                  type="button"
                  onClick={() =>
                    updateTrip(
                      {
                        packingList: (trip.packingList || []).map((i) =>
                          i.id === item.id ? { ...i, done: !i.done } : i
                        ),
                      },
                      item.done
                        ? `menghapus centang dari ${item.name}.`
                        : `mencentang bawaan: ${item.name}.`
                    )
                  }
                  className="flex items-center gap-4 cursor-pointer flex-1 text-left"
                >
                  <div
                    className={`w-5 h-5 rounded border-[1.5px] flex items-center justify-center transition-colors ${
                      item.done
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {item.done && <CheckIcon />}
                  </div>
                  <span
                    className={`text-sm font-medium transition-all ${
                      item.done
                        ? "line-through text-slate-400"
                        : "text-slate-800"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
                <button
                  onClick={() =>
                    updateTrip({
                      packingList: (trip.packingList || []).filter(
                        (i) => i.id !== item.id
                      ),
                    })
                  }
                  className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {subTab === "notes" && (
        <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900">
            <BookIcon /> Catatan Harian & Pengingat
          </h2>
          <p className="text-xs text-slate-500 font-medium mb-6">
            Simpan hal penting, tetapkan untuk hari apa, atau pasang
            alarm/pengingat jam!
          </p>

          <form
            ref={formRef}
            onSubmit={handleSaveNote}
            className={`mb-8 p-5 rounded-[1.5rem] transition-colors border shadow-sm ${
              editNoteId
                ? "bg-indigo-50/80 border-indigo-200"
                : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              {editNoteId ? "Edit Catatan" : "Buat Catatan Baru"}
            </h3>
            <input
              type="text"
              placeholder="Judul Catatan..."
              value={nTitle}
              onChange={(e) => setNTitle(e.target.value)}
              className="w-full p-3 mb-3 bg-slate-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-100"
              required
            />
            <textarea
              placeholder="Isi catatan..."
              value={nContent}
              onChange={(e) => setNContent(e.target.value)}
              className="w-full p-3 mb-3 bg-slate-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-100 min-h-[80px]"
            />

            <div className="flex gap-3 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  Berlaku Untuk
                </label>
                <select
                  value={nDay}
                  onChange={(e) => setNDay(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg text-xs font-bold outline-none border border-slate-200 text-slate-700"
                >
                  <option value="Umum">Umum (Semua Hari)</option>
                  {tripDays.map((d) => (
                    <option key={d.date} value={d.date}>
                      {d.day} ({formatDate(d.date).split(" 20")[0]})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                  Pasang Alarm Jam
                </label>
                <input
                  type="time"
                  value={nReminder}
                  onChange={(e) => setNReminder(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg text-xs font-bold outline-none border border-slate-200 text-slate-700"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {editNoteId && (
                <button
                  type="button"
                  onClick={resetNoteForm}
                  className="flex-1 bg-white text-slate-600 p-3 rounded-xl font-bold border border-slate-200 shadow-sm text-sm"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                className={`flex-[2] text-white p-3 rounded-xl font-bold transition-all shadow-md text-sm ${
                  editNoteId ? "bg-indigo-600" : "bg-slate-800"
                }`}
              >
                {editNoteId ? "Simpan" : "Tambahkan"}
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {(trip.notes || []).length === 0 && (
              <p className="text-center text-[11px] font-bold text-slate-400 py-4">
                Belum ada catatan tersimpan.
              </p>
            )}
            {(trip.notes || []).map((n) => (
              <div
                key={n.id}
                onClick={() => handleEditNote(n)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative group cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTrip(
                      { notes: trip.notes.filter((x) => x.id !== n.id) },
                      `menghapus catatan ${n.title}.`
                    );
                  }}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon />
                </button>
                <div className="pr-8">
                  <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full mb-2 inline-block">
                    {n.noteDay === "Umum"
                      ? "Catatan Umum"
                      : formatDate(n.noteDay)}{" "}
                    {n.reminderTime && `• ⏰ ${n.reminderTime}`}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {n.title}
                  </h4>
                  {n.content && (
                    <p className="text-xs font-medium text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {n.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// --- SUB-TABS: FINANCE (Budget & Split Bill) ---
function FinanceTab({ trip, updateTrip, userName, setGlobalToast }) {
  const [fTab, setFTab] = useState("budget");

  const totalBudget = (trip.budgets || []).reduce((sum, b) => {
    return (
      sum +
      (b.type === "person" ? b.amount * (trip.members || []).length : b.amount)
    );
  }, 0);

  const totalSpent = (trip.expenses || []).reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const budgetPercentage =
    totalBudget === 0 ? 0 : Math.min((totalSpent / totalBudget) * 100, 100);
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  const [bName, setBName] = useState("");
  const [bAmount, setBAmount] = useState("");
  const [bType, setBType] = useState("group");

  const addBudget = (e) => {
    e.preventDefault();
    if (!bName || !bAmount) return;
    updateTrip(
      {
        budgets: [
          ...(trip.budgets || []),
          {
            id: Date.now().toString(),
            name: bName,
            amount: parseInt(bAmount, 10),
            type: bType,
          },
        ],
      },
      `menambahkan rencana anggaran: ${bName}.`
    );
    setBName("");
    setBAmount("");
  };

  // State untuk Waktu Pengeluaran
  const [eDesc, setEDesc] = useState("");
  const [eAmount, setEAmount] = useState("");
  const [ePaidBy, setEPaidBy] = useState("");
  const [eSplit, setESplit] = useState([]);

  const now = new Date();
  const [eDate, setEDate] = useState(now.toISOString().split("T")[0]);
  const [eTime, setETime] = useState(now.toTimeString().substring(0, 5));

  const addExpense = (e) => {
    e.preventDefault();
    if (!eDesc || !eAmount || !ePaidBy || eSplit.length === 0) return;
    updateTrip(
      {
        expenses: [
          {
            id: Date.now().toString(),
            desc: eDesc,
            amount: parseInt(eAmount, 10),
            paidBy: ePaidBy,
            split: eSplit,
            date: eDate,
            time: eTime,
          },
          ...(trip.expenses || []),
        ],
      },
      `mencatat pengeluaran: ${eDesc} sebesar ${formatRupiah(eAmount)}.`
    );
    setEDesc("");
    setEAmount("");
    setEPaidBy("");
    setESplit([]);
    setFTab("riwayat");
  };

  // Settlement Logic - NOW INCLUDES PAYMENTS
  const settlements = useMemo(() => {
    let balances = {};
    (trip.members || []).forEach((m) => (balances[m] = 0));
    (trip.expenses || []).forEach((exp) => {
      if (balances[exp.paidBy] === undefined) balances[exp.paidBy] = 0;
      balances[exp.paidBy] += exp.amount;
      const splitCost = exp.amount / exp.split.length;
      exp.split.forEach((person) => {
        if (balances[person] === undefined) balances[person] = 0;
        balances[person] -= splitCost;
      });
    });

    // Apply payments
    (trip.payments || []).forEach((pay) => {
      if (balances[pay.from] !== undefined) balances[pay.from] += pay.amount;
      if (balances[pay.to] !== undefined) balances[pay.to] -= pay.amount;
    });

    let debtors = [],
      creditors = [],
      result = [];
    Object.keys(balances).forEach((p) => {
      if (balances[p] < -0.01)
        debtors.push({ p, amount: Math.abs(balances[p]) });
      else if (balances[p] > 0.01) creditors.push({ p, amount: balances[p] });
    });
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      let d = debtors[i],
        c = creditors[j];
      let amount = Math.min(d.amount, c.amount);
      result.push({ from: d.p, to: c.p, amount });
      d.amount -= amount;
      c.amount -= amount;
      if (d.amount < 0.01) i++;
      if (c.amount < 0.01) j++;
    }
    return result;
  }, [trip.members, trip.expenses, trip.payments]);

  const handlePayDebt = (from, to, amount) => {
    updateTrip(
      {
        payments: [
          ...(trip.payments || []),
          {
            id: Date.now().toString(),
            from,
            to,
            amount,
            date: new Date().toISOString(),
          },
        ],
      },
      `menandai lunas tagihan ${from} ke ${to}.`
    );
  };

  const handleUndoPayment = (id) => {
    updateTrip(
      { payments: (trip.payments || []).filter((p) => p.id !== id) },
      `membatalkan status lunas suatu tagihan.`
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex bg-white/95 backdrop-blur-md rounded-full shadow-sm mb-6 p-1.5 border border-slate-200">
        <button
          onClick={() => setFTab("budget")}
          className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all ${
            fTab === "budget"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Anggaran
        </button>
        <button
          onClick={() => setFTab("catat")}
          className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all ${
            fTab === "catat"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Catat
        </button>
        <button
          onClick={() => setFTab("riwayat")}
          className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all ${
            fTab === "riwayat"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Riwayat
        </button>
        <button
          onClick={() => setFTab("settle")}
          className={`flex-1 py-2.5 text-[11px] font-bold rounded-full transition-all ${
            fTab === "settle"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          Tagihan
        </button>
      </div>

      {fTab === "budget" && (
        <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="font-bold text-lg mb-5 text-slate-900">
            📊 Rencana Anggaran
          </h2>

          <div
            className={`p-5 rounded-[1.5rem] mb-8 transition-colors ${
              isOverBudget
                ? "bg-red-50 border border-red-100"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            <div className="flex justify-between items-end mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Terpakai
              </span>
              <span
                className={`text-xl font-bold ${
                  isOverBudget ? "text-red-600" : "text-slate-900"
                }`}
              >
                {formatRupiah(totalSpent)}
              </span>
            </div>
            <div className="w-full bg-slate-200/60 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget ? "bg-red-500" : "bg-indigo-600"
                }`}
                style={{ width: `${budgetPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span>Dari Total Anggaran:</span>
              <span className="font-bold text-slate-800">
                {formatRupiah(totalBudget)}
              </span>
            </div>
            {isOverBudget && (
              <p className="text-[10px] text-red-600 mt-3 font-bold bg-red-100/50 p-2 rounded-lg inline-block border border-red-100">
                ⚠️ Melebihi batas anggaran!
              </p>
            )}
          </div>

          <form
            onSubmit={addBudget}
            className="mb-6 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem]"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Buat Alokasi Anggaran
            </h3>
            <input
              type="text"
              placeholder="Keperluan (cth: Konsumsi)"
              value={bName}
              onChange={(e) => setBName(e.target.value)}
              className="w-full p-3 bg-white rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border border-slate-100 mb-3"
              required
            />
            <div className="flex gap-3 mb-4">
              <input
                type="number"
                placeholder="Nominal (Rp)"
                value={bAmount}
                onChange={(e) => setBAmount(e.target.value)}
                className="flex-[2] p-3 bg-white rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border border-slate-100"
                required
              />
              <select
                value={bType}
                onChange={(e) => setBType(e.target.value)}
                className="flex-[1.5] p-3 bg-white rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm border border-slate-100 text-slate-700"
              >
                <option value="group">Grup (Total)</option>
                <option value="person">Per Orang</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 text-white p-3.5 rounded-xl font-bold shadow-md hover:bg-slate-700 transition-colors text-sm"
            >
              Simpan Alokasi
            </button>
          </form>

          <div className="space-y-3">
            {(trip.budgets || []).map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center p-4 bg-white border border-slate-100 shadow-sm rounded-2xl group hover:border-indigo-300 transition-colors"
              >
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {b.name}
                  </span>
                  <span className="text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-indigo-100">
                    {b.type === "person"
                      ? `Per Orang (${formatRupiah(b.amount)})`
                      : "Total Grup"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-800">
                    {formatRupiah(
                      b.type === "person"
                        ? b.amount * (trip.members || []).length
                        : b.amount
                    )}
                  </span>
                  <button
                    onClick={() =>
                      updateTrip(
                        { budgets: trip.budgets.filter((x) => x.id !== b.id) },
                        `menghapus alokasi anggaran ${b.name}.`
                      )
                    }
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {fTab === "catat" && (
        <section className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200">
          <form onSubmit={addExpense} className="space-y-5">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block mb-1">
                Catat Pengeluaran
              </label>
              <input
                type="text"
                placeholder="Cth: Makan Malam Pantai"
                value={eDesc}
                onChange={(e) => setEDesc(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-100 shadow-inner rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-[2]">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  placeholder="150000"
                  value={eAmount}
                  onChange={(e) => setEAmount(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 shadow-inner rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block mb-1">
                  Jam
                </label>
                <input
                  type="time"
                  value={eTime}
                  onChange={(e) => setETime(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 shadow-inner rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={eDate}
                onChange={(e) => setEDate(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-100 shadow-inner rounded-xl font-medium outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block mb-1">
                Ditalangi Oleh?
              </label>
              <select
                value={ePaidBy}
                onChange={(e) => setEPaidBy(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-100 shadow-inner rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none text-slate-700"
                required
              >
                <option value="" disabled>
                  Pilih anggota...
                </option>
                {(trip.members || []).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 block">
                  Tanggungan Siapa Saja?
                </label>
                <button
                  type="button"
                  onClick={() => setESplit([...trip.members])}
                  className="text-[10px] text-indigo-700 font-bold bg-indigo-100 px-2.5 py-1 rounded-full"
                >
                  Pilih Semua
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(trip.members || []).map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all shadow-sm ${
                      eSplit.includes(m)
                        ? "bg-indigo-50 border-indigo-400"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={eSplit.includes(m)}
                      onChange={() => {
                        if (eSplit.includes(m))
                          setESplit(eSplit.filter((x) => x !== m));
                        else setESplit([...eSplit, m]);
                      }}
                      className="hidden"
                    />
                    <span
                      className={`text-sm font-bold ${
                        eSplit.includes(m)
                          ? "text-indigo-800"
                          : "text-slate-600"
                      }`}
                    >
                      {m}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-full font-bold text-sm shadow-md transition-all mt-2"
            >
              Simpan Catatan
            </button>
          </form>
        </section>
      )}

      {fTab === "riwayat" && (
        <div className="space-y-4">
          {(trip.expenses || []).length === 0 && (
            <div className="text-center py-10 bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200">
              <p className="text-slate-500 font-medium text-sm">
                Belum ada riwayat keuangan.
              </p>
            </div>
          )}
          {(trip.expenses || []).map((exp) => (
            <div
              key={exp.id}
              className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200 relative group"
            >
              <button
                onClick={() =>
                  updateTrip(
                    { expenses: trip.expenses.filter((e) => e.id !== exp.id) },
                    `menghapus catatan pengeluaran ${exp.desc}.`
                  )
                }
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TrashIcon />
              </button>
              <div className="pr-8">
                <div className="flex justify-between items-start mb-1.5">
                  <h3 className="font-bold text-base text-slate-900">
                    {exp.desc}
                  </h3>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                    {exp.date ? formatDate(exp.date).split(" 20")[0] : ""}{" "}
                    {exp.time}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 mb-3">
                  Ditalangi:{" "}
                  <span className="font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                    {exp.paidBy}
                  </span>
                </p>
                <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    <span className="block font-bold text-slate-400 uppercase mb-0.5">
                      Dibagi untuk {exp.split.length} Anggota:
                    </span>
                    {exp.split.join(", ")}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900">
                      {formatRupiah(exp.amount)}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                      {formatRupiah(exp.amount / exp.split.length)} / org
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {fTab === "settle" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] text-white text-center shadow-md border border-slate-700">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
              Total Pengeluaran Grup
            </p>
            <h2 className="text-3xl font-bold">{formatRupiah(totalSpent)}</h2>
          </div>

          {/* List Sisa Tagihan */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 ml-2">
              Sisa Tagihan (Belum Lunas)
            </h3>
            {settlements.length === 0 ? (
              <div className="text-center py-6 bg-teal-50 border border-teal-100 rounded-2xl">
                <p className="text-teal-600 font-bold text-xs flex items-center justify-center gap-2">
                  <CheckIcon /> Tidak ada tagihan yang tertunda! 🎉
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {settlements.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-3 relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="block font-bold text-red-500 text-sm">
                          {s.from}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">
                          Berhutang Ke
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 text-slate-800 font-bold py-1.5 px-3 rounded-lg text-xs shadow-sm relative z-20">
                        {formatRupiah(s.amount)}
                      </div>
                      <div className="flex-1 text-right">
                        <span className="block font-bold text-indigo-600 text-sm">
                          {s.to}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">
                          Penerima
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePayDebt(s.from, s.to, s.amount)}
                      className="w-full bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 font-bold py-2 rounded-xl text-xs transition-colors"
                    >
                      Tandai Lunas
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Riwayat Pelunasan */}
          {trip.payments && trip.payments.length > 0 && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3 ml-2">
                Riwayat Pembayaran Lunas
              </h3>
              <div className="space-y-2">
                {trip.payments.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        <span className="font-bold text-slate-900">
                          {p.from}
                        </span>{" "}
                        lunas ke{" "}
                        <span className="font-bold text-slate-900">{p.to}</span>
                      </p>
                      <p className="text-[9px] text-slate-400">
                        {formatDate(p.date.split("T")[0])}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-teal-600 text-sm">
                        {formatRupiah(p.amount)}
                      </span>
                      <button
                        onClick={() => handleUndoPayment(p.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- SUB-TABS: MEMBERS ---
function MembersTab({ trip, updateTrip, userName, setGlobalToast }) {
  const [name, setName] = useState("");
  const addMember = (e) => {
    e.preventDefault();
    if (name && !trip.members.includes(name)) {
      updateTrip(
        { members: [...trip.members, name] },
        `menambahkan anggota baru: ${name}.`
      );
      setName("");
    }
  };
  const removeMember = (m) => {
    if (trip.expenses.some((e) => e.paidBy === m || e.split.includes(m))) {
      setGlobalToast(
        "Gagal! Anggota ini masih terkait dengan catatan pengeluaran."
      );
      return;
    }
    updateTrip(
      { members: trip.members.filter((x) => x !== m) },
      `menghapus ${m} dari daftar anggota.`
    );
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="font-bold text-lg mb-5 text-slate-900">
        👥 Anggota Perjalanan
      </h2>
      <form onSubmit={addMember} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Ketik nama anggota..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-3.5 bg-slate-50 shadow-inner border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-slate-800 hover:bg-slate-700 text-white px-5 rounded-xl font-bold shadow-md transition-colors text-sm"
        >
          Tambah
        </button>
      </form>
      <ul className="space-y-3">
        {(trip.members || []).map((m) => (
          <li
            key={m}
            className="flex justify-between items-center p-4 bg-white border border-slate-100 shadow-sm rounded-[1.5rem] group transition-all hover:border-indigo-200"
          >
            <span className="font-bold text-slate-800">{m}</span>
            {m !== userName && (
              <button
                onClick={() => removeMember(m)}
                className="text-slate-300 hover:text-red-500 p-1"
              >
                <TrashIcon />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
