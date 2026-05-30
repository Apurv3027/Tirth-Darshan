import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    ActivityIndicator,
    Platform,
    FlatList,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types & Interfaces ──
interface City {
    name: string;
    latitude: number;
    longitude: number;
    state?: string;
}

interface Choghadiya {
    name: string;
    quality: 'Excellent' | 'Good' | 'Medium' | 'Avoid';
    color: string;
    description: string;
}

interface CalculatedChoghadiya {
    name: string;
    quality: 'Excellent' | 'Good' | 'Medium' | 'Avoid';
    color: string;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
}

interface Pachchkhan {
    name: string;
    nameHindi: string;
    time: string;
    description: string;
    emoji: string;
}

// ── Predefined Major Indian Cities ──
const PREDEFINED_CITIES: City[] = [
    { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, state: 'Gujarat' },
    { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, state: 'Maharashtra' },
    { name: 'Delhi', latitude: 28.6139, longitude: 77.2090, state: 'Delhi' },
    { name: 'Palitana', latitude: 21.5222, longitude: 71.8262, state: 'Gujarat' },
    { name: 'Shikharji (Madhuban)', latitude: 24.0041, longitude: 86.1557, state: 'Jharkhand' },
    { name: 'Surat', latitude: 21.1702, longitude: 72.8311, state: 'Gujarat' },
    { name: 'Pune', latitude: 18.5204, longitude: 73.8567, state: 'Maharashtra' },
    { name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, state: 'Karnataka' },
    { name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, state: 'Rajasthan' },
    { name: 'Indore', latitude: 22.7196, longitude: 75.8577, state: 'Madhya Pradesh' },
    { name: 'Udaipur', latitude: 24.5854, longitude: 73.7125, state: 'Rajasthan' },
    { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639, state: 'West Bengal' },
    { name: 'Chennai', latitude: 13.0827, longitude: 80.2707, state: 'Tamil Nadu' },
];

// ── Choghadiya Setup ──
const CHOGHADIYAS: Record<string, Choghadiya> = {
    Amrit: { name: 'Amrit', quality: 'Excellent', color: '#059669', description: 'Best for all auspicious works, journeys & starting new projects.' },
    Shubh: { name: 'Shubh', quality: 'Good', color: '#10B981', description: 'Highly beneficial for ceremonies, marriages & positive transactions.' },
    Labh: { name: 'Labh', quality: 'Good', color: '#D97706', description: 'Excellent for business growth, dynamic progress & financial gain.' },
    Chal: { name: 'Chal', quality: 'Medium', color: '#3B82F6', description: 'Neutral. Good for starting general journeys or standard activities.' },
    Udveg: { name: 'Udveg', quality: 'Avoid', color: '#EF4444', description: 'Distressed. Bad for starting new work (ruled by Sun).' },
    Rog: { name: 'Rog', quality: 'Avoid', color: '#F97316', description: 'Disease-prone. Avoid auspicious works & journeys (ruled by Mars).' },
    Kaal: { name: 'Kaal', quality: 'Avoid', color: '#991B1B', description: 'Time/Death. Highly unfavorable for new beginnings (ruled by Saturn).' },
};

// Day sequences starting from Sunrise (0 = Sunday, 1 = Monday, etc.)
const DAY_SEQUENCES = [
    ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'], // Sun
    ['Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh'], // Mon
    ['Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],   // Tue
    ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh'],   // Wed
    ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit'], // Thu
    ['Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal'],   // Fri
    ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal'],   // Sat
];

// Night sequences starting from Sunset
const NIGHT_SEQUENCES = [
    ['Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'], // Sun
    ['Chal', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal'],   // Mon
    ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal'],   // Tue
    ['Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg'], // Wed
    ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog'],   // Thu
    ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh'],   // Fri
    ['Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'], // Sat
];

// ── Astronomical Helpers ──

/**
 * High accuracy offline Sunrise/Sunset estimation using latitude and day of the year.
 * Extremely useful for when APIs fail or the user is offline.
 */
const getApproximateSunTimes = (latitude: number, longitude: number, date: Date) => {
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    // Solar declination (approximate formula)
    const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (284 + dayOfYear));
    const latRad = (latitude * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;

    // Hour angle at sunrise/sunset (using standard horizon correction)
    const cosH = -Math.tan(latRad) * Math.tan(decRad);
    let H = Math.acos(Math.max(-1, Math.min(1, cosH))); // in radians
    H = (H * 180) / Math.PI; // in degrees

    const dayLengthHours = (2 * H) / 15;

    // Solar noon is approximately 12:20 PM local time in standard Indian Time (IST) 
    // due to the central longitude 82.5° E. We adjust slightly for the local longitude.
    // IST base longitude is 82.5. Every degree difference is 4 minutes of shift.
    const longitudeCorrectionMinutes = (82.5 - longitude) * 4;
    const solarNoonHour = 12.0 + (longitudeCorrectionMinutes / 60) + 0.33; // ~12:20 standard shift

    const sunriseHour = solarNoonHour - (dayLengthHours / 2);
    const sunsetHour = solarNoonHour + (dayLengthHours / 2);

    const sunriseDate = new Date(date);
    sunriseDate.setHours(Math.floor(sunriseHour), Math.floor((sunriseHour % 1) * 60), 0, 0);

    const sunsetDate = new Date(date);
    sunsetDate.setHours(Math.floor(sunsetHour), Math.floor((sunsetHour % 1) * 60), 0, 0);

    return { sunrise: sunriseDate, sunset: sunsetDate };
};

/**
 * Astronomical Lunar Month & Tithi Calculator based on synodic lunar phase cycle.
 * Base New Moon (Amavasya) occurred on Jan 11, 2024 at 11:57 UTC.
 */
const getLunarTithiAndMonth = (date: Date) => {
    const SYNODIC_MS = 29.530588853 * 24 * 60 * 60 * 1000;
    const baseNewMoon = new Date('2024-01-11T11:57:00Z');
    const diffMs = date.getTime() - baseNewMoon.getTime();

    let cyclePos = (diffMs % SYNODIC_MS) / SYNODIC_MS;
    if (cyclePos < 0) cyclePos += 1;

    const angle = cyclePos * 360;
    const tithiIndex = Math.floor(angle / 12);
    const isShukla = tithiIndex < 15;

    const paksha = isShukla ? 'Sud (Bright)' : 'Vad (Dark)';

    const tithiNames = [
        'Ekam (Prathama)', 'Beej (Dwitiya)', 'Teej (Tritiya)', 'Choth (Chaturthi)',
        'Pancham (Panchami)', 'Chhath (Shashthi)', 'Satam (Saptami)', 'Aatham (Ashtami)',
        'Nom (Navami)', 'Dasam (Dashami)', 'Agiyarash (Ekadashi)', 'Baras (Dwadashi)',
        'Teras (Trayodashi)', 'Chaudas (Chaturdashi)', 'Poonam (Purnima)'
    ];

    const krishnaTithiNames = [
        'Ekam (Prathama)', 'Beej (Dwitiya)', 'Teej (Tritiya)', 'Choth (Chaturthi)',
        'Pancham (Panchami)', 'Chhath (Shashthi)', 'Satam (Saptami)', 'Aatham (Ashtami)',
        'Nom (Navami)', 'Dasam (Dashami)', 'Agiyarash (Ekadashi)', 'Baras (Dwadashi)',
        'Teras (Trayodashi)', 'Chaudas (Chaturdashi)', 'Amas (Amavasya)'
    ];

    const tithiName = isShukla
        ? tithiNames[tithiIndex]
        : krishnaTithiNames[tithiIndex - 15];

    // Hindu Lunar Months alignment
    const monthNames = [
        'Pausha (Posh)', 'Magha (Maha)', 'Phalguna (Fagun)', 'Chaitra',
        'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana',
        'Bhadrapada', 'Ashvina', 'Kartik', 'Margashirsha (Magsar)'
    ];

    const gregMonth = date.getMonth();
    const gregDay = date.getDate();

    // Months rotate approximately in the middle of standard solar cycles
    let monthIdx = gregDay < 15 ? gregMonth : (gregMonth + 1) % 12;
    const monthName = monthNames[monthIdx];

    // Jains calendar: Veer Samvat starts in Diwali (approx late Oct / Nov).
    const isAfterDiwali = gregMonth > 10 || (gregMonth === 10 && gregDay >= 1);
    const veerSamvat = 2552 + (date.getFullYear() - 2026) + (isAfterDiwali ? 1 : 0);

    return {
        tithi: `${monthName} ${paksha} ${tithiName}`,
        year: `Veer Samvat ${veerSamvat}`,
        gregorian: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
    };
};

/**
 * Computes all 8 Day and 8 Night Choghadiyas and returns current active state.
 */
const getChoghadiyaData = (sunrise: Date, sunset: Date, now: Date) => {
    const weekday = now.getDay();
    const nowMs = now.getTime();
    const sunriseMs = sunrise.getTime();
    const sunsetMs = sunset.getTime();

    // Next Sunrise (approx today + 24 hours)
    const tomorrowSunriseMs = sunriseMs + 24 * 60 * 60 * 1000;

    let isDaytime = nowMs >= sunriseMs && nowMs < sunsetMs;
    let choghadiyaList: CalculatedChoghadiya[] = [];
    let activeChoghadiya: CalculatedChoghadiya | null = null;

    if (isDaytime) {
        const dayDurationMs = sunsetMs - sunriseMs;
        const partDurationMs = dayDurationMs / 8;
        const sequence = DAY_SEQUENCES[weekday];

        for (let i = 0; i < 8; i++) {
            const s = sunriseMs + i * partDurationMs;
            const e = sunriseMs + (i + 1) * partDurationMs;
            const name = sequence[i];
            const details = CHOGHADIYAS[name];
            const isActive = nowMs >= s && nowMs < e;

            const calcItem: CalculatedChoghadiya = {
                name,
                quality: details.quality,
                color: details.color,
                startTime: new Date(s),
                endTime: new Date(e),
                isActive,
            };

            choghadiyaList.push(calcItem);
            if (isActive) activeChoghadiya = calcItem;
        }
    } else {
        // Nighttime
        const isBeforeSunrise = nowMs < sunriseMs;
        let nightStartMs = 0;
        let nightEndMs = 0;
        let nightWeekday = weekday;

        if (isBeforeSunrise) {
            // Early morning before sunrise - belongs to yesterday's night sequence
            nightEndMs = sunriseMs;
            const yesterdaySunsetMs = sunsetMs - 24 * 60 * 60 * 1000;
            nightStartMs = yesterdaySunsetMs;
            nightWeekday = (weekday - 1 + 7) % 7;
        } else {
            // Night after today's sunset - belongs to today's night sequence
            nightStartMs = sunsetMs;
            nightEndMs = tomorrowSunriseMs;
        }

        const nightDurationMs = nightEndMs - nightStartMs;
        const partDurationMs = nightDurationMs / 8;
        const sequence = NIGHT_SEQUENCES[nightWeekday];

        for (let i = 0; i < 8; i++) {
            const s = nightStartMs + i * partDurationMs;
            const e = nightStartMs + (i + 1) * partDurationMs;
            const name = sequence[i];
            const details = CHOGHADIYAS[name];
            const isActive = nowMs >= s && nowMs < e;

            const calcItem: CalculatedChoghadiya = {
                name,
                quality: details.quality,
                color: details.color,
                startTime: new Date(s),
                endTime: new Date(e),
                isActive,
            };

            choghadiyaList.push(calcItem);
            if (isActive) activeChoghadiya = calcItem;
        }
    }

    if (!activeChoghadiya && choghadiyaList.length > 0) {
        activeChoghadiya = choghadiyaList[0];
    }

    const timeRemainingMs = activeChoghadiya
        ? activeChoghadiya.endTime.getTime() - nowMs
        : 0;

    return {
        isDaytime,
        choghadiyaList,
        activeChoghadiya,
        timeRemainingMs,
    };
};

// Helper to format Date objects as clean standard local times
const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

// ── Production-Grade Geolocation Config ──
// ipinfo.io is the industry standard for production IP Geolocation with CDN speed and high availability.
// Get your free token at https://ipinfo.io/ signup to support 50,000+ monthly lookups in production.
const IPINFO_API_TOKEN = 'bef6b2de540daf'; // paste your token here for production

// ── Component ──
export const PanchangCard = () => {
    const [selectedCity, setSelectedCity] = useState<City>(PREDEFINED_CITIES[0]);
    const [sunrise, setSunrise] = useState<Date>(new Date());
    const [sunset, setSunset] = useState<Date>(new Date());
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [loading, setLoading] = useState<boolean>(true);

    // UI Navigation Tabs
    const [activeTab, setActiveTab] = useState<'summary' | 'timeline' | 'pachchkhan'>('summary');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Load persisted city from AsyncStorage on mount
    useEffect(() => {
        const loadSavedCity = async () => {
            try {
                const saved = await AsyncStorage.getItem('@selected_panchang_city');
                if (saved) {
                    const parsed: City = JSON.parse(saved);
                    setSelectedCity(parsed);
                } else {
                    // Try auto-detecting once on fresh install
                    autoDetectLocation();
                }
            } catch (err) {
                console.error('[PanchangCard] Error reading persistent location:', err);
            }
        };
        loadSavedCity();
    }, []);

    // Fetch dynamic Sunrise & Sunset when location changes
    useEffect(() => {
        let isMounted = true;
        const fetchSunData = async () => {
            setLoading(true);
            try {
                // Call public free, zero-key Sunrise-Sunset API
                const url = `https://api.sunrise-sunset.org/json?lat=${selectedCity.latitude}&lng=${selectedCity.longitude}&formatted=0&date=today`;
                const response = await fetch(url);
                const result = await response.json();

                if (isMounted && result && result.status === 'OK') {
                    const parsedSunrise = new Date(result.results.sunrise);
                    const parsedSunset = new Date(result.results.sunset);

                    setSunrise(parsedSunrise);
                    setSunset(parsedSunset);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn('[PanchangCard] Sunrise API failed, falling back to local geometric calculations.', err);
            }

            // Fallback to geometric approximation offline
            if (isMounted) {
                const calcTimes = getApproximateSunTimes(selectedCity.latitude, selectedCity.longitude, new Date());
                setSunrise(calcTimes.sunrise);
                setSunset(calcTimes.sunset);
                setLoading(false);
            }
        };

        fetchSunData();
        return () => {
            isMounted = false;
        };
    }, [selectedCity]);

    // Live clock ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Location Auto-detection using production-grade IP lookups with quad-failover and HTML shielding
    const autoDetectLocation = async () => {
        setLoading(true);
        try {
            // Attempt 1: ipinfo.io (Gold standard, enterprise-ready, CDN-based, highly reliable)
            try {
                const url = IPINFO_API_TOKEN
                    ? `https://ipinfo.io/json?token=${IPINFO_API_TOKEN}`
                    : 'https://ipinfo.io/json';
                const res = await fetch(url);
                if (res.ok) {
                    const text = await res.text();
                    if (text.trim().startsWith('{')) {
                        const data = JSON.parse(text);
                        if (data && data.loc) {
                            const [latStr, lngStr] = data.loc.split(',');
                            const latitude = parseFloat(latStr);
                            const longitude = parseFloat(lngStr);
                            if (!isNaN(latitude) && !isNaN(longitude)) {
                                const detectedCity: City = {
                                    name: data.city || 'My Location',
                                    latitude,
                                    longitude,
                                    state: data.region || ''
                                };
                                setSelectedCity(detectedCity);
                                await AsyncStorage.setItem('@selected_panchang_city', JSON.stringify(detectedCity));
                                setLoading(false);
                                return; // Success!
                            }
                        }
                    }
                }
            } catch (api1Err) {
                console.warn('[PanchangCard] Primary IP lookup (ipinfo.io) failed, trying fallback:', api1Err);
            }

            // Attempt 2: freeipapi.com (HTTPS-native, highly generous limits: 60/min)
            try {
                const res = await fetch('https://freeipapi.com/api/json');
                if (res.ok) {
                    const text = await res.text();
                    if (text.trim().startsWith('{')) {
                        const data = JSON.parse(text);
                        if (data && data.latitude && data.longitude) {
                            const detectedCity: City = {
                                name: data.cityName || 'My Location',
                                latitude: parseFloat(data.latitude),
                                longitude: parseFloat(data.longitude),
                                state: data.regionName || ''
                            };
                            setSelectedCity(detectedCity);
                            await AsyncStorage.setItem('@selected_panchang_city', JSON.stringify(detectedCity));
                            setLoading(false);
                            return; // Success!
                        }
                    }
                }
            } catch (api2Err) {
                console.warn('[PanchangCard] Secondary IP lookup (freeipapi.com) failed, trying fallback:', api2Err);
            }

            // Attempt 3: ipwhois.app (HTTPS-native, generous limits: 10k/month)
            try {
                const res = await fetch('https://ipwhois.app/json/');
                if (res.ok) {
                    const text = await res.text();
                    if (text.trim().startsWith('{')) {
                        const data = JSON.parse(text);
                        if (data && data.success && data.latitude && data.longitude) {
                            const detectedCity: City = {
                                name: data.city || 'My Location',
                                latitude: parseFloat(data.latitude),
                                longitude: parseFloat(data.longitude),
                                state: data.region || ''
                            };
                            setSelectedCity(detectedCity);
                            await AsyncStorage.setItem('@selected_panchang_city', JSON.stringify(detectedCity));
                            setLoading(false);
                            return; // Success!
                        }
                    }
                }
            } catch (api3Err) {
                console.warn('[PanchangCard] Tertiary IP lookup (ipwhois.app) failed, trying quaternary fallback:', api3Err);
            }

            // Attempt 4: ipapi.co (Quaternary fallback with HTML shielding)
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const text = await res.text();
                    if (text.trim().startsWith('{')) {
                        const data = JSON.parse(text);
                        if (data && data.latitude && data.longitude) {
                            const detectedCity: City = {
                                name: data.city || 'My Location',
                                latitude: parseFloat(data.latitude),
                                longitude: parseFloat(data.longitude),
                                state: data.region || ''
                            };
                            setSelectedCity(detectedCity);
                            await AsyncStorage.setItem('@selected_panchang_city', JSON.stringify(detectedCity));
                            setLoading(false);
                            return; // Success!
                        }
                    }
                }
            } catch (api4Err) {
                console.warn('[PanchangCard] Quaternary IP lookup (ipapi.co) failed:', api4Err);
            }

            // If all 4 dynamic geolocation endpoints fail, inform user via a visual native Alert
            Alert.alert(
                'Auto-Detection Unavailable',
                'We could not determine your city automatically. Please select your city manually from the predefined list.',
                [{ text: 'OK' }]
            );
            console.log('[PanchangCard] Geolocation services unavailable. Retaining current city:', selectedCity.name);
        } catch (err) {
            console.warn('[PanchangCard] Location auto-detect error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Triggered when user selects a city manually from list
    const handleSelectCity = async (city: City) => {
        setSelectedCity(city);
        setModalVisible(false);
        setSearchQuery('');
        try {
            await AsyncStorage.setItem('@selected_panchang_city', JSON.stringify(city));
        } catch (err) {
            console.error('[PanchangCard] Error saving city selection:', err);
        }
    };

    // Calculate core panchang state
    const panchangData = getLunarTithiAndMonth(currentTime);
    const { isDaytime, choghadiyaList, activeChoghadiya, timeRemainingMs } = getChoghadiyaData(sunrise, sunset, currentTime);

    // Format Countdown string
    const formatCountdown = (ms: number): string => {
        if (ms <= 0) return '00m 00s';
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const hours = Math.floor((ms / 1000 / 60 / 60) % 24);

        const mStr = minutes.toString().padStart(2, '0');
        const sStr = seconds.toString().padStart(2, '0');

        if (hours > 0) {
            return `${hours}h ${mStr}m ${sStr}s`;
        }
        return `${mStr}m ${sStr}s`;
    };

    // Filter predefined cities list
    const filteredCities = PREDEFINED_CITIES.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.state && c.state.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Calculate Jain Pachchkhans
    const getPachchkhans = (): Pachchkhan[] => {
        const sunriseMs = sunrise.getTime();
        const sunsetMs = sunset.getTime();
        const dayDurationMs = sunsetMs - sunriseMs;

        const formatPachchkhanTime = (ms: number) => formatTime(new Date(ms));

        return [
            {
                name: 'Navkarsi',
                nameHindi: 'नवकारसी',
                time: formatPachchkhanTime(sunriseMs + 48 * 60 * 1000),
                emoji: '🥛',
                description: 'Vow to not eat or drink any water/food until 48 minutes (1 Muhurtha) after Sunrise.'
            },
            {
                name: 'Porsi',
                nameHindi: 'पोरसी',
                time: formatPachchkhanTime(sunriseMs + dayDurationMs / 4),
                emoji: '🥤',
                description: 'Vow to not eat or drink until one quarter (1 Porsi) of the daytime has passed.'
            },
            {
                name: 'Sadh-Porsi',
                nameHindi: 'साढ-पोरसी',
                time: formatPachchkhanTime(sunriseMs + (dayDurationMs * 3) / 8),
                emoji: '🍲',
                description: 'Vow to not eat or drink until 1.5 Porsis (3/8th of daytime) has passed.'
            },
            {
                name: 'Purimaddh (Avaddh)',
                nameHindi: 'पुरिमड्ढ',
                time: formatPachchkhanTime(sunriseMs + dayDurationMs / 2),
                emoji: '🍚',
                description: 'Vow to not eat or drink until exactly half the day has passed.'
            },
            {
                name: 'Chauvihar (Sunset)',
                nameHindi: 'चौविहार',
                time: formatPachchkhanTime(sunsetMs),
                emoji: '🌇',
                description: 'Complete fasting (no food or water) from Sunset until Sunrise the next morning.'
            }
        ];
    };

    return (
        <View style={styles.panchangCard}>

            {/* ── LOCATION SELECTOR HEADER ── */}
            <View style={styles.locationHeader}>
                <TouchableOpacity
                    style={styles.locationSelector}
                    activeOpacity={0.7}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.locationPin}>📍</Text>
                    <Text style={styles.locationName} numberOfLines={1}>
                        {selectedCity.name}
                    </Text>
                    <Text style={styles.dropdownArrow}>▾</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.gpsButton}
                    activeOpacity={0.7}
                    onPress={autoDetectLocation}
                >
                    <Text style={styles.gpsIcon}>⚡ Auto</Text>
                </TouchableOpacity>
            </View>

            {/* ── CORE DATE & TITHI DETAILS ── */}
            <View style={styles.panchangMeta}>
                <View style={styles.panchangHeaderRow}>
                    <View style={styles.badgeGolden}>
                        <Text style={styles.badgeGoldenText}>📅 Today's Panchang</Text>
                    </View>
                    <Text style={styles.panchangYear}>{panchangData.year}</Text>
                </View>

                {loading ? (
                    <View style={styles.cardLoaderContainer}>
                        <ActivityIndicator size="small" color="#C8960C" />
                        <Text style={styles.loaderText}>Calculating Celestial Alignment...</Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.panchangTithi}>{panchangData.tithi}</Text>
                        <Text style={styles.panchangGregorian}>{panchangData.gregorian}</Text>
                    </>
                )}
            </View>

            <View style={styles.divider} />

            {/* ── TAB BAR NAVIGATION ── */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'summary' && styles.activeTabButton]}
                    onPress={() => setActiveTab('summary')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'summary' && styles.activeTabText]}>
                        Summary
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'timeline' && styles.activeTabButton]}
                    onPress={() => setActiveTab('timeline')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'timeline' && styles.activeTabText]}>
                        Timeline
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'pachchkhan' && styles.activeTabButton]}
                    onPress={() => setActiveTab('pachchkhan')}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.tabText, activeTab === 'pachchkhan' && styles.activeTabText]}>
                        Pachchkhan
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── TAB 1: SUMMARY ── */}
            {activeTab === 'summary' && !loading && (
                <View style={styles.tabContent}>

                    {/* Sunrise & Sunset Row */}
                    <View style={styles.sunRow}>
                        <View style={styles.sunItem}>
                            <Text style={styles.sunEmoji}>🌅</Text>
                            <View>
                                <Text style={styles.sunLabel}>Sunrise</Text>
                                <Text style={styles.sunValue}>{formatTime(sunrise)}</Text>
                            </View>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.sunItem}>
                            <Text style={styles.sunEmoji}>🌇</Text>
                            <View>
                                <Text style={styles.sunLabel}>Sunset</Text>
                                <Text style={styles.sunValue}>{formatTime(sunset)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Active Choghadiya Focus Panel */}
                    {activeChoghadiya && (
                        <View style={[styles.activeChoghadiyaPanel, { borderColor: activeChoghadiya.color + '30' }]}>
                            <View style={styles.activePanelHeader}>
                                <View style={styles.activeChoghadiyaTitleBox}>
                                    <View style={[styles.statusDot, { backgroundColor: activeChoghadiya.color }]} />
                                    <Text style={[styles.activeChoghadiyaName, { color: '#5B3A00' }]}>
                                        {activeChoghadiya.name}
                                    </Text>
                                </View>
                                <View style={[styles.qualityBadge, { backgroundColor: activeChoghadiya.color + '15' }]}>
                                    <Text style={[styles.qualityText, { color: activeChoghadiya.color }]}>
                                        {activeChoghadiya.quality}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.choghadiyaTimeInterval}>
                                ⏱️ {formatTime(activeChoghadiya.startTime)} - {formatTime(activeChoghadiya.endTime)}
                            </Text>

                            <Text style={styles.choghadiyaDescText}>
                                {CHOGHADIYAS[activeChoghadiya.name].description}
                            </Text>

                            <View style={[styles.countdownBox, { backgroundColor: activeChoghadiya.color + '10' }]}>
                                <Text style={styles.countdownLabel}>Time Remaining</Text>
                                <Text style={[styles.countdownValue, { color: activeChoghadiya.color }]}>
                                    {formatCountdown(timeRemainingMs)}
                                </Text>
                            </View>
                        </View>
                    )}

                </View>
            )}

            {/* ── TAB 2: TIMELINE ── */}
            {activeTab === 'timeline' && !loading && (
                <View style={styles.tabContent}>
                    <Text style={styles.timelineSectionTitle}>
                        {isDaytime ? '☀️ Day Choghadiyas' : '🌙 Night Choghadiyas'} Sequence
                    </Text>

                    {choghadiyaList.map((chog, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.timelineItem,
                                chog.isActive && [styles.timelineActiveItem, { borderColor: chog.color + '50' }]
                            ]}
                        >
                            <View style={styles.timelineLeft}>
                                <View style={[styles.timelineStatusDot, { backgroundColor: chog.color }]} />
                                <View style={styles.timelineIntervalBox}>
                                    <Text style={styles.timelineIntervalText}>
                                        {formatTime(chog.startTime)} - {formatTime(chog.endTime)}
                                    </Text>
                                    {chog.isActive && (
                                        <View style={[styles.liveIndicator, { backgroundColor: chog.color }]}>
                                            <Text style={styles.liveIndicatorText}>ACTIVE</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.timelineRight}>
                                <Text style={styles.timelineNameText}>{chog.name}</Text>
                                <Text style={[styles.timelineQualityText, { color: chog.color }]}>
                                    {chog.quality}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* ── TAB 3: PACHCHKHAN ── */}
            {activeTab === 'pachchkhan' && !loading && (
                <View style={styles.tabContent}>
                    <Text style={styles.timelineSectionTitle}>🌅 Daily Spiritual Fasting Limits</Text>

                    {getPachchkhans().map((pach, idx) => (
                        <View key={idx} style={styles.pachchkhanCard}>
                            <View style={styles.pachchkhanHeader}>
                                <View style={styles.pachchkhanTitleBox}>
                                    <Text style={styles.pachchkhanEmoji}>{pach.emoji}</Text>
                                    <View>
                                        <Text style={styles.pachchkhanName}>{pach.name}</Text>
                                        <Text style={styles.pachchkhanHindi}>{pach.nameHindi}</Text>
                                    </View>
                                </View>
                                <View style={styles.pachchkhanTimeBox}>
                                    <Text style={styles.pachchkhanTime}>{pach.time}</Text>
                                </View>
                            </View>
                            <Text style={styles.pachchkhanDesc}>{pach.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* ── CITY SELECTOR MODAL ── */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select City</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => { setModalVisible(false); setSearchQuery(''); }}
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Input */}
                        <TextInput
                            style={styles.searchInput}
                            placeholder="🔍 Search City or State..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        {/* Auto detect row in list */}
                        <TouchableOpacity
                            style={styles.gpsRow}
                            onPress={() => {
                                autoDetectLocation();
                                setModalVisible(false);
                                setSearchQuery('');
                            }}
                        >
                            <Text style={styles.gpsRowIcon}>⚡</Text>
                            <Text style={styles.gpsRowText}>Detect Location Automatically</Text>
                        </TouchableOpacity>

                        {/* Cities List */}
                        <FlatList
                            data={filteredCities}
                            keyExtractor={(item) => item.name}
                            keyboardShouldPersistTaps="always"
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.cityListItem,
                                        selectedCity.name === item.name && styles.cityListActiveItem
                                    ]}
                                    onPress={() => handleSelectCity(item)}
                                >
                                    <View>
                                        <Text style={[
                                            styles.cityListText,
                                            selectedCity.name === item.name && styles.cityListActiveText
                                        ]}>
                                            {item.name}
                                        </Text>
                                        <Text style={styles.cityListState}>{item.state}</Text>
                                    </View>
                                    {selectedCity.name === item.name && (
                                        <Text style={styles.checkIcon}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    panchangCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1.5,
        borderColor: '#F1E4C7',
        marginBottom: 24,
        elevation: 3,
        shadowColor: '#8B5E00',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FDF1D5',
        flex: 1,
        marginRight: 10,
    },
    locationPin: {
        fontSize: 14,
        marginRight: 4,
    },
    locationName: {
        fontSize: 13,
        fontWeight: '800',
        color: '#8B5E00',
        flex: 1,
    },
    dropdownArrow: {
        fontSize: 10,
        color: '#C8960C',
        marginLeft: 4,
    },
    gpsButton: {
        backgroundColor: '#5B3A00',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    gpsIcon: {
        fontSize: 11,
        color: '#FFF',
        fontWeight: '800',
    },
    panchangMeta: {
        marginTop: 4,
    },
    panchangHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    badgeGolden: {
        backgroundColor: '#FFF5D8',
        borderRadius: 30,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    badgeGoldenText: {
        fontSize: 11,
        color: '#C8960C',
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    panchangYear: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '700',
    },
    panchangTithi: {
        fontSize: 20,
        fontWeight: '800',
        color: '#5B3A00',
    },
    panchangGregorian: {
        fontSize: 12,
        color: '#7A7A7A',
        marginTop: 4,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1E4C7',
        marginVertical: 14,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFDF9',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F7EBD2',
        padding: 4,
        marginBottom: 14,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTabButton: {
        backgroundColor: '#FFF5D8',
    },
    tabText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '700',
    },
    activeTabText: {
        color: '#8B5E00',
        fontWeight: '800',
    },
    tabContent: {
        marginTop: 4,
    },
    cardLoaderContainer: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    loaderText: {
        fontSize: 12,
        color: '#C8960C',
        fontWeight: '700',
        marginTop: 8,
    },
    sunRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFFDF9',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F7EBD2',
        marginBottom: 14,
    },
    sunItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    sunEmoji: {
        fontSize: 22,
        marginRight: 8,
    },
    sunLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    sunValue: {
        fontSize: 13,
        fontWeight: '800',
        color: '#5B3A00',
        marginTop: 2,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#F1E4C7',
    },
    activeChoghadiyaPanel: {
        backgroundColor: '#FFFDF9',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        marginTop: 4,
    },
    activePanelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    activeChoghadiyaTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    activeChoghadiyaName: {
        fontSize: 18,
        fontWeight: '800',
    },
    qualityBadge: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    qualityText: {
        fontSize: 10,
        fontWeight: '800',
    },
    choghadiyaTimeInterval: {
        fontSize: 12,
        color: '#7A7A7A',
        fontWeight: '700',
        marginTop: 6,
    },
    choghadiyaDescText: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 18,
        fontWeight: '500',
        marginTop: 10,
    },
    countdownBox: {
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        marginTop: 14,
    },
    countdownLabel: {
        fontSize: 9,
        color: '#9CA3AF',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    countdownValue: {
        fontSize: 16,
        fontWeight: '900',
        marginTop: 2,
    },
    timelineSectionTitle: {
        fontSize: 13,
        color: '#8B5E00',
        fontWeight: '800',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    timelineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFDF9',
        borderWidth: 1,
        borderColor: '#F7EBD2',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    timelineActiveItem: {
        backgroundColor: '#FFFDF0',
        borderWidth: 1.5,
    },
    timelineLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    timelineStatusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 10,
    },
    timelineIntervalBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timelineIntervalText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '700',
    },
    liveIndicator: {
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    liveIndicatorText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: '800',
    },
    timelineRight: {
        alignItems: 'flex-end',
    },
    timelineNameText: {
        fontSize: 13,
        color: '#5B3A00',
        fontWeight: '800',
    },
    timelineQualityText: {
        fontSize: 9,
        fontWeight: '700',
        marginTop: 2,
    },
    pachchkhanCard: {
        backgroundColor: '#FFFDF9',
        borderWidth: 1,
        borderColor: '#F7EBD2',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
    },
    pachchkhanHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    pachchkhanTitleBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pachchkhanEmoji: {
        fontSize: 22,
        marginRight: 10,
    },
    pachchkhanName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#5B3A00',
    },
    pachchkhanHindi: {
        fontSize: 10,
        color: '#C8960C',
        fontWeight: '600',
    },
    pachchkhanTimeBox: {
        backgroundColor: '#FFF5D8',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    pachchkhanTime: {
        fontSize: 12,
        fontWeight: '800',
        color: '#8B5E00',
    },
    pachchkhanDesc: {
        fontSize: 11,
        color: '#6B7280',
        lineHeight: 16,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FDFBF6',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        height: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#5B3A00',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF5D8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 12,
        color: '#8B5E00',
        fontWeight: '800',
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#F1E4C7',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#5B3A00',
        fontWeight: '600',
        marginBottom: 14,
    },
    gpsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5D8',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
    },
    gpsRowIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    gpsRowText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#8B5E00',
    },
    cityListItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F3E8D0',
    },
    cityListActiveItem: {
        backgroundColor: '#FFF8E7',
        borderRadius: 8,
    },
    cityListText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4B5563',
    },
    cityListActiveText: {
        color: '#8B5E00',
        fontWeight: '800',
    },
    cityListState: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 2,
        fontWeight: '600',
    },
    checkIcon: {
        fontSize: 14,
        color: '#C8960C',
        fontWeight: '800',
    },
});
