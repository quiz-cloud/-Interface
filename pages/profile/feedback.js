// pages/profile/feedback.js
Page({
  data: {
    feedbackTypes: [
      { id: 'bug', name: '功能异常', icon: '🐛' },
      { id: 'suggestion', name: '功能建议', icon: '💡' },
      { id: 'experience', name: '体验问题', icon: '😕' },
      { id: 'other', name: '其他', icon: '📝' }
    ],
    selectedType: 'bug',
    description: '',
    contact: '',
    images: [],
    historyList: []
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '意见反馈'
    });
    this.loadHistory();
  },

  selectType(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      selectedType: id
    });
  },

  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    });
  },

  onContactInput(e) {
    this.setData({
      contact: e.detail.value
    });
  },

  chooseImage() {
    const remainCount = 3 - this.data.images.length;
    wx.chooseImage({
      count: remainCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.images, ...res.tempFilePaths];
        this.setData({
          images: newImages
        });
      }
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({
      images: images
    });
  },

  submitFeedback() {
    const { selectedType, description, contact, images, feedbackTypes } = this.data;

    // 验证必填项
    if (!description.trim()) {
      wx.showToast({
        title: '请描述您的问题',
        icon: 'none'
      });
      return;
    }

    // 模拟提交
    wx.showLoading({
      title: '提交中...'
    });

    setTimeout(() => {
      wx.hideLoading();

      // 保存到历史记录
      const typeInfo = feedbackTypes.find(t => t.id === selectedType);
      const newFeedback = {
        id: Date.now(),
        type: selectedType,
        typeIcon: typeInfo.icon,
        typeName: typeInfo.name,
        description: description,
        contact: contact,
        images: images,
        time: this.formatTime(new Date()),
        status: 'pending',
        statusText: '处理中'
      };

      const history = wx.getStorageSync('feedbackHistory') || [];
      history.unshift(newFeedback);
      wx.setStorageSync('feedbackHistory', history);

      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });

      // 清空表单
      this.setData({
        selectedType: 'bug',
        description: '',
        contact: '',
        images: []
      });

      // 刷新历史记录
      this.loadHistory();
    }, 1000);
  },

  loadHistory() {
    const history = wx.getStorageSync('feedbackHistory') || [];
    this.setData({
      historyList: history
    });
  },

  viewHistory(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.historyList.find(h => h.id === id);
    
    let content = `类型：${item.typeName}\n\n问题描述：\n${item.description}`;
    if (item.contact) {
      content += `\n\n联系方式：${item.contact}`;
    }
    content += `\n\n提交时间：${item.time}\n状态：${item.statusText}`;

    wx.showModal({
      title: '反馈详情',
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
});

