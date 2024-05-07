<script setup lang="ts">
import { watchEffect } from 'vue';
import { useHomeController } from './useHomeController';
const {listContacts } = useHomeController()


watchEffect(() => listContacts())

</script>

<template>
  <h1>home</h1>

</template>

