Page({
  data: {
    currentIndex: 0,
    courses: [
      { name: '木工创意', short: '木工', description: '通过手工与电动工具的结合，完成创意木制品的设计与制作，培养动手能力与结构设计能力。' },
      { name: '钳工工艺', short: '钳工', description: '学习锉削、锯割、钻孔、攻丝等基础钳工操作，理解尺寸公差与装配工艺。' },
      { name: '激光切割', short: '激光', description: '掌握激光切割设备的基本操作与安全规范，完成平面构件的精确切割与拼装。' },
      { name: '3D打印', short: '3D', description: '从三维建模到打印成型，体验增材制造全过程，了解不同打印材料与成型原理。' },
      { name: '数控车削', short: '数控', description: '认识数控机床结构与坐标系，学习编制简单数控程序并完成典型零件加工。' },
      { name: '陶艺制作', short: '陶艺', description: '体验泥料成型、拉坯与装饰工艺，感受工程材料与艺术表达的结合。' }
    ]
  },

  onSwiperChange(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },

  goPrev() {
    const { currentIndex } = this.data;
    if (currentIndex > 0) {
      this.setData({
        currentIndex: currentIndex - 1
      });
    }
  },

  goNext() {
    const { currentIndex, courses } = this.data;
    if (currentIndex < courses.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1
      });
    }
  }
});
