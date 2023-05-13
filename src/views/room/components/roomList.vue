<template>
  <div class="room_list_container">
    <h1>房间列表</h1>
    <div class="room_list_table">
      <el-table :data="roomList" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}">
        <el-table-column prop="room_name" label="房间名">
          <template v-slot="scope">
            <router-link to="/pk/room/{{scope.row.room_name}}/{{scope.row.event}}">{{scope.row.room_name}}</router-link>
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
</template>

<script setup lang="ts">
import {getRoomList} from "@/api/fetchData";
import {Room} from "@/types";

const roomList: Room[] = await getRoomList();
</script>

<style scoped>
.room_list_container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--yougi-projects-section);
  border-radius: 30px;
  padding-bottom: 32px;
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
