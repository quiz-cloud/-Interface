// pages/project-dispersed/project-dispersed.js
Page({
  data: {
    projects: [
      {
        title: "智能家居控制系统",
        description: "设计并实现一个基于物联网的智能家居原型，可控制灯光、窗帘等设备。",
        instructor: "张老师",
        duration: "4周",
        statusClass: "status-open",
        statusText: "可选"
      },
      {
        title: "校园二手交易平台",
        description: "开发一个微信小程序，方便校内学生进行二手物品的发布和交易。",
        instructor: "李老师",
        duration: "4周",
        statusClass: "status-open",
        statusText: "可选"
      },
      {
        title: "基于图像识别的垃圾分类助手",
        description: "利用机器学习模型，实现对常见生活垃圾的自动识别与分类。",
        instructor: "王老师",
        duration: "4周",
        statusClass: "status-closed",
        statusText: "已满"
      }
    ]
  },

  onLoad(options) {

  },

  viewProject(e) {
    const index = e.currentTarget.dataset.index;
    const project = this.data.projects[index];
    wx.showToast({
      title: `查看项目“${project.title}”`,
      icon: 'none'
    });
  }
});
