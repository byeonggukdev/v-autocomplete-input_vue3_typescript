<script setup lang="ts">
import { PropType, ref, useAttrs, watch } from "vue";

interface MyProps {
  dataItems: string
}

const props = withDefaults(defineProps<MyProps>(), {
  dataItems: () => '["test_data1", "test_data2", "test_data3"]'
})
const dataItems = ref<string[]>(JSON.parse(props.dataItems))
const candidatedItems = ref<string[]>([])

const disabled = (useAttrs().disabled === 'true')? ref(true): ref(false);
const typing = ref('')
const focus = ref<boolean>(false)

watch(typing, (typed, prevTyped) => {
  filterCandidatedItems(typed)
})

function filterCandidatedItems(typed: string) {
  const target = typed.toLowerCase()
  if (focus.value) {
    candidatedItems.value = target === ''?
      dataItems.value:
      dataItems.value.filter((item) => { return item.toLowerCase().indexOf(target) >= 0 })
  }
  else {
    candidatedItems.value = []
  }
}

function clickCandidatedItems(index: number) {
  console.log(index)
  typing.value = candidatedItems.value[index]
}

function focusIn() {
  focus.value = true
  typing.value = typing.value
}

function focusOut() {
  focus.value = false
  typing.value = typing.value
}


</script>

<template>
<div>
  <input type="text" v-model="typing" :disabled="disabled" @focusin="focusIn()" @focusout="focusOut()"/>
  <div>
    <li @click="clickCandidatedItems(index)" v-for="(item, index) in candidatedItems">{{item}}</li>
  </div>
</div>
</template>

<style>
</style>
