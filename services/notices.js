// services/notice-service.js

const INITIAL_NOTICES = [
  { id: 1, title: '观看木工安全教育视频', status: 'pending', statusText: '待完成', deadline: '12月04日 24:00' },
  { id: 2, title: '分散项目组队', status: 'pending', statusText: '待完成', deadline: '12月08日 24:00' },
  { id: 3, title: '实习报告提交', status: 'completed', statusText: '已完成', deadline: '01月15日 24:00' }
];

module.exports = {
  // 获取通知列表
  getNotices() {
    // 实际开发中这里可以从本地缓存或接口获取
    return INITIAL_NOTICES;
  },

  // 模拟检查日期是否有事件（红点）
  checkEvent(fullDate) {
    const eventDates = ['2024-12-04', '2024-12-08', '2025-01-15'];
    return eventDates.includes(fullDate);
  },

  // 格式化日期对象为 YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 获取周日历数据
  getWeekDays(now) {
    const dayLabels = ['一', '二', '三', '四', '五', '六', '日'];
    let currentDay = now.getDay(); 
    let offset = currentDay === 0 ? 6 : currentDay - 1;
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - offset);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const fullDate = this.formatDate(date);
      
      weekDays.push({
        label: dayLabels[i],
        day: date.getDate().toString(),
        fullDate: fullDate,
        hasEvent: this.checkEvent(fullDate)
      });
    }
    return weekDays;
  }
};