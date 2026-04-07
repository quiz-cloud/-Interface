Page({
  data: {
    typeIndex: 0,   //当前申请类型索引（0：请假申请，1：补课申请）
    types: ['请假申请', '补课申请'],   //申请类型
    tutorIndex: 0,   //当前补课课程索引
    tutorTypes: ['3D打印', '激光打印'],   //补课课程
    date: '',
    startDate: '',   //动态开始日期
    endDate: '',   //动态结束日期
    proofImages: [],   //存储请假凭证图片的临时路径
    selectedDates: [],   //当前选择的请假的日期
    formattedSelectedDates: [],   //格式化后的当前选择的请假的日期
    currentYear: 0,   //当前日历显示的年
    currentMonth: 0,   //当前日历显示的月
    daysList: [],   //当月所有日期的详情
    emptyDays: [],   //日历月初的空白格子
    todayStr: '',   //今日日期
    maxDateStr: '',   //可选日期上限
    showCalendar: false   //控制日历面包展开
  },

  onLoad() {
    // 原有日期初始化
    const now = new Date();
    const today = now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0');
    this.setData({
      date: today,
      startDate: today,
      endDate: now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + (now.getDate() + 30).toString().padStart(2, '0')
    });

    // 补课的多选日历初始化
    const year = now.getFullYear();
    const month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    const day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    const todayStr = `${year}-${month}-${day}`;

    // 未来两周截止日期
    const maxDate = new Date(now);
    maxDate.setDate(maxDate.getDate() + 14);
    const maxYear = maxDate.getFullYear();
    const maxMonth = maxDate.getMonth() + 1 < 10 ? '0' + (maxDate.getMonth() + 1) : (maxDate.getMonth() + 1);
    const maxDay = maxDate.getDate() < 10 ? '0' + maxDate.getDate() : maxDate.getDate();
    const maxDateStr = `${maxYear}-${maxMonth}-${maxDay}`;

    this.setData({
      todayStr,
      maxDateStr
    });
    this.loadCalendar(year, now.getMonth() + 1);
  },

  //切换申请类型
  onTypeChange(e) {
    this.setData({
      typeIndex: e.detail.value
    });
  },
  
  //切换补课课程
  onTutorTypeChange(e) {
    this.setData({
      tutorIndex: e.detail.value
    });
  },

  //切换补课课程
  onTutorTypeChange(e) {
    this.setData({
      tutorIndex: e.detail.value
    });
  },

  //原单日期选择器的日期变更
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  //选择请假凭证图片
  chooseImage() {
    const that = this;
    // 限制最多上传3张
    if (that.data.proofImages.length >= 3) {
      wx.showToast({
        title: '最多上传3张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseImage({
      count: 3 - that.data.proofImages.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          proofImages: that.data.proofImages.concat(tempFilePaths)
        });
      }
    });
  },

  // 删除已上传的图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const proofImages = this.data.proofImages;
    proofImages.splice(index, 1);
    this.setData({
      proofImages
    });
  },

  // 加载补课日历数据
  loadCalendar(year, month) {
    //计算当月第一天是星期几
    const firstDayWeek = new Date(year, month - 1, 1).getDay();
    this.setData({
      emptyDays: Array(firstDayWeek).fill(''),
      currentYear: year,
      currentMonth: month
    });

    //计算当月总天数
    const daysCount = new Date(year, month, 0).getDate();
    const daysList = [];
    const { todayStr, maxDateStr } = this.data;

    //遍历生成每一天详情
    for (let i = 1; i <= daysCount; i++) {
      const monthStr = month < 10 ? '0' + month : month;
      const dayStr = i < 10 ? '0' + i : i;
      const dateStr = `${year}-${monthStr}-${dayStr}`;

      const isToday = dateStr === todayStr;
      const isSelected = this.data.selectedDates.includes(dateStr);
      const isDisabled = dateStr < todayStr || dateStr > maxDateStr;

      daysList.push({
        day: i,
        dateStr,
        isToday,
        isSelected,
        isDisabled
      });
    }

    this.setData({ daysList });
  },

  //切换日历上一月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    this.loadCalendar(currentYear, currentMonth);
  },

  //切换日历下一月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    this.loadCalendar(currentYear, currentMonth);
  },

  //日历展开/隐藏
  toggleCalendar() {
    this.setData({
      showCalendar: !this.data.showCalendar
    });
  },

  //点击日期的选中/取消选中
  toggleDate(e) {
    const dateStr = e.currentTarget.dataset.date;
    const targetDay = this.data.daysList.find(item => item.dateStr === dateStr);
    if (targetDay && targetDay.isDisabled) {
      return;
    }

    let { selectedDates } = this.data;
    if (selectedDates.includes(dateStr)) {
      selectedDates = selectedDates.filter(d => d !== dateStr);
    } else {
      selectedDates.push(dateStr);
    }

    const formattedSelectedDates = [];
    for (let i = 0; i < selectedDates.length; i++) {
      const dateParts = selectedDates[i].split('-');
      formattedSelectedDates.push(`${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`);
    }

    this.setData({
      selectedDates,
      formattedSelectedDates
    }, () => {
      this.loadCalendar(this.data.currentYear, this.data.currentMonth);
    });
  },

  //删除某个日期
  removeDate(e) {
    const dateStr = e.currentTarget.dataset.date;
    const selectedDates = this.data.selectedDates.filter(d => d !== dateStr);
    const formattedSelectedDates = [];
    for (let i = 0; i < selectedDates.length; i++) {
      const dateParts = selectedDates[i].split('-');
      formattedSelectedDates.push(`${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`);
    }

    this.setData({
      selectedDates,
      formattedSelectedDates
    }, () => {
      this.loadCalendar(this.data.currentYear, this.data.currentMonth);
    });
  },

  //表单提交
  submitApplication(e) {
    const formData = e.detail.value;
    formData.proofImages = this.data.proofImages;
    formData.type = this.data.types[this.data.typeIndex];
    formData.date = this.data.date;
    formData.tutorType = this.data.tutorTypes[this.data.tutorIndex];
    formData.selectedDates = this.data.selectedDates;
    console.log("提交的表单数据：", formData);

    //根据请假/补课去进行不同校验
    if (this.data.typeIndex == 0) {
      //请假
      //是否有填写请假理由
      if (!formData.reason) {
        wx.showToast({
          title: '请填写请假理由',
          icon: 'none'
        });
        return;
      }
      //是否有添加请假凭证
      if (formData.proofImages.length === 0) {
        wx.showToast({
          title: '请上传请假凭证图片',
          icon: 'none'
        });
        return;
      }
    } else {
      //补课
      //是否有选择要补的课程
      if (!formData.tutorType) {
        wx.showToast({
          title: '请填写要补的课程',
          icon: 'none'
        });
        return;
      }

      //是否有选择补课日期
      if (formData.selectedDates.length === 0) {
        wx.showToast({
          title: '请选择补课日期',
          icon: 'none'
        });
        return;
      }
    }

    wx.showLoading({ title: '正在提交...' });

    // 模拟提交(注：具体不同提交要分具体情况)
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '申请已提交',
        icon: 'success',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }, 1000);
  },

  viewHistory() {
    wx.navigateTo({
      url: '/pages/leave-history/leave-history'
    });
  }
});