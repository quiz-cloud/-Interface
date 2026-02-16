Page({
    data: {
      countdown: 5,
      btnText: '我已阅读并同意 (5s)',
      canSubmit: false
    },
  
    onLoad() {
      this.startTimer();
    },
  
    startTimer() {
      this.timer = setInterval(() => {
        let count = this.data.countdown - 1;
        if (count <= 0) {
          this.setData({
            countdown: 0,
            btnText: '我已阅读并同意',
            canSubmit: true
          });
          clearInterval(this.timer);
        } else {
          this.setData({
            countdown: count,
            btnText: `我已阅读并同意 (${count}s)`
          });
        }
      }, 1000);
    },
  
    onUnload() {
      if (this.timer) clearInterval(this.timer);
    },
  
    onSubmit() {
      if (!this.data.canSubmit) return;
      wx.showToast({
        title: '签署成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack(); // 返回上一页
      }, 1500);
    }
  });