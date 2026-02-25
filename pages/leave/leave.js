// pages/leave/leave.js
Page({
  data: {
    types: ["普通请假", "请假并补课"],
    typeIndex: 0,
    date: "",
  startDate: "", // 动态开始日期
  endDate: "",    // 动态结束日期
  proofImages: [] // 存储请假凭证图片的临时路径
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

  //选择请假凭证图片
  chooseImage() {
    const that = this;
    // 限制最多上传3张
    if (that.data.proofImages.length >= 3) {
      wx.showToast({
        title: '最多上传3张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseImage({
      count: 3 - that.data.proofImages.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          proofImages: that.data.proofImages.concat(tempFilePaths)
        });
      }
    });
  },

  // 删除已上传的图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const proofImages = this.data.proofImages;
    proofImages.splice(index, 1);
    this.setData({
      proofImages
    });
  },

  submitApplication(e) {
    const formData = e.detail.value;
    formData.proofImages = this.data.proofImages;
    formData.type = this.data.types[this.data.typeIndex];
    formData.date = this.data.date;
    console.log("提交的表单数据：", formData);

    if (!formData.reason) {
      wx.showToast({
        title: '请填写请假理由',
        icon: 'none'
      });
      return;
    }

    if (this.data.typeIndex === 0 && this.data.proofImages.length === 0) {
      wx.showToast({
        title: '请上传请假凭证图片',
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
