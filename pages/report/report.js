Page({

  data: {
    reports: [
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
        status: 0,       // 0未提交 1待批改 2已批改
        fileName: "",
        filePath: ""
      },
      {
        id: 2,
        title: "木工创意\n设计草图方案",
        time: "2026-02-15 08:00",
        requirement: [
          "提交小板凳的三视图手绘稿或CAD图纸，并标注主要尺寸。"
        ],
        status: 0,
        fileName: "",
        filePath: ""
      },
      {
        id: 3,
        title: "安全教育\n心得体会",
        time: "2026-01-10 09:00",
        requirement: [
          "结合线下安全教育课程，谈谈你对车间安全操作规范的理解，不少于800字。"
        ],
        status: 0,
        fileName: "",
        filePath: ""
      }
    ]
  },

  // 上传或修改文件
  // report.js

// 修改上传方法
chooseFile(e) { // 建议更名为 chooseFile
  const index = e.currentTarget.dataset.index

  wx.chooseMessageFile({
    count: 1,
    type: 'file', 
    // extension: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip'], // 可选：指定支持的后缀
    // 如果完全不限制后缀，直接删掉 extension 属性即可
    success: (res) => {
      const file = res.tempFiles[0]
      let reports = this.data.reports

      reports[index].fileName = file.name
      reports[index].filePath = file.path
      reports[index].status = 1 

      this.setData({ reports })

      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
    }
  })
},

// 修改预览方法
previewFile(e) {
  const index = e.currentTarget.dataset.index
  const filePath = this.data.reports[index].filePath
  
  // 自动获取后缀名以增强兼容性
  const fileName = this.data.reports[index].fileName
  const fileType = fileName.split('.').pop().toLowerCase()

  wx.openDocument({
    filePath: filePath,
    fileType: fileType, // 传入动态的文件类型
    success: function (res) {
      console.log('文件打开成功')
    },
    fail: function (err) {
      wx.showToast({
        title: '暂不支持预览此格式',
        icon: 'none'
      })
    }
  })
}
})