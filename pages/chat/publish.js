Page({
  STORAGE_KEY: 'CHAT_POSTS_V1',
  CURRENT_USER: {
    name: '我',
    avatar: '/images/avator/avator_boy.png'
  },

  data: {
    courseOptions: ['木工创意', '钳工工艺', '激光切割', '3D打印', '数控车削', '陶艺制作'],
    courseIndex: 0,
    title: '',
    content: '',
    submitting: false
  },

  onCourseChange(e) {
    this.setData({ courseIndex: Number(e.detail.value) });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  cancel() {
    wx.navigateBack();
  },

  submit() {
    if (this.data.submitting) return;

    const title = (this.data.title || '').trim();
    const content = (this.data.content || '').trim();
    if (!title) {
      wx.showToast({ title: '请填写标题', icon: 'none' });
      return;
    }
    if (!content) {
      wx.showToast({ title: '请填写内容', icon: 'none' });
      return;
    }

    const course = this.data.courseOptions[this.data.courseIndex];
    const now = Date.now();
    const post = {
      id: `p_${now}_${Math.random().toString(16).slice(2)}`,
      course,
      title,
      content,
      authorName: this.CURRENT_USER.name,
      authorAvatar: this.CURRENT_USER.avatar,
      createdAt: now,
      likeCount: 0,
      commentCount: 0,
      likedByMe: false,
      comments: []
    };

    this.setData({ submitting: true });
    const posts = this.getPostsFromStorage();
    posts.unshift(post);
    this.savePostsToStorage(posts);

    wx.showToast({ title: '发布成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 350);
  },

  getPostsFromStorage() {
    try {
      const posts = wx.getStorageSync(this.STORAGE_KEY);
      return Array.isArray(posts) ? posts : [];
    } catch (e) {
      return [];
    }
  },

  savePostsToStorage(posts) {
    wx.setStorageSync(this.STORAGE_KEY, posts);
  }
});

