// pages/profile/change-password.js
Page({
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
    passwordStrength: '', // weak, medium, strong
    passwordStrengthText: '',
    isPasswordMatch: false
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '修改密码'
    });
  },

  onOldPasswordInput(e) {
    this.setData({
      oldPassword: e.detail.value
    });
  },

  onNewPasswordInput(e) {
    const password = e.detail.value;
    const strength = this.calculatePasswordStrength(password);
    
    this.setData({
      newPassword: password,
      passwordStrength: strength.level,
      passwordStrengthText: strength.text
    });
    
    // 同时检查密码匹配
    this.checkPasswordMatch();
  },

  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
    
    // 检查密码匹配
    this.checkPasswordMatch();
  },

  calculatePasswordStrength(password) {
    if (!password || password.length === 0) {
      return { level: '', text: '' };
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const length = password.length;

    // 弱：长度不足6位，或者不包含字母和数字
    if (length < 6 || !hasLetter || !hasNumber) {
      return { level: 'weak', text: '弱' };
    }

    // 强：长度>=10位，且包含字母和数字
    if (length >= 10) {
      return { level: 'strong', text: '强' };
    }

    // 中：长度6-9位，包含字母和数字
    return { level: 'medium', text: '中' };
  },

  checkPasswordMatch() {
    const { newPassword, confirmPassword } = this.data;
    if (confirmPassword.length > 0) {
      this.setData({
        isPasswordMatch: newPassword === confirmPassword
      });
    }
  },

  togglePasswordVisibility(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: !this.data[field]
    });
  },

  validatePassword(password) {
    // 密码长度至少6位
    if (password.length < 6) {
      return { valid: false, message: '密码长度至少6位' };
    }
    
    // 密码长度不超过20位
    if (password.length > 20) {
      return { valid: false, message: '密码长度不超过20位' };
    }
    
    // 密码必须包含字母和数字
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasLetter || !hasNumber) {
      return { valid: false, message: '密码必须包含字母和数字' };
    }
    
    return { valid: true };
  },

  submitPassword() {
    const { oldPassword, newPassword, confirmPassword } = this.data;

    // 验证旧密码
    if (!oldPassword.trim()) {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none'
      });
      return;
    }

    // 验证新密码
    if (!newPassword.trim()) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
      return;
    }

    // 验证新密码格式
    const validation = this.validatePassword(newPassword);
    if (!validation.valid) {
      wx.showToast({
        title: validation.message,
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 验证确认密码
    if (!confirmPassword.trim()) {
      wx.showToast({
        title: '请确认新密码',
        icon: 'none'
      });
      return;
    }

    // 检查新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      });
      return;
    }

    // 检查新密码是否与旧密码相同
    if (oldPassword === newPassword) {
      wx.showToast({
        title: '新密码不能与原密码相同',
        icon: 'none'
      });
      return;
    }

    // 模拟验证旧密码（实际应该调用后端API）
    wx.showLoading({
      title: '修改中...',
      mask: true
    });

    setTimeout(() => {
      wx.hideLoading();

      // 模拟修改成功
      wx.showModal({
        title: '修改成功',
        content: '密码已修改，请使用新密码重新登录',
        showCancel: false,
        confirmText: '确定',
        success: (res) => {
          if (res.confirm) {
            // 清除登录状态
            wx.setStorageSync('isLoggedIn', false);
            
            // 返回个人中心
            wx.navigateBack({
              success: () => {
                // 延迟跳转到登录页
                setTimeout(() => {
                  wx.navigateTo({
                    url: '/pages/login/login'
                  });
                }, 500);
              }
            });
          }
        }
      });
    }, 1500);
  },

  resetForm() {
    wx.showModal({
      title: '确认重置',
      content: '确定要清空所有输入内容吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            showOldPassword: false,
            showNewPassword: false,
            showConfirmPassword: false
          });
          wx.showToast({
            title: '已重置',
            icon: 'success'
          });
        }
      }
    });
  }
});

