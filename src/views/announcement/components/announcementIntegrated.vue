<template>
  <div class="cards">
    <div v-for="(post, index) in posts" :key="post.title" class="card">
      <el-card class="box-card" shadow="hover">


        <template #header>
          <div class="card-header">
            <div class="card-header-title">
              <span>{{ post.title }}</span>
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
          <p>{{ post.content.substring(0, 30) }}</p>
        </div>


        <div class="card-footer">
          <el-button type="primary" @click="drawer[index] = true"><el-icon><MoreFilled /></el-icon></el-button>
        </div>
        <el-drawer v-model="drawer[index]">
          <v-md-preview :text="'# ' + post.title + '\n' + post.content" />
        </el-drawer>


      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {getAnnouncement} from "@/api/fetchData";
import {Ref, ref} from "vue";

const posts = await getAnnouncement('ua')
// add a list of boolean values to control the drawer
const drawer: Ref<boolean[]> = ref([])
for (let i = 0; i < posts.length; i++) {
  drawer.value.push(false)
}
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

</style>
