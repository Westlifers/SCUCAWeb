<template>
  <div class="cards">
    <div v-for="(post, index) in posts" :key="post.title" class="card">
      <el-card class="box-card" shadow="hover">


        <template #header>
          <div class="card-header">
            <div class="card-header-title">
              <el-badge :value="post.type==='update'?'更新':'公告'" class="item" :type="post.type==='update'?'success':'primary'">
                <span>{{ post.title }}</span>
              </el-badge>
            </div>
            <div class="card-header-info">
              <el-icon><UserFilled /></el-icon>
              <span>{{ post.author }}</span>
              &nbsp;
              <el-icon><Calendar /></el-icon>
              <span>{{ (new Date(Date.parse(post.date))).toLocaleDateString() }}</span>
              &nbsp;
              <el-icon><Clock /></el-icon>
              <span>{{ (new Date(Date.parse(post.date))).toLocaleTimeString() }}</span>
            </div>
          </div>
        </template>


        <div>
          <!--     show only first 30 characters of the content     -->
          <p>{{ post.content.substring(0, 30) + '...' }}</p>
        </div>


        <div class="card-footer">
          <el-button type="primary" @click="drawer[index] = true"><el-icon><MoreFilled /></el-icon></el-button>
        </div>
        <el-drawer v-model="drawer[index]" :direction="drawerDirection" :size="drawerSize">
          <v-md-preview :text="'# ' + post.title + '\n' + post.content" />
        </el-drawer>


      </el-card>
    </div>
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
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 50px 100px 50px 100px ;
}

.card {
  width: 45%;
  margin-bottom: 50px;
  text-align: left;
}

.box-card {
  width: 100%;
  border-radius: var(--el-border-radius-small);
}

.card-header-title {
  line-height: 2em;
}

.card-footer {
  text-align: right;
}

/* for mobile devices define css differently */
@media only screen and (max-width: 600px) {
  .cards {
    margin: 50px 0 10px 5px;
  }

  .card {
    width: 100%;
  }

}

</style>
