// pages/notices/notices.js
Page({
  data: {
    statusBarHeight: 20,
    displayDate: '', // 动态生成
    selectedDate: '', // 动态生成
    weekDays: [],    // 动态生成
    notices: [
      { id: 1, title: '观看木工安全教育视频', status: 'pending', statusText: '待完成', deadline: '12月04日 24:00' },
      { id: 2, title: '分散项目组队', status: 'pending', statusText: '待完成', deadline: '12月08日 24:00' },
      { id: 3, title: '实习报告提交', status: 'completed', statusText: '已完成', deadline: '01月15日 24:00' }
    ]
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync(); 
    this.setData({ statusBarHeight: sysInfo.statusBarHeight }); 
    
    this.initCalendar();
  },

  initCalendar() {
    const now = new Date();
    const dayLabels = ['一', '二', '三', '四', '五', '六', '日'];
    
    // 获取当前是周几 (0是周日, 1-6是周一到周六)
    let currentDay = now.getDay();
    // 转换为周一为起始 (0-6 对应 周一到周日)
    let offset = currentDay === 0 ? 6 : currentDay - 1;
    
    // 找到本周一的日期
    const monday = new Date(now);
    monday.setDate(now.getDate() - offset);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const fullDate = `${year}-${month}-${day}`;
      
      weekDays.push({
        label: dayLabels[i],
        day: date.getDate().toString(), // 这里的 day 就会变成 16, 17, 18...
        fullDate: fullDate,
        hasEvent: this.checkEvent(fullDate) // 模拟判断是否有红点
      });
    }

    const todayStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}`; 
    const selectedStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    this.setData({
      weekDays,
      displayDate: todayStr,
      selectedDate: selectedStr
    });
  },

  // 模拟判断日期是否有任务
  checkEvent(date) {
    const events = ['2026-02-16', '2026-02-20']; // 这里的逻辑可以根据你的 notices 数据动态匹配
    return events.includes(date);
  },

  selectDate(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.date });
  },

  viewDetail(e) {
    wx.showToast({ title: '详情功能开发中', icon: 'none' });
  }
});