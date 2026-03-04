// pages/profile/about.js
Page({
  data: {
    appInfo: {
      name: '实训助手',
      version: 'v1.0.0',
      logo: '/images/icon/tech.png'
    },
    features: [
      { icon: '📅', title: '课表管理', desc: '查看课程安排和时间表' },
      { icon: '🔧', title: '设备预约', desc: '在线预约实验室设备' },
      { icon: '👥', title: '队伍管理', desc: '创建和管理项目团队' },
      { icon: '💬', title: '交流社区', desc: '分享经验和讨论问题' }
    ],
    teamMembers: [
      { role: '产品设计', name: '设计团队' },
      { role: '技术开发', name: '开发团队' },
      { role: '内容运营', name: '运营团队' }
    ],
    contactInfo: {
      email: 'support@example.com',
      wechat: 'innovation_support'
    }
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '关于我们'
    });
  },

  copyContact(e) {
    const type = e.currentTarget.dataset.type;
    const value = type === 'email' ? this.data.contactInfo.email : this.data.contactInfo.wechat;
    
    wx.setClipboardData({
      data: value,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
  },

  checkUpdate() {
    wx.showToast({
      title: '已是最新版本',
      icon: 'success'
    });
  },
});

