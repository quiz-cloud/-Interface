Page({
    data: {
        historyList: []
    },

    onLoad(options) {
        // 模拟的后端数据，根据视觉设计的规范实现
        // 状态卡片宽 680rpx, 高 160rpx 背景 #FFFFFF, 圆角 20rpx
        // 状态标签高 44rpx24rpx, #FFFFFF
        // 待审核: #5B8FF9(蓝) 已通过: #52C41A(绿) 已驳回: #FF4D4F(红)
        const mockData = [
            {
                id: 1,
                type: '请假申请',
                statusText: '待审核',
                statusClass: 'status-pending', // css class for #5B8FF9
                applyTime: '2026-03-01 10:00:00',
                reason: '因病需请假一天，已附医院证明。'
            },
            {
                id: 2,
                type: '补课申请',
                statusText: '已通过',
                statusClass: 'status-approved', // css class for #52C41A
                applyTime: '2026-02-25 14:30:00',
                tutorCourse: '3D打印 (拟补课: 2026-02-28)'
            },
            {
                id: 3,
                type: '请假申请',
                statusText: '已驳回',
                statusClass: 'status-rejected', // css class for #FF4D4F
                applyTime: '2026-02-10 09:15:00',
                reason: '事假，需回老家办理急事。'
            }
        ];

        this.setData({
            historyList: mockData
        });
    }
});
