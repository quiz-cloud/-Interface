// services/report-service.js

// 模拟初始数据
const INITIAL_REPORTS = [
  {
    id: 1,
    title: "分散项目\n中期进度报告",
    time: "2026-03-01 08:00",
    requirement: [
      "1. 请详细阐述目前项目的硬件搭建进度；",
      "2. 列出遇到的主要技术难点及解决方案；",
      "3. 附上实物照片或设计图纸；",
      "4. 格式要求：PDF格式，大小不超过20MB。"
    ],
    status: 0, // 0未提交 1待批改 2已批改
    fileName: "",
    filePath: ""
  },
  {
    id: 2,
    title: "木工创意\n设计草图方案",
    time: "2026-02-15 08:00",
    requirement: ["提交小板凳的三视图手绘稿或CAD图纸，并标注主要尺寸。"],
    status: 0,
    fileName: "",
    filePath: ""
  },
  {
    id: 3,
    title: "安全教育\n心得体会",
    time: "2026-01-10 09:00",
    requirement: ["结合线下安全教育课程，谈谈你对车间安全操作规范的理解，不少于800字。"],
    status: 0,
    fileName: "",
    filePath: ""
  }
];

const STORAGE_KEY = 'user_reports_data';

module.exports = {
  // 获取所有报告列表
  getReports() {
    return wx.getStorageSync(STORAGE_KEY) || INITIAL_REPORTS; 
  },

  // 更新单个报告状态及文件信息
  updateReport(index, fileInfo) {
    let reports = this.getReports();
    if (reports[index]) {
      reports[index] = {
        ...reports[index],
        fileName: fileInfo.name,
        filePath: fileInfo.path,
        status: 1 // 设置为待批改
      };
      wx.setStorageSync(STORAGE_KEY, reports);
      return reports;
    }
    return null;
  },

  // 获取文件后缀名逻辑抽离
  getFileType(fileName) {
    return fileName.split('.').pop().toLowerCase();
  }
};