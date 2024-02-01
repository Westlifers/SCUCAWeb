<template>
  <div class="room_list_container">
    <h1>房间列表&nbsp;<el-button type="primary" icon="Plus" @click="dialogVisible=true">创建房间</el-button></h1>
    <div class="room_list_table">
      <el-table :data="roomList" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column prop="room_name" label="房间名">
          <template v-slot="scope">
            <router-link :to="`/pk/room/${scope.row.room_name}/${scope.row.event}`">{{scope.row.room_name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="event" label="项目"></el-table-column>
        <el-table-column prop="finished_players" label="本轮已完成">
          <template v-slot="scope">
            <span>{{scope.row.finished_players.length}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="players" label="总人数">
          <template v-slot="scope">
            <span>{{scope.row.players.length}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="round" label="轮次">
          <template v-slot="scope">
            <span>{{scope.row.round}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog title="创建房间" v-model="dialogVisible" width="30%">
    <el-form
        ref="formRef"
        :model="state.form"
        :rules="state.rules"
    >
      <el-form-item label="房间名" prop="room_name">
        <el-input v-model="state.form.room_name"></el-input>
      </el-form-item>
      <el-form-item label="项目" prop="event">
        <el-select v-model="state.form.event" placeholder="请选择">
          <el-option v-for="item in ALL_EVENTS" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit(formRef)">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {getRoomList} from "@/api/fetchData";
import type {Room} from "@/types";
import {ref} from "vue";
import type {FormInstance} from "element-plus";
import router from "@/router";
import {ALL_EVENTS} from "@/utils/constants";

const roomList: Room[] = await getRoomList();
const formRef = ref<FormInstance>()
const dialogVisible = ref(false);
const state = ref({
  form: {
    room_name: '',
    event: '',
  },
  rules: {
    room_name: [
      { required: true, message: '请输入房间名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    event: [
      { required: true, message: '请选择项目', trigger: 'change' }
    ]
  }
})

const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      await router.push(`/pk/room/${state.value.form.room_name}/${state.value.form.event}`)
    }
  })
}
</script>

<style scoped>
.room_list_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding-bottom: 32px;
  height: calc(100vh - 120px);
}
.room_list_container h1 {
  margin-top: 32px;
  margin-bottom: 32px;
}
.room_list_table {
  display: flex;
  justify-content: center;
  width: 70%;
}
</style>
