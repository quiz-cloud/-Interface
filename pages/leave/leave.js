// pages/leave/leave.js
Page({
  data: {
    types: ["普通请假", "请假并补课"],
    typeIndex: 0,
    date: "",
    startDate: "", // 动态开始日期
    endDate: "",    // 动态结束日期
    certificateUrl: ""
  },

  onLoad(options) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formatDate = `${year}-${month}-${day}`;

    this.setData({
      date: formatDate,
      startDate: formatDate, // 限制只能从今天开始选择
      endDate: `${year + 1}-${month}-${day}` // 自动推导一年后的日期为终点
    });
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

  chooseCertificate() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const [tempFilePath] = res.tempFilePaths || [];
        if (tempFilePath) {
          this.setData({
            certificateUrl: tempFilePath
          });
        }
      }
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
