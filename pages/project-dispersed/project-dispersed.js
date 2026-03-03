Page({
  data: {
    projects: [
      {
        title: "智能避障小车",
        description: "基于Arduino或STM32单片机，设计并制作一辆具备自动避障、循迹功能的小车。",
        instructor: "张老师",
        duration: "4周",
        // 展开状态
        isExpanded: false,
        // 详情数据
        task: "完成车体组装，焊接电路，编写避障算法代码，并通过场地测试。",
        tech: "C语言, 电路焊接, 3D打印",
        group: "每组3-4人，需包含1名电控，1名结构。",
        greatWorks: ["/images/greatWorks/car/1.png", "/images/greatWorks/car/2.png", "/images/greatWorks/car/3.png"]
      },
      {
        title: "校园二手交易小程序",
        description: "设计一款服务于本校学生的二手物品交易平台，包含发布、搜索、聊天功能。",
        instructor: "李老师",
        duration: "4周",
        isExpanded: false,
        task: "完成小程序前端页面开发，对接云开发数据库，实现发布、搜索、聊天核心功能。",
        tech: "微信小程序, JavaScript, 云开发",
        group: "每组2-3人",
        greatWorks: ["/images/greatWorks/miniprogram/1.png", "/images/greatWorks/miniprogram/2.png", "/images/greatWorks/miniprogram/3.png"]
      },
      {
        title: "基于图像识别的垃圾分类助手",
        description: "利用机器学习模型，实现对常见生活垃圾的自动识别与分类。",
        instructor: "王老师",
        duration: "4周",
        statusClass: "status-closed",
        isExpanded: false,
        task: "通过机器学习模型，去完成对于常见生活垃圾的自动识别以及分类",
        tech: "机器学习",
        group: "每组2-3人",
        greatWorks: ["/images/greatWorks/classification/1.png", "/images/greatWorks/classification/2.png", "/images/greatWorks/classification/3.png"]
      }
    ]
  },

  // 切换项目展开/折叠状态
  toggleProject(e) {
    const index = e.currentTarget.dataset.index;
    const newProjects = [...this.data.projects];
    newProjects[index].isExpanded = !newProjects[index].isExpanded;
    this.setData({
      projects: newProjects
    });
  },

  // 预览优秀作品大图
  previewGreatWork(e) {
    const { index, workIndex } = e.currentTarget.dataset;
    const workList = this.data.projects[index].greatWorks;
    if (!workList || workList.length === 0) {
      wx.showToast({ title: "暂无作品图片", icon: "none" });
      return;
    }
    wx.showLoading({ title: "加载图片..." });
    // 转换当前点击的图片为Base64(此处若不转换会导致一直转圈)
    const targetImg = workList[workIndex];
    wx.getFileSystemManager().readFile({
      filePath: targetImg,
      encoding: 'base64',
      success: (res) => {
        const base64Url = `data:image/png;base64,${res.data}`;
        wx.previewImage({
          current: base64Url,
          urls: [base64Url],
          success: () => {
            wx.hideLoading();
          },
          fail: (err) => {
            wx.hideLoading();
            console.error("预览失败：", err);
            wx.showToast({ title: "预览失败", icon: "none" });
          }
        });
      },
      fail: (err) => {
        wx.hideLoading();
        console.error("读取图片失败：", err);
        wx.showToast({ title: "图片加载失败", icon: "none" });
      }
    });
  }
});