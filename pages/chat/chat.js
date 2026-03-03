Page({
  STORAGE_KEY: 'CHAT_POSTS_V1',
  CURRENT_USER: {
    name: '我',
    avatar: '/images/avator/avator_boy.png'
  },

  data: {
    keyword: '',
    activeTab: 'latest', // latest | hot | mine
    courseOptions: ['全部课程', '木工创意', '钳工工艺', '激光切割', '3D打印', '数控车削', '陶艺制作'],
    courseIndex: 0,

    allPosts: [],
    displayPosts: [],
    pageSize: 6,
    pageCursor: 0,
    hasMore: true,
    statusText: ''
  },

  onLoad(options) {
    this.ensureSeedData();
    this.reload(true);
  },

  onShow() {
    // 发布页返回后刷新
    this.reload(true);
  },

  onPullDownRefresh() {
    this.reload(true);
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    this.loadMore();
  },

  noop() {},

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearchConfirm() {
    this.reload(true);
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab }, () => this.reload(true));
  },

  onCourseChange(e) {
    this.setData({ courseIndex: Number(e.detail.value) }, () => this.reload(true));
  },

  goPublish() {
    wx.navigateTo({ url: '/pages/chat/publish' });
  },

  openDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/chat/detail?id=${encodeURIComponent(id)}` });
  },

  toggleLike(e) {
    const id = e.currentTarget.dataset.id;
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
    this.reload(false);
  },

  reload(resetCursor) {
    const allPosts = this.getPostsFromStorage()
      .map(p => this.decoratePost(p));

    const { keyword, activeTab, courseOptions, courseIndex } = this.data;
    const selectedCourse = courseOptions[courseIndex];

    let filtered = allPosts;

    if (activeTab === 'mine') {
      filtered = filtered.filter(p => p.authorName === this.CURRENT_USER.name);
    }

    if (selectedCourse && selectedCourse !== '全部课程') {
      filtered = filtered.filter(p => p.course === selectedCourse);
    }

    const k = (keyword || '').trim().toLowerCase();
    if (k) {
      filtered = filtered.filter(p => {
        const hay = `${p.title || ''}\n${p.content || ''}`.toLowerCase();
        return hay.includes(k);
      });
    }

    if (activeTab === 'hot') {
      filtered = [...filtered].sort((a, b) => (b.hotScore - a.hotScore) || (b.createdAt - a.createdAt));
    } else {
      filtered = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    }

    const pageCursor = resetCursor ? 0 : this.data.pageCursor;
    const pageSize = this.data.pageSize;
    const nextSlice = filtered.slice(0, (pageCursor + 1) * pageSize);
    const hasMore = nextSlice.length < filtered.length;

    this.setData({
      allPosts: filtered,
      displayPosts: nextSlice,
      pageCursor,
      hasMore,
      statusText: `${filtered.length} 条内容`
    });
  },

  loadMore() {
    if (!this.data.hasMore) return;
    const nextCursor = this.data.pageCursor + 1;
    const pageSize = this.data.pageSize;
    const nextSlice = this.data.allPosts.slice(0, (nextCursor + 1) * pageSize);
    const hasMore = nextSlice.length < this.data.allPosts.length;
    this.setData({
      pageCursor: nextCursor,
      displayPosts: nextSlice,
      hasMore
    });
  },

  decoratePost(p) {
    const likeCount = Number(p.likeCount || 0);
    const commentCount = Number(p.commentCount || 0);
    const hotScore = likeCount * 2 + commentCount * 3;
    return {
      ...p,
      authorAvatar: p.authorAvatar || '/images/avator/avator_boy.png',
      timeText: this.formatTime(p.createdAt),
      likeCount,
      commentCount,
      hotScore,
      likedByMe: !!p.likedByMe
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

  ensureSeedData() {
    const existing = this.getPostsFromStorage();
    if (existing.length > 0) return;

    const now = Date.now();
    const seed = [
      {
        id: `p_${now - 300000}`,
        course: '3D打印',
        title: '3D 打印第一次参数怎么调？',
        content: '层高、填充和支撑怎么配比较稳？我打印 PLA 边缘有点翘，有没有经验分享。',
        authorName: '小明',
        authorAvatar: '/images/avator/avator_boy.png',
        createdAt: now - 300000,
        likeCount: 3,
        commentCount: 2,
        likedByMe: false,
        comments: [
          { id: `c_${now - 299000}`, authorName: '小李', content: '先把热床温度提高一点，风扇别太大。', createdAt: now - 299000 },
          { id: `c_${now - 298000}`, authorName: '小王', content: '贴一层胶棒/美纹纸会好很多。', createdAt: now - 298000 }
        ]
      },
      {
        id: `p_${now - 200000}`,
        course: '激光切割',
        title: '激光切割亚克力发黄怎么处理？',
        content: '切完边缘有点发黄和糊边，速度/功率该怎么调？',
        authorName: '小张',
        authorAvatar: '/images/avator/avator_boy.png',
        createdAt: now - 200000,
        likeCount: 5,
        commentCount: 1,
        likedByMe: false,
        comments: [{ id: `c_${now - 199000}`, authorName: '助教', content: '优先降功率、提速度，并确认保护膜是否撕掉。', createdAt: now - 199000 }]
      },
      {
        id: `p_${now - 120000}`,
        course: '钳工工艺',
        title: '锉削总是锉不平，有什么练习方法？',
        content: '感觉平面总是有高低，怎么判断受力和走向？',
        authorName: this.CURRENT_USER.name,
        authorAvatar: this.CURRENT_USER.avatar,
        createdAt: now - 120000,
        likeCount: 1,
        commentCount: 0,
        likedByMe: true,
        comments: []
      }
    ];

    this.savePostsToStorage(seed);
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
})