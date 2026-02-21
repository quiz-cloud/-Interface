Page({
  data: {
    statusBarHeight: 20, // 默认状态栏高度
    currentCourse: {
      name: '木工创意',
      status: '上课中',
      morningTime: '8:50-12:00',
      afternoonTime: '14:00-17:00',
      location: 'D3-b101'
    },
    notices: [
      { id: 1, title: '查看《工程训练课前须知》', status: 'completed', deadline: null },
      { id: 2, title: '查看《集中实训分组表》', status: 'urgent', deadline: 1 },
      { id: 3, title: '分散项目组队', status: 'pending', deadline: 10 }
    ]
  },

  onLoad() {
    // 获取系统信息，计算状态栏高度
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });
  },

  // 查看全部课表
  goToSchedule() {
    wx.navigateTo({
      url: '/pages/schedule/schedule'
    });
  },

  // 打开地图
  openMap() {
    wx.openLocation({
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'D3-b101',
      address: '工程训练中心'
    });
  },

  // 课前必看
  viewPreClass() {
    wx.navigateTo({
      url: '/pages/preclass/preclass'
    });
  },

  // 签到
  signIn() {
    wx.showLoading({ title: '签到中...' });
    // 调用签到API
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '签到成功',
        icon: 'success'
      });
    }, 1000);
  },

  // 签退
  signOut() {
    wx.showModal({
      title: '确认签退',
      content: '确定要签退吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '签退成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看全部通知
  goToNotices() {
    wx.navigateTo({
      url: '/pages/notices/notices'
    });
  },

  // 功能导航
  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    const routes = {
      intro: '/pages/course/intro',
      safety: '/pages/safety/safety',
      material: '/pages/material/material',
      leave: '/pages/leave/leave',
      project: '/pages/project-dispersed/project-dispersed',
      team: '/pages/team-dispersed/team-dispersed',
      process: '/pages/process/process',
      report: '/pages/report/report'
    };
    
    wx.navigateTo({
      url: routes[page] || '/pages/index/index'
    });
  }
});