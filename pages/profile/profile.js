// pages/profile/profile.js
Page({
  data: {
    // 模拟的用户信息
    user: {
      nickname: "创新实践者",
      studentId: "20240017",
      avatar: "/images/avatar-placeholder.png" // 建议在/images目录下放置一张占位图
    },
    currentLang: wx.getStorage('language') === 'en' ? 'English' : '简体中文'
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
    /*
      此处修改了下面注释部分
    */
    // const titleMap = {
    //   help: "帮助中心",
    //   feedback: "意见反馈",
    //   about: "关于我们"
    // };
    // wx.showToast({
    //   title: `${titleMap[action] || '该功能'}待接入`,
    //   icon: 'none'
    // });
    switch (action) {
      case "help":
        wx.showToast({
          title: '帮助中心待接入',
        })
        break;
      case "feedback":
        wx.showToast({
          title: '意见反馈待接入',
        })
        break;
      case "about":
        wx.showToast({
          title: '关于我们待接入',
        })
        break;
      case "changePwd":
        wx.showToast({
          title: '修改密码待接入',
        })
        break;
      case "changeLang":
        wx.showActionSheet({
          itemList: ['简体中文', 'English'],
          success: (res) => {
            const lang = res.tapIndex === 0 ? 'zh-CN' : 'en';
            const langText = res.tapIndex === 0 ? '简体中文' : 'English';
            // 存缓存 + 更新页面显示
            wx.setStorageSync('language', lang);
            this.setData({
              currentLang: langText // 关键：更新当前语言显示
            });
            wx.showToast({
              title: `已切换为${langText}`,
              icon: 'success'
            });
          }
        });
        break;
      case "logout":
        wx.showModal({
          title: "退出登录待接入",
        });
        break;
      default:
        break;
    }
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