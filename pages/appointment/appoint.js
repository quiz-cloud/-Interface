const bookingService = require("../../services/appointment-booking");

const CATEGORY_CONFIG = [
  {
    machines: [{ id: "laser-1" }, { id: "laser-2" }, { id: "laser-3" }]
  },
  {
    machines: [{ id: "print-1" }, { id: "print-2" }]
  },
  {
    machines: [{ id: "electronic-1" }, { id: "electronic-2" }]
  },
  {
    machines: [{ id: "base-1" }, { id: "base-2" }]
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
    machineId: "",
    machineName: "",
    dateKey: "",
    dateLabel: "",
    timeSlots: [],
    selectedSlotIndex: -1,
    processingFileName: "",
    processingFilePath: ""
  },

  onLoad(options) {
    const machineId = decodeURIComponent(options.machineId || "");
    const machineName = decodeURIComponent(options.machineName || "");
    const dateKey = decodeURIComponent(options.dateKey || "");
    const dateLabel = decodeURIComponent(options.dateLabel || "");

    this.setData({
      machineId,
      machineName,
      dateKey,
      dateLabel
    });

    this.refreshTimeSlots();
  },

  refreshTimeSlots() {
    const { machineId, dateKey } = this.data;
    const machineIds = getAllMachineIds();
    bookingService.ensureLocalBookingStore(machineIds);

    const bookedSlots = bookingService.getBookedSlots({
      dateKey,
      machineId,
      machineIds
    });
    const bookedSet = new Set(bookedSlots);

    const timeSlots = bookingService.TIME_LABELS.map((time, index) => {
      const nextTime = bookingService.TIME_LABELS[index + 1] || "18";
      const isBooked = bookedSet.has(index);
      return {
        index,
        label: `${time}:00 - ${nextTime}:00`,
        status: isBooked ? "busy" : "free"
      };
    });

    this.setData({
      timeSlots,
      selectedSlotIndex: -1
    });
  },

  onSlotTap(e) {
    const slotIndex = Number(e.currentTarget.dataset.index || -1);
    const slot = this.data.timeSlots[slotIndex];
    if (!slot || slot.status === "busy") {
      return;
    }
    this.setData({ selectedSlotIndex: slotIndex });
  },

  onUploadFileTap() {
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      success: (res) => {
        const file = (res.tempFiles || [])[0];
        if (!file) {
          return;
        }
        this.setData({
          processingFileName: file.name || "未命名文件",
          processingFilePath: file.path || ""
        });
      }
    });
  },

  onConfirmTap() {
    const {
      selectedSlotIndex,
      machineId,
      dateKey,
      machineName,
      dateLabel,
      processingFileName,
      processingFilePath
    } = this.data;
    if (selectedSlotIndex < 0) {
      wx.showToast({
        title: "请选择空闲时间",
        icon: "none"
      });
      return;
    }

    if (!processingFileName) {
      wx.showToast({
        title: "请先上传加工文件",
        icon: "none"
      });
      return;
    }

    const machineIds = getAllMachineIds();
    const bookedSlots = bookingService.getBookedSlots({
      dateKey,
      machineId,
      machineIds
    });

    if (bookedSlots.indexOf(selectedSlotIndex) > -1) {
      wx.showToast({
        title: "该时段已被预约",
        icon: "none"
      });
      this.refreshTimeSlots();
      return;
    }

    const updatedSlots = bookedSlots.concat(selectedSlotIndex).sort((a, b) => a - b);
    bookingService.saveBookedSlots({
      dateKey,
      machineId,
      slots: updatedSlots,
      machineIds
    });

    const startTime = bookingService.TIME_LABELS[selectedSlotIndex];
    const endTime = bookingService.TIME_LABELS[selectedSlotIndex + 1] || "18";
    bookingService.saveLatestBooking({
      machineId,
      dateKey,
      name: machineName,
      date: dateLabel,
      time: `${startTime}:00 - ${endTime}:00`,
      room: "D3-b101",
      processingFileName,
      processingFilePath,
      reported: false
    });

    wx.showToast({
      title: "预约成功",
      icon: "success"
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 350);
  }
});