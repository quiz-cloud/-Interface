// pages/profile/profile.js
Page({
  data: {
    // 模拟的用户信息
    user: {
      nickname: "创新实践者",
      studentId: "20240017",
      avatar: "/images/avatar-placeholder.png" // 建议在/images目录下放置一张占位图
    }
  },

  onLoad(options) {
    // 页面加载时可以从全局或缓存中获取真实用户信息
    // wx.getStorage({ key: 'userInfo' }).then(res => this.setData({ user: res.data }));
  },

  /**
   * 处理操作列表点击事件
   */
  handleAction(e) {
    const action = e.currentTarget.dataset.action;
    const titleMap = {
      help: "帮助中心",
      feedback: "意见反馈",
      about: "关于我们"
    };
    wx.showToast({
      title: `${titleMap[action] || '该功能'}待接入`,
      icon: 'none'
    });
  },

  onShow() {
    // 设置tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4 // 个人中心在tabBar中的索引
      });
    }
  }
});