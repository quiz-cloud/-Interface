const BOOKING_STORAGE_KEY = "APPOINTMENT_BOOKING_MOCK_V1";
const LAST_BOOKING_STORAGE_KEY = "APPOINTMENT_LAST_BOOKING_V1";
const TIME_LABELS = ["9", "10", "11", "12", "14", "15", "16", "17"];

const WEEK_DATES = [
    { date: "03.16", day: "周一", dateKey: "2026-03-16" },
    { date: "03.17", day: "周二", dateKey: "2026-03-17" },
    { date: "03.18", day: "周三", dateKey: "2026-03-18" },
    { date: "03.19", day: "周四", dateKey: "2026-03-19" },
    { date: "03.20", day: "周五", dateKey: "2026-03-20" },
    { date: "03.21", day: "周六", dateKey: "2026-03-21" },
    { date: "03.22", day: "周日", dateKey: "2026-03-22" }
];

function getMockBookedSlots(machineId, dateIndex) {
    const hash = machineId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const type = (hash + dateIndex) % 3;

    if (type === 0) {
        return [];
    }

    if (type === 1) {
        return [1, 2, 5].filter((slot) => slot < TIME_LABELS.length);
    }

    return TIME_LABELS.map((_, index) => index);
}

function createMockStore(machineIds) {
    const bookingsByDate = {};

    WEEK_DATES.forEach((weekDate, dateIndex) => {
        const machineBooking = {};
        machineIds.forEach((machineId) => {
            machineBooking[machineId] = getMockBookedSlots(machineId, dateIndex);
        });
        bookingsByDate[weekDate.dateKey] = machineBooking;
    });

    return {
        version: 1,
        bookingsByDate
    };
}

function ensureLocalBookingStore(machineIds) {
    const localStore = wx.getStorageSync(BOOKING_STORAGE_KEY);
    if (localStore && localStore.bookingsByDate) {
        return localStore;
    }

    const mockStore = createMockStore(machineIds);
    wx.setStorageSync(BOOKING_STORAGE_KEY, mockStore);
    return mockStore;
}

function getBookedSlots({ dateKey, machineId, machineIds }) {
    const localStore = ensureLocalBookingStore(machineIds);
    const dateBookings = (localStore.bookingsByDate || {})[dateKey] || {};
    const bookedSlots = dateBookings[machineId] || [];
    return bookedSlots.filter((slot) => slot >= 0 && slot < TIME_LABELS.length);
}

function saveBookedSlots({ dateKey, machineId, slots, machineIds }) {
    const localStore = ensureLocalBookingStore(machineIds);
    const allBookingsByDate = localStore.bookingsByDate || {};
    const dateBookings = allBookingsByDate[dateKey] || {};

    localStore.bookingsByDate = {
        ...allBookingsByDate,
        [dateKey]: {
            ...dateBookings,
            [machineId]: slots
        }
    };

    wx.setStorageSync(BOOKING_STORAGE_KEY, localStore);
}

function saveLatestBooking(booking) {
    wx.setStorageSync(LAST_BOOKING_STORAGE_KEY, booking || null);
}

function getLatestBooking() {
    return wx.getStorageSync(LAST_BOOKING_STORAGE_KEY) || null;
}

function patchLatestBooking(patch) {
    const currentBooking = getLatestBooking() || {};
    const nextBooking = {
        ...currentBooking,
        ...(patch || {})
    };
    saveLatestBooking(nextBooking);
    return nextBooking;
}

module.exports = {
    TIME_LABELS,
    WEEK_DATES,
    ensureLocalBookingStore,
    getBookedSlots,
    saveBookedSlots,
    saveLatestBooking,
    getLatestBooking,
    patchLatestBooking
};
