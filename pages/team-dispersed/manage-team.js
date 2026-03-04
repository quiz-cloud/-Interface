// pages/team-dispersed/manage-team.js
Page({
  data: {
    teamInfo: {
      projectName: "智能家居控制系统",
      description: "基于物联网技术开发智能家居控制系统，实现远程控制家电设备",
      createTime: "2024-03-01",
      memberCount: 3,
      maxMembers: 4,
      members: [
        {
          id: 1,
          name: "张三",
          studentId: "2021001",
          role: "队长",
          avatar: "/images/avator/avator_boy.png"
        },
        {
          id: 2,
          name: "李四",
          studentId: "2021002",
          role: "队员",
          avatar: "/images/avator/avator_boy.png"
        },
        {
          id: 3,
          name: "王五",
          studentId: "2021003",
          role: "队员",
          avatar: "/images/avator/avator_boy.png"
        }
      ]
    },
    applications: [
      {
        id: 1,
        name: "赵六",
        studentId: "2021004",
        avatar: "/images/avator/avator_boy.png",
        applyTime: "2024-03-05 14:30"
      },
      {
        id: 2,
        name: "孙七",
        studentId: "2021005",
        avatar: "/images/avator/avator_boy.png",
        applyTime: "2024-03-05 16:20"
      }
    ],
    showEditModal: false,
    editForm: {
      projectName: "",
      description: "",
      maxMembersIndex: 0
    },
    maxMembersOptions: [2, 3, 4, 5, 6]
  },

  onLoad(options) {
    // 初始化编辑表单数据
    this.setData({
      'editForm.projectName': this.data.teamInfo.projectName,
      'editForm.description': this.data.teamInfo.description,
      'editForm.maxMembersIndex': this.data.maxMembersOptions.indexOf(this.data.teamInfo.maxMembers)
    });
  },

  // 编辑队伍信息
  editTeamInfo() {
    this.setData({ showEditModal: true });
  },

  closeEditModal() {
    this.setData({ showEditModal: false });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onProjectNameInput(e) {
    this.setData({
      'editForm.projectName': e.detail.value
    });
  },

  onDescriptionInput(e) {
    this.setData({
      'editForm.description': e.detail.value
    });
  },

  onMaxMembersChange(e) {
    this.setData({
      'editForm.maxMembersIndex': e.detail.value
    });
  },

  confirmEdit() {
    const { projectName, description, maxMembersIndex } = this.data.editForm;
    const maxMembers = this.data.maxMembersOptions[maxMembersIndex];

    if (!projectName.trim()) {
      wx.showToast({
        title: '请输入项目名称',
        icon: 'none'
      });
      return;
    }

    if (!description.trim()) {
      wx.showToast({
        title: '请输入队伍描述',
        icon: 'none'
      });
      return;
    }

    // 检查最大人数是否小于当前人数
    if (maxMembers < this.data.teamInfo.memberCount) {
      wx.showToast({
        title: '最大人数不能小于当前人数',
        icon: 'none'
      });
      return;
    }

    // 更新队伍信息
    this.setData({
      'teamInfo.projectName': projectName,
      'teamInfo.description': description,
      'teamInfo.maxMembers': maxMembers,
      showEditModal: false
    });

    wx.showToast({
      title: '修改成功',
      icon: 'success'
    });
  },

  // 转让队长
  transferCaptain(e) {
    const memberId = e.currentTarget.dataset.id;
    const member = this.data.teamInfo.members.find(m => m.id === memberId);

    wx.showModal({
      title: '转让队长',
      content: `确定要将队长转让给 ${member.name} 吗？转让后您将成为普通队员。`,
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 更新成员角色
          const members = this.data.teamInfo.members.map(m => {
            if (m.role === '队长') {
              return { ...m, role: '队员' };
            }
            if (m.id === memberId) {
              return { ...m, role: '队长' };
            }
            return m;
          });

          this.setData({
            'teamInfo.members': members
          });

          wx.showToast({
            title: '转让成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 移除成员
  removeMember(e) {
    const memberId = e.currentTarget.dataset.id;
    const member = this.data.teamInfo.members.find(m => m.id === memberId);

    wx.showModal({
      title: '移除成员',
      content: `确定要将 ${member.name} 移出队伍吗？`,
      confirmText: '确定',
      cancelText: '取消',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          const members = this.data.teamInfo.members.filter(m => m.id !== memberId);
          this.setData({
            'teamInfo.members': members,
            'teamInfo.memberCount': members.length
          });

          wx.showToast({
            title: '移除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 同意申请
  approveApplication(e) {
    const appId = e.currentTarget.dataset.id;
    const application = this.data.applications.find(a => a.id === appId);

    // 检查队伍是否已满
    if (this.data.teamInfo.memberCount >= this.data.teamInfo.maxMembers) {
      wx.showToast({
        title: '队伍人数已满',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '同意申请',
      content: `确定同意 ${application.name} 加入队伍吗？`,
      confirmText: '同意',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 添加新成员
          const newMember = {
            id: Date.now(),
            name: application.name,
            studentId: application.studentId,
            role: '队员',
            avatar: application.avatar
          };

          const members = [...this.data.teamInfo.members, newMember];
          const applications = this.data.applications.filter(a => a.id !== appId);

          this.setData({
            'teamInfo.members': members,
            'teamInfo.memberCount': members.length,
            applications: applications
          });

          wx.showToast({
            title: '已同意申请',
            icon: 'success'
          });
        }
      }
    });
  },

  // 拒绝申请
  rejectApplication(e) {
    const appId = e.currentTarget.dataset.id;
    const application = this.data.applications.find(a => a.id === appId);

    wx.showModal({
      title: '拒绝申请',
      content: `确定拒绝 ${application.name} 的入队申请吗？`,
      confirmText: '拒绝',
      cancelText: '取消',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          const applications = this.data.applications.filter(a => a.id !== appId);
          this.setData({
            applications: applications
          });

          wx.showToast({
            title: '已拒绝申请',
            icon: 'success'
          });
        }
      }
    });
  },

  // 退出队伍
  quitTeam() {
    const isCaptain = this.data.teamInfo.members.some(m => m.role === '队长' && m.id === 1);

    if (isCaptain) {
      wx.showModal({
        title: '无法退出',
        content: '您是队长，请先转让队长或解散队伍',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }

    wx.showModal({
      title: '退出队伍',
      content: '确定要退出当前队伍吗？退出后需要重新申请加入。',
      confirmText: '退出',
      cancelText: '取消',
      confirmColor: '#ff9500',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已退出队伍',
            icon: 'success'
          });

          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  },

  // 解散队伍
  dissolveTeam() {
    const isCaptain = this.data.teamInfo.members.some(m => m.role === '队长' && m.id === 1);

    if (!isCaptain) {
      wx.showModal({
        title: '无权限',
        content: '只有队长才能解散队伍',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }

    wx.showModal({
      title: '解散队伍',
      content: '确定要解散队伍吗？解散后所有成员将退出队伍，此操作不可恢复！',
      confirmText: '解散',
      cancelText: '取消',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '队伍已解散',
            icon: 'success'
          });

          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  }
});


