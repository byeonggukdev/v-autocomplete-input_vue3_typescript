<script setup lang="ts">
import { ref, useAttrs } from "vue";

const disabled = (useAttrs().disabled === 'true')? ref(true): ref(false);
const typing = ref('');

</script>

<template>
<div>
  <input type="text" v-model="typing" :disabled="disabled"/><br />
</div>
</template>

<style>
</style>
