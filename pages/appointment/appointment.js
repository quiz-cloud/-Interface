// pages/appointment/appointment.js
const bookingService = require("../../services/appointment-booking");
const TIME_LABELS = bookingService.TIME_LABELS;
const WEEK_DATES = bookingService.WEEK_DATES;

const CATEGORY_CONFIG = [
  {
    name: "激光切割",
    deviceOptions: ["全部设备", "激光切割机"],
    machines: [
      { id: "laser-1", name: "激光切割机 1" },
      { id: "laser-2", name: "激光切割机 2" },
      { id: "laser-3", name: "激光切割机 3" }
    ]
  },
  {
    name: "3D打印",
    deviceOptions: ["全部设备", "3D打印机"],
    machines: [
      { id: "print-1", name: "3D打印机 1" },
      { id: "print-2", name: "3D打印机 2" }
    ]
  },
  {
    name: "电子工艺",
    deviceOptions: ["全部设备", "电子工艺"],
    machines: [
      { id: "electronic-1", name: "电子工艺设备 1" },
      { id: "electronic-2", name: "电子工艺设备 2" }
    ]
  },
  {
    name: "基础实训",
    deviceOptions: ["全部设备", "基础实训"],
    machines: [
      { id: "base-1", name: "基础实训设备 1" },
      { id: "base-2", name: "基础实训设备 2" }
    ]
  }
];

function getAllMachineIds() {
  return CATEGORY_CONFIG.reduce((acc, category) => {
    const machineIds = category.machines.map((machine) => machine.id);
    return acc.concat(machineIds);
  }, []);
}

Page({
  data: {
    categories: CATEGORY_CONFIG.map((item) => ({ name: item.name })),
    selectedCategoryIndex: 0,
    deviceOptions: CATEGORY_CONFIG[0].deviceOptions,
    selectedDeviceIndex: 0,
    weekDates: WEEK_DATES,
    selectedDateIndex: 0,
    timeLabels: TIME_LABELS,
    machines: [],
    myBooking: {
      name: "暂无预约",
      date: "-",
      time: "-",
      room: "-",
      processingFileName: "-",
      statusText: "未报道",
      reported: false
    }
  },

  onLoad() {
    bookingService.ensureLocalBookingStore(getAllMachineIds());
    this.refreshMyBooking();
    this.refreshMachines();
  },

  onShow() {
    this.refreshMyBooking();
    this.refreshMachines();
  },

  refreshMyBooking() {
    const latestBooking = bookingService.getLatestBooking();
    this.setData({
      myBooking: latestBooking || {
        name: "暂无预约",
        date: "-",
        time: "-",
        room: "-",
        processingFileName: "-",
        statusText: "未报道",
        reported: false
      }
    });

    if (latestBooking) {
      this.setData({
        myBooking: {
          ...latestBooking,
          processingFileName: latestBooking.processingFileName || "-",
          statusText: latestBooking.reported ? "已报道" : "未报道"
        }
      });
    }
  },

  getCurrentDateKey() {
    const { selectedDateIndex } = this.data;
    return (WEEK_DATES[selectedDateIndex] || WEEK_DATES[0]).dateKey;
  },

  getBookedSlots(dateKey, machineId) {
    return bookingService.getBookedSlots({
      dateKey,
      machineId,
      machineIds: getAllMachineIds()
    });
  },

  getSlotsByBooking(machineId, dateKey) {
    const bookedSlots = this.getBookedSlots(dateKey, machineId);
    const bookedSet = new Set(bookedSlots);

    return TIME_LABELS.map((_, index) => ({
      status: bookedSet.has(index) ? "busy" : "free"
    }));
  },

  refreshMachines() {
    const { selectedCategoryIndex, selectedDeviceIndex } = this.data;
    const category = CATEGORY_CONFIG[selectedCategoryIndex] || CATEGORY_CONFIG[0];
    const dateKey = this.getCurrentDateKey();

    let machines = category.machines;
    if (selectedDeviceIndex > 0) {
      const selectedOption = category.deviceOptions[selectedDeviceIndex] || "";
      machines = machines.filter((machine) => machine.name.indexOf(selectedOption) > -1);
    }

    const machineCards = machines.map((machine) => ({
      id: machine.id,
      name: machine.name,
      slots: this.getSlotsByBooking(machine.id, dateKey)
    }));

    this.setData({
      deviceOptions: category.deviceOptions,
      machines: machineCards
    });
  },

  onCategoryTap(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({
      selectedCategoryIndex: index,
      selectedDeviceIndex: 0
    });
    this.refreshMachines();
  },

  onDateTap(e) {
    const index = Number(e.currentTarget.dataset.index || 0);
    this.setData({ selectedDateIndex: index });
    this.refreshMachines();
  },

  onDeviceChange(e) {
    this.setData({ selectedDeviceIndex: Number(e.detail.value || 0) });
    this.refreshMachines();
  },

  onReserveTap(e) {
    const machineIndex = Number(e.currentTarget.dataset.index || 0);
    const machine = this.data.machines[machineIndex];
    if (!machine) {
      return;
    }

    const selectedDate = WEEK_DATES[this.data.selectedDateIndex] || WEEK_DATES[0];
    const dateLabel = `${selectedDate.date} ${selectedDate.day}`;
    const query = `machineId=${encodeURIComponent(machine.id)}&machineName=${encodeURIComponent(machine.name)}&dateKey=${encodeURIComponent(selectedDate.dateKey)}&dateLabel=${encodeURIComponent(dateLabel)}`;
    wx.navigateTo({
      url: `/pages/appointment/appoint?${query}`
    });
  },

  onMyActionTap(e) {
    const action = e.currentTarget.dataset.action || "";
    const latestBooking = bookingService.getLatestBooking();
    if (!latestBooking) {
      wx.showToast({
        title: "暂无可操作预约",
        icon: "none"
      });
      return;
    }

    if (action === "edit") {
      if (latestBooking.reported) {
        wx.showToast({
          title: "已报道，无法修改文件",
          icon: "none"
        });
        return;
      }

      wx.chooseMessageFile({
        count: 1,
        type: "file",
        success: (res) => {
          const file = (res.tempFiles || [])[0];
          if (!file) {
            return;
          }

          bookingService.patchLatestBooking({
            processingFileName: file.name || "未命名文件",
            processingFilePath: file.path || ""
          });
          this.refreshMyBooking();
          wx.showToast({
            title: "加工文件已更新",
            icon: "success"
          });
        }
      });
      return;
    }

    if (action === "checkin") {
      if (latestBooking.reported) {
        wx.showToast({
          title: "已完成报道",
          icon: "none"
        });
        return;
      }

      bookingService.patchLatestBooking({ reported: true });
      this.refreshMyBooking();
      wx.showToast({
        title: "报道成功",
        icon: "success"
      });
      return;
    }

    wx.showToast({
      title: "功能待接入",
      icon: "none"
    });
  }
});