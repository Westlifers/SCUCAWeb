<template>
  <div class="about-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="logo-wrapper">
          <div class="logo-circle">
            <el-icon class="cube-icon"><Grid /></el-icon>
          </div>
          <div class="logo-glow"></div>
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">四川大学魔方协会</span>
        </h1>
        <p class="hero-subtitle">SCUCAComp Competitive Platform</p>
        <div class="version-badge">
          <el-icon><Star /></el-icon>
          <span>v{{ version }}</span>
        </div>
      </div>
      
      <!-- Floating Cubes Background -->
      <div class="floating-cubes">
        <div class="cube cube-1"></div>
        <div class="cube cube-2"></div>
        <div class="cube cube-3"></div>
        <div class="cube cube-4"></div>
        <div class="cube cube-5"></div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="team-section">
      <h2 class="section-title">
        <el-icon><User /></el-icon>
        <span>开发团队</span>
      </h2>
      
      <div class="team-container">
        <!-- Authors Group (垂直排列) -->
        <div class="authors-group">
          <!-- Author -->
          <div class="author-card">
            <div class="author-badge">作者</div>
            <el-avatar :src="authorAvatar" :size="100" class="author-avatar" />
            <div class="author-glow"></div>
            <h3 class="author-name">{{ author.name }}</h3>
            <p class="author-role">{{ author.role }}</p>
            <div class="author-stars">
              <el-icon v-for="i in 5" :key="i"><Star /></el-icon>
            </div>
          </div>

          <!-- AI Assistant -->
          <div class="author-card ai-assistant-card">
            <div class="author-badge ai-badge">AI 助手</div>
            <div class="claude-avatar">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="claudeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#claudeGradient)"/>
                <text x="50" y="65" font-size="45" font-weight="bold" text-anchor="middle" fill="white">AI</text>
              </svg>
            </div>
            <div class="author-glow ai-glow"></div>
            <h3 class="author-name">{{ aiAssistant.name }}</h3>
            <p class="author-role">{{ aiAssistant.role }}</p>
            <div class="author-stars">
              <el-icon v-for="i in 5" :key="i"><Star /></el-icon>
            </div>
          </div>
        </div>

        <!-- Admins -->
        <div class="admins-group">
          <h3 class="admins-title">管理团队</h3>
          <p class="admins-subtitle">专业、高效、热爱魔方的管理团队</p>
          <div class="admins-list">
            <div class="admin-card" v-for="(admin, index) in admins" :key="index">
              <div class="admin-left">
                <el-avatar :src="adminAvatars[admin.name]" :size="60" class="admin-avatar" />
                <div class="admin-badge" :style="{ background: admin.badgeColor }">
                  <el-icon><component :is="admin.icon" /></el-icon>
                </div>
              </div>
              <div class="admin-info">
                <h4 class="admin-name">{{ admin.name }}</h4>
                <p class="admin-role">{{ admin.role }}</p>
                <div class="admin-tags">
                  <el-tag 
                    v-for="(tag, idx) in admin.tags" 
                    :key="idx" 
                    :type="tag.type"
                    size="small"
                    effect="plain"
                  >
                    {{ tag.label }}
                  </el-tag>
                </div>
                <p class="admin-desc">{{ admin.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="admin-stats">
            <div class="admin-stat">
              <el-icon class="stat-icon"><Trophy /></el-icon>
              <div class="stat-content">
                <div class="stat-value">{{ adminStats.competitions }}</div>
                <div class="stat-name">管理赛事</div>
              </div>
            </div>
            <div class="admin-stat">
              <el-icon class="stat-icon"><User /></el-icon>
              <div class="stat-content">
                <div class="stat-value">{{ adminStats.users }}</div>
                <div class="stat-name">服务用户</div>
              </div>
            </div>
            <div class="admin-stat">
              <el-icon class="stat-icon"><Timer /></el-icon>
              <div class="stat-content">
                <div class="stat-value">{{ adminStats.hours }}</div>
                <div class="stat-name">在线时长</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section">
      <h2 class="section-title">
        <el-icon><TrendCharts /></el-icon>
        <span>平台特色</span>
      </h2>
      
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon">
            <el-icon :class="feature.iconClass">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- Tech Stack Section -->
    <div class="tech-section">
      <h2 class="section-title">
        <el-icon><Monitor /></el-icon>
        <span>技术栈</span>
      </h2>
      
      <div class="tech-grid">
        <div class="tech-card" v-for="(tech, index) in techStack" :key="index">
          <div class="tech-icon" :style="{ background: tech.gradient }">
            <el-icon v-if="tech.useIcon">
              <component :is="tech.icon" />
            </el-icon>
            <svg v-else-if="tech.svg" class="custom-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path :d="tech.svg"/>
            </svg>
            <span v-else class="cubing-icon event-333oh"></span>
          </div>
          <h3 class="tech-name">{{ tech.name }}</h3>
          <p class="tech-version">{{ tech.version }}</p>
        </div>
      </div>
    </div>

    <!-- GitHub Section -->
    <div class="github-section">
      <div class="github-card">
        <div class="github-header">
          <el-icon class="github-icon"><Link /></el-icon>
          <h2>开源项目</h2>
        </div>
        <p class="github-desc">
          本项目已在 GitHub 开源，欢迎 Star、Fork 和贡献代码！
        </p>
        <el-button 
          type="primary" 
          size="large" 
          class="github-button"
          @click="openGithub"
        >
          <el-icon><Star /></el-icon>
          <span>访问 GitHub 仓库</span>
        </el-button>
        <div class="github-link">
          <el-link 
            type="primary" 
            :underline="false" 
            href="https://github.com/Westlifers/SCUCAWeb" 
            target="_blank"
          >
            https://github.com/Westlifers/SCUCAWeb
          </el-link>
        </div>
      </div>
    </div>

    <!-- Stats Section -->

    <!-- Footer -->
    <div class="about-footer">
      <p>Made with <el-icon class="heart-icon"><Star /></el-icon> by SCUCA Team</p>
      <p class="copyright">© 2024 四川大学魔方协会 All Rights Reserved</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { version } from "../../../package.json"
import { 
  Grid, Star, TrendCharts, Monitor, Link, 
  Timer, Trophy, User, ChatDotSquare, PieChart,
  ElementPlus, Histogram, Setting, Tools
} from '@element-plus/icons-vue'
import { get_user_avatar } from "@/utils"
import { ref } from 'vue'

// 作者信息
const author = {
  name: '杨荻',
  role: '项目创始人 · 核心开发者'
}

// AI 助手信息
const aiAssistant = {
  name: 'Claude',
  role: 'AI 开发辅助 · 代码优化'
}

// 管理员信息
const admins = [
  { 
    name: '李垚桦', 
    role: '平台管理员',
    icon: Setting,
    badgeColor: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    description: '负责平台日常运维与用户管理',
    tags: [
      { label: '赛事管理', type: 'primary' },
      { label: '用户服务', type: 'success' }
    ]
  },
  { 
    name: '曹骏', 
    role: '平台管理员',
    icon: Tools,
    badgeColor: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    description: '负责赛事管理与系统维护',
    tags: [
      { label: '赛事管理', type: 'primary' },
      { label: '系统维护', type: 'info' }
    ]
  }
]

// 管理团队统计
const adminStats = {
  competitions: '200+',
  users: '100+',
  hours: '24/7'
}

// 获取头像
const authorAvatar = ref('')
const adminAvatars = ref<Record<string, string>>({})

// 异步加载头像
;(async () => {
  authorAvatar.value = await get_user_avatar(author.name)
  for (const admin of admins) {
    adminAvatars.value[admin.name] = await get_user_avatar(admin.name)
  }
})()

const features = [
  {
    icon: Timer,
    iconClass: 'icon-primary',
    title: '在线比赛',
    description: '支持周赛、特殊赛等多种赛制，实时提交成绩'
  },
  {
    icon: Trophy,
    iconClass: 'icon-warning',
    title: '记录追踪',
    description: '自动记录个人最佳成绩和社团记录'
  },
  {
    icon: Histogram,
    iconClass: 'icon-primary',
    title: '排名系统',
    description: '多维度排名展示，见证你的成长'
  },
  {
    icon: User,
    iconClass: 'icon-info',
    title: '个人中心',
    description: '查看个人数据统计和历史成绩'
  },
  {
    icon: ChatDotSquare,
    iconClass: 'icon-primary',
    title: '社区互动',
    description: '实时动态推送，了解最新破纪录信息'
  },
  {
    icon: Grid,
    iconClass: 'icon-accent',
    title: '多项目支持',
    description: '支持三阶、二阶、金字塔等多种魔方项目'
  }
]

const techStack = [
  {
    name: 'Vue.js',
    version: '3.x',
    useIcon: false,
    svg: 'M356.9 64.3H280l-56 88.6-48-88.6H0L224 448 448 64.3h-91.1zm-301.2 32h53.8L224 294.5 338.4 96.3h53.8L224 384.5 55.7 96.3z',
    gradient: 'linear-gradient(135deg, #42b883, #35495e)'
  },
  {
    name: 'Element Plus',
    version: '2.x',
    useIcon: true,
    icon: ElementPlus,
    gradient: 'linear-gradient(135deg, #409eff, #53a8ff)'
  },
  {
    name: 'TypeScript',
    version: '5.x',
    useIcon: false,
    svg: 'M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 59.1-69.7 59.1z',
    gradient: 'linear-gradient(135deg, #007acc, #3178c6)'
  },
  {
    name: 'Cubing.js',
    version: 'Latest',
    useIcon: false,
    gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)'
  },
  {
    name: 'ECharts',
    version: '5.x',
    useIcon: true,
    icon: PieChart,
    gradient: 'linear-gradient(135deg, #aa46be, #d946ef)'
  },
  {
    name: 'Vite',
    version: '5.x',
    useIcon: false,
    svg: 'M0 32v448h448V32H0zm337.1 196.5c3.4 1.2 6.7 2.9 9.3 5.2 2.6 2.3 4.6 5.2 6 8.6 1.3 3.4 2 7.3 2 11.4 0 6.2-1.5 11.8-4.4 16.8-2.9 5-7 8.9-12.2 11.7-5.2 2.8-11.1 4.2-17.7 4.2h-25v-115h23.4c6.3 0 12 1.3 17 3.8 5 2.5 9 6 12 10.4 3 4.4 4.5 9.5 4.5 15.2 0 4-0.8 7.7-2.4 11.1-1.6 3.4-3.8 6.3-6.6 8.7-2.8 2.4-6 4.2-9.5 5.4 4.3 1.2 8.2 3.1 11.6 5.7zm-25.5-54.3h-16v38h16c4.7 0 8.5-1.4 11.4-4.1 2.9-2.7 4.4-6.4 4.4-11 0-4.7-1.5-8.4-4.4-11.1-2.9-2.8-6.7-4.1-11.4-4.1zm0 100.9c5.3 0 9.6-1.6 12.8-4.9 3.2-3.3 4.8-7.6 4.8-13 0-5.3-1.6-9.6-4.8-12.9-3.2-3.3-7.5-4.9-12.8-4.9h-16v35.7h16z',
    gradient: 'linear-gradient(135deg, #646cff, #747bff)'
  }
]

const openGithub = () => {
  window.open('https://github.com/Westlifers/SCUCAWeb', '_blank')
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--yougi-bg-primary) 0%, 
    var(--yougi-bg-secondary) 50%,
    var(--yougi-bg-primary) 100%);
  padding: 40px 20px;
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  position: relative;
  text-align: center;
  padding: 80px 20px;
  margin-bottom: 60px;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  animation: fadeInUp 1s ease-out;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 30px;
}

.logo-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: float 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.cube-icon {
  font-size: 80px;
  color: white;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--yougi-primary), transparent);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
  z-index: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  margin: 20px 0;
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent), var(--yougi-success));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--yougi-text-secondary);
  margin-bottom: 20px;
  font-weight: 300;
  letter-spacing: 2px;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-full);
  border: 2px solid var(--yougi-primary);
  font-size: 16px;
  font-weight: 600;
  color: var(--yougi-primary);
  box-shadow: var(--shadow-lg);
  animation: bounce 2s ease-in-out infinite;
}

/* Floating Cubes */
.floating-cubes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.cube {
  position: absolute;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  opacity: 0.1;
  border-radius: var(--radius-lg);
  animation: floatRandom 15s ease-in-out infinite;
}

.cube-1 { top: 10%; left: 10%; animation-delay: 0s; }
.cube-2 { top: 20%; right: 15%; animation-delay: 2s; }
.cube-3 { bottom: 30%; left: 20%; animation-delay: 4s; }
.cube-4 { bottom: 20%; right: 10%; animation-delay: 6s; }
.cube-5 { top: 60%; left: 50%; animation-delay: 8s; }

/* Features Section */
.features-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 50px;
  color: var(--yougi-text);
  animation: fadeIn 1s ease-out;
}

.section-title .el-icon {
  font-size: 40px;
  color: var(--yougi-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 40px 30px;
  text-align: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:nth-child(5) { animation-delay: 0.5s; }
.feature-card:nth-child(6) { animation-delay: 0.6s; }

.feature-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border-color: var(--yougi-primary);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-size: 40px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: rotateY(360deg);
}

.icon-primary { 
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-primary-light));
  color: white;
}
.icon-warning { 
  background: linear-gradient(135deg, var(--yougi-warning), #fbbf24);
  color: white;
}
.icon-success { 
  background: linear-gradient(135deg, var(--yougi-success), var(--yougi-success-light));
  color: white;
}
.icon-info { 
  background: linear-gradient(135deg, var(--yougi-info), #60a5fa);
  color: white;
}
.icon-danger { 
  background: linear-gradient(135deg, var(--yougi-danger), #f87171);
  color: white;
}
.icon-accent { 
  background: linear-gradient(135deg, var(--yougi-accent), var(--yougi-accent-light));
  color: white;
}

.feature-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--yougi-text);
}

.feature-desc {
  font-size: 15px;
  color: var(--yougi-text-secondary);
  line-height: 1.6;
}

/* Tech Stack Section */
.tech-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
}

.tech-card {
  background: var(--yougi-card-bg);
  border-radius: var(--radius-xl);
  padding: 30px 20px;
  text-align: center;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.tech-card:nth-child(1) { animation-delay: 0.1s; }
.tech-card:nth-child(2) { animation-delay: 0.2s; }
.tech-card:nth-child(3) { animation-delay: 0.3s; }
.tech-card:nth-child(4) { animation-delay: 0.4s; }
.tech-card:nth-child(5) { animation-delay: 0.5s; }
.tech-card:nth-child(6) { animation-delay: 0.6s; }

.tech-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--yougi-primary);
}

.tech-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 16px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  transition: all 0.3s ease;
}

.tech-card:hover .tech-icon {
  transform: scale(1.1) rotate(5deg);
}

.custom-svg {
  width: 36px;
  height: 36px;
  fill: white;
}

.tech-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--yougi-text);
}

.tech-version {
  font-size: 13px;
  color: var(--yougi-text-secondary);
}

/* GitHub Section */
.github-section {
  max-width: 800px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.github-card {
  background: linear-gradient(135deg, var(--yougi-card-bg), var(--yougi-bg-secondary));
  border-radius: var(--radius-2xl);
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 2px solid var(--yougi-primary);
  position: relative;
  overflow: hidden;
  animation: fadeIn 1s ease-out;
}

.github-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(var(--yougi-primary-rgb), 0.1), transparent);
  animation: shine 3s ease-in-out infinite;
}

.github-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.github-header h2 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.github-icon {
  font-size: 36px;
  color: var(--yougi-primary);
}

.github-desc {
  font-size: 16px;
  color: var(--yougi-text-secondary);
  margin-bottom: 30px;
  line-height: 1.6;
}

.github-button {
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  border: none;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.github-button:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(var(--yougi-primary-rgb), 0.4);
}

.github-link {
  font-size: 14px;
}

/* Stats Section */
.stats-section {
  max-width: 1000px;
  margin: 0 auto 60px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.stat-item {
  background: var(--yougi-card-bg);
  border-radius: var(--radius-xl);
  padding: 30px 20px;
  text-align: center;
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out;
  animation-fill-mode: both;
}

.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.2s; }
.stat-item:nth-child(3) { animation-delay: 0.3s; }
.stat-item:nth-child(4) { animation-delay: 0.4s; }

.stat-item:hover {
  border-color: var(--yougi-primary);
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.stat-number {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 16px;
  color: var(--yougi-text-secondary);
  font-weight: 500;
}

/* Team Section */
.team-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.team-container {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

/* Authors Group - 垂直排列作者和AI助手 */
.authors-group {
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 300px;
}

/* Author Card */
.author-card {
  position: relative;
  background: linear-gradient(135deg, var(--yougi-card-bg), var(--yougi-bg-secondary));
  border-radius: var(--radius-2xl);
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 3px solid var(--yougi-primary);
  min-width: 300px;
  transition: all 0.4s ease;
  animation: fadeInUp 0.8s ease-out;
  overflow: hidden;
}

.author-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(var(--yougi-primary-rgb), 0.1), transparent);
  animation: shine 3s ease-in-out infinite;
  pointer-events: none;
}

.author-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 80px rgba(var(--yougi-primary-rgb), 0.3);
}

.author-badge {
  position: absolute;
  top: 30px;
  right: 0px;
  padding: 8px 20px;
  background: linear-gradient(135deg, var(--yougi-warning), #fbbf24);
  color: white;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 700;
  box-shadow: var(--shadow-md);
  animation: pulse 2s ease-in-out infinite;
}

.author-avatar {
  position: relative;
  z-index: 2;
  border: 4px solid var(--yougi-primary);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.author-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80px);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--yougi-primary), transparent);
  opacity: 0.3;
  animation: pulse 2s ease-in-out infinite;
  pointer-events: none;
}

.author-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.author-role {
  font-size: 15px;
  color: var(--yougi-text-secondary);
  margin-bottom: 16px;
  font-weight: 500;
}

.author-stars {
  display: flex;
  justify-content: center;
  gap: 6px;
  font-size: 20px;
  color: var(--yougi-warning);
}

.author-stars .el-icon {
  animation: twinkle 1.5s ease-in-out infinite;
}

.author-stars .el-icon:nth-child(1) { animation-delay: 0s; }
.author-stars .el-icon:nth-child(2) { animation-delay: 0.2s; }
.author-stars .el-icon:nth-child(3) { animation-delay: 0.4s; }
.author-stars .el-icon:nth-child(4) { animation-delay: 0.6s; }
.author-stars .el-icon:nth-child(5) { animation-delay: 0.8s; }

/* AI Assistant Card */
.ai-assistant-card {
  border-color: #f59e0b;
}

.ai-assistant-card .author-badge {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.claude-avatar {
  position: relative;
  z-index: 2;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  border: 4px solid #f59e0b;
  border-radius: 50%;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
  animation: float 3s ease-in-out infinite;
  background: white;
}

.claude-avatar svg {
  width: 100%;
  height: 100%;
  display: block;
}

.ai-glow {
  background: radial-gradient(circle, #f59e0b, transparent);
}

.ai-badge {
  background: linear-gradient(135deg, #f59e0b, #fbbf24) !important;
}

/* Admins Group */
.admins-group {
  flex: 1;
  min-width: 450px;
  background: var(--yougi-card-bg);
  border-radius: var(--radius-2xl);
  padding: 40px;
  box-shadow: var(--shadow-lg);
  border: 2px solid var(--yougi-border);
  animation: fadeInUp 0.8s ease-out 0.2s;
  animation-fill-mode: both;
}

.admins-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-align: center;
  background: linear-gradient(135deg, var(--yougi-primary), var(--yougi-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admins-subtitle {
  text-align: center;
  font-size: 14px;
  color: var(--yougi-text-secondary);
  margin: 0 0 30px 0;
  font-style: italic;
}

.admins-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 30px;
}

.admin-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-xl);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.admin-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--yougi-primary), var(--yougi-accent));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.admin-card:hover {
  border-color: var(--yougi-primary);
  background: var(--yougi-card-bg);
  transform: translateX(5px);
  box-shadow: var(--shadow-md);
}

.admin-card:hover::before {
  transform: scaleY(1);
}

.admin-left {
  position: relative;
  flex-shrink: 0;
}

.admin-avatar {
  flex-shrink: 0;
  border: 3px solid var(--yougi-primary);
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.admin-card:hover .admin-avatar {
  transform: scale(1.1);
  border-color: var(--yougi-accent);
}

.admin-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--yougi-card-bg);
  box-shadow: var(--shadow-md);
  color: white;
  font-size: 14px;
}

.admin-info {
  flex: 1;
  min-width: 0;
}

.admin-name {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: var(--yougi-text);
}

.admin-role {
  font-size: 13px;
  color: var(--yougi-text-secondary);
  margin: 0 0 12px 0;
  font-weight: 500;
}

.admin-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.admin-desc {
  font-size: 13px;
  color: var(--yougi-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Admin Stats */
.admin-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--yougi-border);
}

.admin-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--yougi-bg-secondary);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.admin-stat:hover {
  background: var(--yougi-card-bg);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.admin-stat .stat-icon {
  font-size: 28px;
  color: var(--yougi-primary);
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.admin-stat .stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--yougi-primary);
  line-height: 1.2;
  margin-bottom: 2px;
}

.admin-stat .stat-name {
  font-size: 12px;
  color: var(--yougi-text-secondary);
  line-height: 1;
}

/* Footer */
.about-footer {
  text-align: center;
  padding: 40px 20px;
  color: var(--yougi-text-secondary);
  border-top: 1px solid var(--yougi-border);
  animation: fadeIn 1.5s ease-out;
}

.about-footer p {
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.heart-icon {
  color: var(--yougi-danger);
  animation: heartbeat 1.5s ease-in-out infinite;
}

.copyright {
  font-size: 14px;
  opacity: 0.7;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.5;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes floatRandom {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(20px, 20px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, 40px) rotate(180deg);
  }
  75% {
    transform: translate(40px, -20px) rotate(270deg);
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

/* Responsive */
@media screen and (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .logo-circle {
    width: 100px;
    height: 100px;
  }
  
  .cube-icon {
    font-size: 50px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .team-container {
    flex-direction: column;
    align-items: center;
  }

  .authors-group {
    width: 100%;
    align-items: center;
  }

  .author-card {
    min-width: 280px;
  }

  .admins-group {
    min-width: auto;
    width: 100%;
  }
}
</style>
