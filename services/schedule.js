const scheduleData = {
    selectedConcentratedIndex: 0,
    selectedDispersedIndex: 0,
    concentratedTime: {
        morningStart: "08:50",
        morningEnd: "12:00",
        afternoonStart: "14:00",
        afternoonEnd: "17:00"
    },
    dispersedTime: {
        morningStart: "08:50",
        morningEnd: "12:00",
        afternoonStart: "14:50",
        afternoonEnd: "17:00"
    },
    concentratedDates: [
        { day: "周一", date: "02-16" },
        { day: "周二", date: "02-17" },
        { day: "周三", date: "02-18" },
        { day: "周四", date: "02-19" },
        { day: "周五", date: "02-20" }
    ],
    concentratedMorningCourses: [
        { name: "安全教育", room: "D3-b101" },
        { name: "木工创意", room: "D3-b101" },
        { name: "特种加工", room: "D3-b101" },
        { name: "网联汽车", room: "D3-b101" },
        { name: "人工智能", room: "D3-b101" }
    ],
    concentratedAfternoonCourses: [
        { name: "VR+安全教育", room: "D3-b101" },
        { name: "木工创意", room: "D3-b101" },
        { name: "特种加工", room: "D3-b101" },
        { name: "网联汽车", room: "D3-b101" },
        { name: "人工智能", room: "D3-b101" }
    ],
    dispersedDates: [
        { day: "周三", date: "03-18" },
        { day: "周三", date: "03-25" },
        { day: "周三", date: "04-01" },
        { day: "周三", date: "04-08" },
        { day: "周三", date: "04-15" }
    ],
    dispersedMorningCourses: [
        { name: "项目介绍", room: "D3-b101" },
        { name: "自由制作", room: "D3-b101" },
        { name: "自由制作", room: "D3-b101" },
        { name: "预验收", room: "D3-b101" },
        { name: "最终考核", room: "D3-b101" }
    ],
    dispersedAfternoonRooms: [
        { name: "项目介绍", room: "D3-b101" },
        { name: "自由制作", room: "D3-b101" },
        { name: "自由制作", room: "D3-b101" },
        { name: "预验收", room: "D3-b101" },
        { name: "最终考核", room: "D3-b101" }
    ]
};

function getSchedule() {
    return Promise.resolve(scheduleData);
}

module.exports = {
    getSchedule
};
