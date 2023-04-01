<template>
  <div class="announcements">
      <div class="announcement-header">
        <p>Announcements</p>
        <p>{{(new Date()).toLocaleDateString()}}</p>
      </div>

      <el-scrollbar max-height="600">
        <div class="announcement-body">
          <div v-for="(post, index) in posts" :key="post.title" class="card">
            <el-card class="box-card" shadow="hover" :style="{backgroundColor: post.type==='update'?'#e9e7fd':'#fee4cb'}">


              <template #header>
                <div class="card-header">
                  <div class="card-header-date">
                    <el-badge :value="post.type==='update'?'更新':'公告'" class="item" :type="post.type==='update'?'success':'primary'">
                      <span>{{ (new Date(Date.parse(post.date))).toLocaleDateString() }}</span>
                    </el-badge>
                    <el-button type="primary" @click="drawer[index] = true"><el-icon><MoreFilled /></el-icon></el-button>
                  </div>
                  <div class="el-header-title">
                    <p>{{ post.title }}</p>
                  </div>
                </div>
              </template>


              <div class="card-body">
                <!--     show only first 30 characters of the content     -->
                <p>{{ post.content.substring(0, 30) + '...' }}</p>
              </div>


              <el-divider />


              <div class="card-footer">
                <div class="card-header-info">
                  <div class="info-author">
                    <el-icon><UserFilled /></el-icon>&nbsp;
                    <span>{{ post.author }}</span>
                  </div>
                  <div class="info-date">
                    <el-icon><Calendar /></el-icon>&nbsp;
                    <span>{{ (new Date(Date.parse(post.date))).toLocaleDateString() }}</span>
                  </div>
                  <div class="info-time">
                    <el-icon><Clock /></el-icon>&nbsp;
                    <span>{{ (new Date(Date.parse(post.date))).toLocaleTimeString() }}</span>
                  </div>
                </div>
              </div>


              <el-drawer v-model="drawer[index]" :direction="drawerDirection" :size="drawerSize">
                <v-md-preview :text="'# ' + post.title + '\n' + post.content" />
              </el-drawer>


            </el-card>
          </div>
        </div>
      </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import {getAnnouncement} from "@/api/fetchData";
import {computed, Ref, ref} from "vue";

const posts = await getAnnouncement('ua')
// add a list of boolean values to control the drawer
const drawer: Ref<boolean[]> = ref([])
for (let i = 0; i < posts.length; i++) {
  drawer.value.push(false)
}

// check if the device is mobile, and change drawer direction and size accordingly
const isMobile = computed(() => window.innerWidth <= 600)
const drawerDirection = computed(() => isMobile.value ? 'btt' : 'rtl')
const drawerSize = computed(() => isMobile.value ? '60%' : '50%')
</script>

<style scoped>
.announcements {
  background-color: var(--yougi-projects-section);
  border-radius: 32px;
  padding: 32px 32px 0 32px;
  display: flex;
  flex-direction: column;
  flex: 2;
  height: calc(100vh - 120px);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: var(--yougi-main-color);
}

.announcement-header p {
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  opacity: 0.9;
  margin: 0;
}

.announcement-body {
  display: flex;
  flex-wrap: wrap;
}

.card {
  width: calc(100% / 3 - 16px);
  text-align: left;
  transition: 0.2s;
  padding: 8px;
}
@media screen and (max-width: 1300px) {
  .card {
    width: calc(100% / 2 - 16px)
  }
}
@media screen and (max-width: 1100px) {
  .card {
    width: calc(100% - 16px)
  }
}

.el-card {
  border-radius: 30px !important;
}

.card-header {
  color: #4A4A4A;
  opacity: 0.7;
  font-size: 14px;
  line-height: 16px;
}

.el-header-title {
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  opacity: 0.7;
  margin-bottom: 5px;
}

.card-header-info {
  display: flex;
  flex-direction: column;
}

.card-header-date {
  line-height: 2em;
  display: flex;
  justify-content: space-between;
}

.card-header-date button {
  background-color: transparent;
  border: none;
  color: var(--yougi-main-color);
}

.card-body {
  font-size: 15px;
  line-height: 24px;
  font-weight: 700;
  opacity: 0.8;
}

.card-footer {
  font-size: 14px;
  line-height: 24px;
  font-weight: 500;
  opacity: 0.5;
  margin-bottom: 5px;
}

</style>
