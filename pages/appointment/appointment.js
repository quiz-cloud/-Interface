// pages/appointment/appointment.js
// 统一的时间段占用状态示例。
const DEFAULT_SLOTS = [
  { status: "busy" },
  { status: "busy" },
  { status: "mid" },
  { status: "free" },
  { status: "free" },
  { status: "busy" },
  { status: "busy" },
  { status: "free" }
];

// 类别与设备选项、设备列表的对应关系。
const CATEGORY_CONFIG = [
  {
    name: "激光切割",
    deviceOptions: ["全部设备", "激光切割机"],
    machines: [
      { name: "激光切割机 1", slots: DEFAULT_SLOTS },
      { name: "激光切割机 2", slots: DEFAULT_SLOTS },
      { name: "激光切割机 3", slots: DEFAULT_SLOTS }
    ]
  },
  {
    name: "3D打印",
    deviceOptions: ["全部设备", "3D打印机"],
    machines: [
      { name: "3D打印机 1", slots: DEFAULT_SLOTS },
      { name: "3D打印机 2", slots: DEFAULT_SLOTS }
    ]
  },
  {
    name: "电子工艺",
    deviceOptions: ["全部设备", "电子工艺"],
    machines: [
      { name: "电子工艺设备 1", slots: DEFAULT_SLOTS },
      { name: "电子工艺设备 2", slots: DEFAULT_SLOTS }
    ]
  },
  {
    name: "基础实训",
    deviceOptions: ["全部设备", "基础实训"],
    machines: [
      { name: "基础实训设备 1", slots: DEFAULT_SLOTS },
      { name: "基础实训设备 2", slots: DEFAULT_SLOTS }
    ]
  }
];

Page({
  data: {
    // 顶部类别标签。
    categories: CATEGORY_CONFIG.map((item) => ({ name: item.name })),
    selectedCategoryIndex: 0,
    // 当前类别下的设备筛选项。
    deviceOptions: CATEGORY_CONFIG[0].deviceOptions,
    selectedDeviceIndex: 0,
    weekDates: [
      { date: "03.16", day: "周一" },
      { date: "03.17", day: "周二" },
      { date: "03.18", day: "周三" },
      { date: "03.19", day: "周四" },
      { date: "03.20", day: "周五" },
      { date: "03.21", day: "周六" },
      { date: "03.22", day: "周日" }
    ],
    selectedDateIndex: 0,
    timeLabels: ["9", "10", "11", "12", "14", "15", "16", "17"],
    // 当前类别对应的设备列表。
    machines: CATEGORY_CONFIG[0].machines,
    myBooking: {
      name: "激光切割机1",
      date: "3月16日",
      time: "早上 10:00 - 11:00",
      room: "D3-b101"
    }
  },

  onCategoryTap(e) {
    // 切换类别时同步设备选项与设备列表。
    const index = Number(e.currentTarget.dataset.index || 0);
    const config = CATEGORY_CONFIG[index] || CATEGORY_CONFIG[0];
    this.setData({
      selectedCategoryIndex: index,
      selectedDeviceIndex: 0,
      deviceOptions: config.deviceOptions,
      machines: config.machines
    });
  },

  onDateTap(e) {
    // 切换预约日期。
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({ selectedDateIndex: index });
  },

  onDeviceChange(e) {
    // 设备筛选切换。
    this.setData({ selectedDeviceIndex: Number(e.detail.value || 0) });
  },

  onReserveTap() {
    // 预约入口占位提示。
    wx.showToast({
      title: "预约功能待接入",
      icon: "none"
    });
  },

  onMyActionTap(e) {
    // 我的预约操作占位提示。
    const action = e.currentTarget.dataset.action || "";
    const titleMap = {
      edit: "加工文件修改功能待接入",
      checkin: "报道功能待接入"
    };

    wx.showToast({
      title: titleMap[action] || "功能待接入",
      icon: "none"
    });
  }
});