// pages/profile/profile.js
const I18N = {
  zh: {
    profileTitle: "个人中心",
    studentId: "学号",
    help: "帮助中心",
    feedback: "意见反馈",
    about: "关于我们",
    language: "切换语言",
    changePassword: "修改密码",
    logout: "退出登录",
    login: "去登录",
    loggedOutTitle: "未登录",
    loggedOutSubtitle: "登录后查看个人信息",
    loginTip: "登录功能待接入",
    logoutConfirmTitle: "确认退出登录",
    logoutConfirmContent: "退出后将清除本地缓存信息。",
    logoutCanceled: "已取消",
    passwordTip: "功能待接入",
    comingSoon: "功能待接入",
    unknownAction: "该功能"
  },
  en: {
    profileTitle: "Profile",
    studentId: "Student ID",
    help: "Help Center",
    feedback: "Feedback",
    about: "About Us",
    language: "Language",
    changePassword: "Change Password",
    logout: "Log Out",
    login: "Sign In",
    loggedOutTitle: "Not signed in",
    loggedOutSubtitle: "Sign in to view your profile",
    loginTip: "Sign-in coming soon",
    logoutConfirmTitle: "Confirm Log Out",
    logoutConfirmContent: "Local data will be cleared after logging out.",
    logoutCanceled: "Canceled",
    passwordTip: "Coming soon",
    comingSoon: "coming soon",
    unknownAction: "This action"
  }
};

Page({
  data: {
    // 模拟的用户信息
    user: {
      nickname: "创新实践者",
      studentId: "20240017",
      avatar: "/images/avatar-placeholder.png" // 建议在/images目录下放置一张占位图
    },
    isLoggedIn: true,
    langOptions: [
      { label: "中文", value: "zh" },
      { label: "English", value: "en" }
    ],
    langIndex: 0,
    currentLang: "zh",
    t: I18N.zh
  },

  onLoad(options) {
    const savedLang = wx.getStorageSync("profileLang") || "zh";
    const index = this.data.langOptions.findIndex(item => item.value === savedLang);
    const langIndex = index >= 0 ? index : 0;
    this.applyLanguage(this.data.langOptions[langIndex].value, langIndex);
    this.syncAuthState();
  },

  applyLanguage(lang, langIndex) {
    const translation = I18N[lang] || I18N.zh;
    this.setData({
      currentLang: lang,
      langIndex,
      t: translation
    });
    wx.setStorageSync("profileLang", lang);
    wx.setNavigationBarTitle({
      title: translation.profileTitle
    });
  },

  /**
   * 处理操作列表点击事件
   */
  handleAction(e) {
    const action = e.currentTarget.dataset.action;
    const titleMap = {
      help: this.data.t.help,
      feedback: this.data.t.feedback,
      about: this.data.t.about
    };
    wx.showToast({
      title: `${titleMap[action] || this.data.t.unknownAction} ${this.data.t.comingSoon}`,
      icon: 'none'
    });
  },

  handleLanguageChange(e) {
    const langIndex = Number(e.detail.value) || 0;
    const lang = this.data.langOptions[langIndex].value;
    this.applyLanguage(lang, langIndex);
  },

  handleChangePassword() {
    wx.showToast({
      title: this.data.t.passwordTip,
      icon: "none"
    });
  },

  handleLogin() {
    wx.showToast({
      title: this.data.t.loginTip,
      icon: "none"
    });
  },

  handleLogout() {
    wx.showModal({
      title: this.data.t.logoutConfirmTitle,
      content: this.data.t.logoutConfirmContent,
      confirmColor: "#f7b400",
      success: (res) => {
        if (res.confirm) {
          const currentLang = this.data.currentLang;
          wx.clearStorageSync();
          wx.setStorageSync("profileLang", currentLang);
          wx.setStorageSync("isLoggedIn", false);
          this.setData({
            isLoggedIn: false
          });
          wx.reLaunch({
            url: "/pages/profile/profile"
          });
          return;
        }
        wx.showToast({
          title: this.data.t.logoutCanceled,
          icon: "none"
        });
      }
    });
  },

  syncAuthState() {
    const storedUser = wx.getStorageSync("userInfo");
    const logoutFlag = wx.getStorageSync("isLoggedIn");
    const isLoggedIn = logoutFlag !== false;
    if (storedUser && typeof storedUser === "object") {
      this.setData({
        user: {
          ...this.data.user,
          ...storedUser
        },
        isLoggedIn
      });
      return;
    }
    this.setData({
      isLoggedIn
    });
  },

  onShow() {
    this.syncAuthState();
    // 设置tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4 // 个人中心在tabBar中的索引
      });
    }
  }
});