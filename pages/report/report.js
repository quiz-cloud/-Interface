// pages/report/report.js
const reportService = require("../../services/report"); 

Page({
  data: {
    reports: []
  },

  onLoad() {
    this.refreshReports(); 
  },

  // 刷新报告列表数据
  refreshReports() {
    const reports = reportService.getReports();
    this.setData({ reports });
  },

  // 上传或修改文件
  chooseFile(e) {
    const index = e.currentTarget.dataset.index;

    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        if (!file) return;

        // 调用 service 处理业务逻辑
        const updatedReports = reportService.updateReport(index, file); 
        
        if (updatedReports) {
          this.setData({ reports: updatedReports });
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 预览文件
  previewFile(e) {
    const index = e.currentTarget.dataset.index;
    const report = this.data.reports[index];
    
    const fileType = reportService.getFileType(report.fileName);

    wx.openDocument({
      filePath: report.filePath,
      fileType: fileType,
      success: () => console.log('文件打开成功'),
      fail: () => {
        wx.showToast({
          title: '暂不支持预览此格式',
          icon: 'none'
        });
      }
    });
  }
});