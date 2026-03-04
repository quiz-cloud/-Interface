// pages/profile/help-center.js
Page({
  data: {
    searchKeyword: '',
    activeCategory: 0,
    categories: [
      { id: 'all', name: '全部' },
      { id: 'appointment', name: '预约相关' },
      { id: 'team', name: '队伍管理' },
      { id: 'chat', name: '交流区' },
      { id: 'account', name: '账号问题' }
    ],
    allQuestions: [
      {
        id: 1,
        category: 'appointment',
        question: '如何预约设备？',
        answer: '进入"加工预约"页面，选择您需要的设备类型和时间段，填写预约信息后提交即可。预约成功后会收到通知。',
        expanded: false
      },
      {
        id: 2,
        category: 'appointment',
        question: '预约后可以取消吗？',
        answer: '可以取消。在"我的预约"中找到对应的预约记录，点击取消按钮即可。建议提前至少2小时取消，以便其他同学预约。',
        expanded: false
      },
      {
        id: 3,
        category: 'appointment',
        question: '预约时间段已满怎么办？',
        answer: '您可以选择其他时间段，或者关注该时间段是否有人取消预约。系统会在有空位时发送通知。',
        expanded: false
      },
      {
        id: 4,
        category: 'team',
        question: '如何创建队伍？',
        answer: '进入"队伍管理"页面，点击"创建队伍"按钮，填写项目名称、队伍描述等信息后提交即可创建成功。',
        expanded: false
      },
      {
        id: 5,
        category: 'team',
        question: '如何加入队伍？',
        answer: '在"可加入的队伍"列表中浏览队伍信息，找到合适的队伍后点击"申请加入"，等待队长审核通过即可。',
        expanded: false
      },
      {
        id: 6,
        category: 'team',
        question: '队长可以转让吗？',
        answer: '可以。队长在"管理队伍"页面中，选择要转让的成员，点击"转让队长"按钮即可。转让后原队长将成为普通队员。',
        expanded: false
      },
      {
        id: 7,
        category: 'chat',
        question: '如何发布帖子？',
        answer: '在交流区页面点击右下角的"+"按钮，填写帖子标题、内容，选择课程分类后发布即可。',
        expanded: false
      },
      {
        id: 8,
        category: 'chat',
        question: '可以删除自己的帖子吗？',
        answer: '可以。进入帖子详情页，点击右上角菜单，选择"删除"即可删除自己发布的帖子。',
        expanded: false
      },
      {
        id: 9,
        category: 'chat',
        question: '如何评论和点赞？',
        answer: '进入帖子详情页可以发表评论。在列表页或详情页点击"赞"按钮即可点赞，再次点击取消点赞。',
        expanded: false
      },
      {
        id: 10,
        category: 'account',
        question: '忘记密码怎么办？',
        answer: '在登录页面点击"忘记密码"，通过学号和手机验证码重置密码。如遇问题请联系管理员。',
        expanded: false
      },
      {
        id: 11,
        category: 'account',
        question: '如何修改个人信息？',
        answer: '进入"个人中心"页面，点击头像或昵称区域即可编辑个人信息，包括昵称、头像等。',
        expanded: false
      },
      {
        id: 12,
        category: 'account',
        question: '如何切换语言？',
        answer: '在"个人中心"页面的操作列表中，找到"切换语言"选项，选择您需要的语言即可。',
        expanded: false
      }
    ],
    filteredQuestions: []
  },

  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '帮助中心'
    });
    this.filterQuestions();
  },

  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    }, () => {
      this.filterQuestions();
    });
  },

  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCategory: index
    }, () => {
      this.filterQuestions();
    });
  },

  filterQuestions() {
    const { activeCategory, categories, allQuestions, searchKeyword } = this.data;
    const categoryId = categories[activeCategory].id;
    
    let filtered = allQuestions;

    // 按分类筛选
    if (categoryId !== 'all') {
      filtered = filtered.filter(q => q.category === categoryId);
    }

    // 按关键词搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(keyword) || 
        q.answer.toLowerCase().includes(keyword)
      );
    }

    this.setData({
      filteredQuestions: filtered
    });
  },

  toggleQuestion(e) {
    const id = e.currentTarget.dataset.id;
    const questions = this.data.filteredQuestions.map(q => {
      if (q.id === id) {
        return { ...q, expanded: !q.expanded };
      }
      return q;
    });

    // 同步更新 allQuestions
    const allQuestions = this.data.allQuestions.map(q => {
      if (q.id === id) {
        return { ...q, expanded: !q.expanded };
      }
      return q;
    });

    this.setData({
      filteredQuestions: questions,
      allQuestions: allQuestions
    });
  },

  goToFeedback() {
    wx.navigateTo({
      url: '/pages/profile/feedback'
    });
  }
});

