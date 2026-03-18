// pages/notices/notices.js
const noticeService = require("../../services/notices");

Page({
  data: {
    statusBarHeight: 20,
    displayDate: '', 
    selectedDate: '', 
    weekDays: [],    
    notices: [],
    isExpanded: false
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync(); 
    this.setData({ 
      statusBarHeight: sysInfo.statusBarHeight,
      notices: noticeService.getNotices() // 从 Service 获取数据 
    }); 
    this.initCalendar();
  },

  // 初始化日历
  initCalendar() {
    const now = new Date();
    const weekDays = noticeService.getWeekDays(now);
    const selectedDate = noticeService.formatDate(now);
    const displayDate = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`;

    this.setData({
      weekDays,
      selectedDate,
      displayDate
    });
  },

  // 点击日期切换
  selectDate(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    
    this.setData({ selectedDate: date });
    // 可以在这里根据日期动态过滤通知列表
    console.log("当前选择日期：", date);
  },

  toggleExpand() {
    this.setData({ isExpanded: !this.data.isExpanded });
    if (this.data.isExpanded && !this.data.monthDays.length) {
      // 仅在展开且月历数据为空时初始化（此处省略月历 Service 逻辑，模式一致）
    }
  }
});