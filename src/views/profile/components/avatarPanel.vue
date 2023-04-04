<template>
  <div class="account-wrapper" style="--delay: .8s">
    <div class="account-profile">
      <img :src="store.state.user.avatar" alt="">
      <div class="blob-wrap">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <div class="account-name">{{store.state.user.username}}</div>
      <div class="account-title">{{store.state.user.is_scuer?'SCUer':'OUTSIDER'}}</div>
    </div>
    <div class="account card">
      <div class="account-cash">{{store.state.user.is_superuser?'管理员':'Cuber'}}</div>
      <div class="account-income">{{store.state.user.email}}</div>
      <div class="account-iban">用户编号: {{store.state.user.id}}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {store} from "@/store";
</script>

<style>

</style>
