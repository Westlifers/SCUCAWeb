<template>
  <div class="account-wrapper" style="--delay: .8s">
    <div class="account-profile">
      <img :src="store.state.user.avatar" alt="">
      <div class="blob-wrap">
        <div class="blob"></div>
        <div class="blob"></div>
        <div class="blob"></div>
      </div>
      <div class="account-name">Mike J Morgan</div>
      <div class="account-title">Taxi Driver</div>
    </div>
    <div class="account card">
      <div class="account-cash">$ 5637.04</div>
      <div class="account-income">Total Income</div>
      <div class="account-iban">**** **** **** 3060</div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {store} from "@/store";
</script>

<style>

</style>
