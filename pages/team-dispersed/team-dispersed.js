// pages/team-dispersed/team-dispersed.js
Page({
  data: {
    myTeam: {
      projectName: "智能家居控制系统",
      members: [
        { name: "张三", role: "队长", avatar: "/images/avatar-placeholder.png" },
        { name: "李四", role: "队员", avatar: "/images/avatar-placeholder.png" },
        { name: "王五", role: "队员", avatar: "/images/avatar-placeholder.png" }
      ]
    },
    availableTeams: [
      {
        projectName: "校园二手交易平台",
        description: "我们小组计划开发一个功能完善的二手交易小程序，目前缺少一位熟悉UI设计的同学，期待你的加入！",
        captain: "赵六",
        memberCount: 2,
        maxMembers: 4
      },
      {
        projectName: "基于图像识别的垃圾分类助手",
        description: "项目技术栈以Python和TensorFlow为主，寻找对算法和后端开发感兴趣的伙伴。",
        captain: "孙七",
        memberCount: 3,
        maxMembers: 4
      }
    ]
  },

  onLoad(options) {

  },

  manageTeam() {
    wx.showToast({ title: '管理功能待接入', icon: 'none' });
  },

  joinTeam(e) {
    const index = e.currentTarget.dataset.index;
    const team = this.data.availableTeams[index];
    wx.showToast({ title: `申请加入“${team.projectName}”`, icon: 'none' });
  }
});
