// pages/leave/leave.js
Page({
  data: {
    types: ["普通请假", "请假并补课"],
    typeIndex: 0,
    date: "2024-01-01",
  },

  onLoad(options) {
    // 初始化日期为当天
    const today = new Date();
    const formatDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.setData({ date: formatDate });
  },

  onTypeChange(e) {
    this.setData({
      typeIndex: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  submitApplication(e) {
    const formData = e.detail.value;
    console.log("提交的表单数据：", formData);

    if (!formData.reason) {
      wx.showToast({
        title: '请填写请假理由',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '正在提交...' });

    // 模拟提交
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '申请已提交',
        icon: 'success',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }, 1000);
  },

  viewHistory() {
    wx.showToast({
      title: '历史申请功能待接入',
      icon: 'none'
    });
  }
});
