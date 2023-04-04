<template>
  <div class="activity card" style="--delay: .2s">
    <div class="title">账号档案</div>
    <div class="subtitle">{{store.state.user.description}}</div>
    <div class="activity-links">
      <div class="activity-link active">Latest Record</div>
    </div>
    <div class="destination">
      <div class="destination-card" v-for="ann in breakAnnouncements" :key="ann.title">
        <div class="destination-profile">
          <img class="profile-img" :src="profiles[ann.author].avatar" alt="">
          <div class="destination-length">
            <div>
              <span>{{getUserAndEventAndAorb(ann.content).event}}</span>
              &nbsp;
              <span>{{getUserAndEventAndAorb(ann.content).aorb}}</span>
            </div>
            <span>{{getUserAndEventAndAorb(ann.content).time}}</span>
          </div>
        </div>
        <div class="destination-points">
          <div class="point">{{profiles[ann.author].username}}</div>
          <div class="sub-point">{{profiles[ann.author].description}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {store} from "@/store";
import {Announcement} from "@/types";
import {getAnnouncement, getProfile} from "@/api/fetchData";
import {get_user_avatar, getUserAndEventAndAorb} from "@/utils";

const breakAnnouncements: Announcement[] = (await getAnnouncement('scur break')).slice(0, 2)
// get profile of the user who has a new record, so that we don't need to fetch every time
const profiles: object = {}
for (const announcement of breakAnnouncements) {
  const username = getUserAndEventAndAorb(announcement.content).user
  if (username in profiles) continue
  profiles[username] = await getProfile(username)
  profiles[username].avatar = await get_user_avatar(username)
}

</script>

<style>
.destination-length {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.destination-length > span:last-child {
  background-color: #4255d3;
  height: 24px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.destination-length > div {
  padding: 5px 0 5px 0;
}
</style>
