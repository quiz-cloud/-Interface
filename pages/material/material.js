Page({
    data: {
      currentTab: 0,
      currentCategoryName: '木工创意',
      categories: [
        { id: 0, name: '木工创意' },
        { id: 1, name: '钳工工艺' },
        { id: 2, name: '激光切割' },
        { id: 3, name: '3D打印' },
        { id: 4, name: '数控车削' },
        { id: 5, name: '陶艺制作' }
      ],
      // 模拟数据，实际开发中应从后端获取
      allFiles: {
        0: [
          { type: 'PDF', name: '木工安全操作规程.pdf', size: '2.4MB', date: '2023-09-01' },
          { type: 'MP4', name: '微课：榫卯结构演示视频', size: '128MB', date: '2023-10-24' },
          { type: 'PPT', name: '木工工具使用详解课件.pptx', size: '15MB', date: '2023-09-15' }
        ],
        1: [
          { type: 'PDF', name: '钳工基础知识.pdf', size: '1.8MB', date: '2023-09-02' }
        ]
      },
      fileList: []
    },
  
    onLoad() {
      this.updateFileList(0);
    },
  
    switchTab(e) {
      const id = e.currentTarget.dataset.id;
      const category = this.data.categories.find(c => c.id === id);
      
      this.setData({
        currentTab: id,
        currentCategoryName: category.name
      });
      this.updateFileList(id);
    },
  
    updateFileList(id) {
      const list = this.data.allFiles[id] || [];
      this.setData({
        fileList: list
      });
    }
  });