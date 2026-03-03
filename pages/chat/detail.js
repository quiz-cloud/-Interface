Page({
  STORAGE_KEY: 'CHAT_POSTS_V1',
  CURRENT_USER: {
    name: '我',
    avatar: '/images/avator/avator_boy.png'
  },

  data: {
    id: '',
    post: null,
    commentText: ''
  },

  onLoad(options) {
    const id = options && options.id ? decodeURIComponent(options.id) : '';
    this.setData({ id }, () => this.loadPost());
  },

  onShow() {
    // 返回时保持最新数据
    this.loadPost();
  },

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  toggleLike() {
    const { id } = this.data;
    const posts = this.getPostsFromStorage();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return;

    const post = posts[idx];
    const liked = !post.likedByMe;
    posts[idx] = {
      ...post,
      likedByMe: liked,
      likeCount: Math.max(0, (post.likeCount || 0) + (liked ? 1 : -1))
    };

    this.savePostsToStorage(posts);
    this.loadPost();
  },

  submitComment() {
    const text = (this.data.commentText || '').trim();
    if (!text) return;

    const { id } = this.data;
    const posts = this.getPostsFromStorage();
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return;

    const now = Date.now();
    const post = posts[idx];
    const comments = Array.isArray(post.comments) ? post.comments : [];
    const newComment = {
      id: `c_${now}_${Math.random().toString(16).slice(2)}`,
      authorName: this.CURRENT_USER.name,
      content: text,
      createdAt: now
    };

    const updated = {
      ...post,
      comments: [...comments, newComment],
      commentCount: Number(post.commentCount || 0) + 1
    };

    posts[idx] = updated;
    this.savePostsToStorage(posts);
    this.setData({ commentText: '' });
    this.loadPost();
  },

  loadPost() {
    const { id } = this.data;
    const posts = this.getPostsFromStorage();
    const post = posts.find(p => p.id === id);
    if (!post) {
      this.setData({ post: null });
      wx.showToast({ title: '帖子不存在', icon: 'none' });
      return;
    }

    this.setData({
      post: this.decoratePost(post)
    });
  },

  decoratePost(p) {
    const createdAt = typeof p.createdAt === 'number' ? p.createdAt : Date.now();
    const comments = Array.isArray(p.comments) ? p.comments : [];
    return {
      ...p,
      authorAvatar: p.authorAvatar || '/images/avator/avator_boy.png',
      timeText: this.formatTime(createdAt),
      likeCount: Number(p.likeCount || 0),
      commentCount: Number(p.commentCount || 0),
      likedByMe: !!p.likedByMe,
      comments: comments.map(c => ({
        ...c,
        timeText: this.formatTime(c.createdAt)
      }))
    };
  },

  formatTime(ts) {
    const t = typeof ts === 'number' ? ts : Date.now();
    const d = new Date(t);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post ? post.title : '交流区',
      path: `/pages/chat/detail?id=${encodeURIComponent(this.data.id)}`
    };
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

