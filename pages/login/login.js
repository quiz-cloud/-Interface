// pages/login/login.js
Page({
    data: {},

    handleSubmit(e) {
        const formData = e.detail.value || {};
        const studentId = (formData.studentId || "").trim();
        const password = (formData.password || "").trim();

        if (!studentId || !password) {
            wx.showToast({
                title: "请填写学号和密码",
                icon: "none"
            });
            return;
        }

        wx.showLoading({ title: "登录中..." });

        setTimeout(() => {
            wx.hideLoading();
            wx.setStorageSync("isLoggedIn", true);
            wx.setStorageSync("userInfo", {
                nickname: "创新实践者",
                studentId,
                avatar: "/images/avatar-placeholder.png"
            });
            wx.showToast({
                title: "登录成功",
                icon: "success",
                duration: 1200,
                complete: () => {
                    wx.switchTab({
                        url: "/pages/profile/profile"
                    });
                }
            });
        }, 600);
    }
});
