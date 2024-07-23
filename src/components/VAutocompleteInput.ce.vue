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
const candidatedIndex = ref<number>(0)

const disabled = (useAttrs().disabled === 'true')? ref(true): ref(false);
const typing = ref('')
const focus = ref<boolean>(false)


let prevTyping: string = ''

watch(typing, (typed, prevTyped) => {
  filterCandidatedItems(typed)
  prevTyping = prevTyped
})

function filterCandidatedItems(typed: string) {
  const target = typed.toLowerCase()

  if (focus.value) {
    candidatedItems.value = target === ''?
    dataItems.value:
    dataItems.value.filter((item) => { return item.toLowerCase().indexOf(target) >= 0 })
  }
  else {
    if (target === '') {
      candidatedItems.value = []
    }
  }

  console.log('filterCandidatedItems')
}

function clickCandidatedItems(index: number) {
  console.log(index)
  typing.value = candidatedItems.value[index]
}

function focusIn() {
  focus.value = true
  // Keep the cursor at the end of input value
  typing.value = typing.value
  console.log('focusin')
  filterCandidatedItems(typing.value)
}

function focusOut() {
  focus.value = false
  console.log('focusOut')
  filterCandidatedItems(typing.value)
}

function keyRight() {
  if (candidatedItems.value.length > 0) {
    typing.value = candidatedItems.value[0]
  }

  console.log('keyRight')
}

// e.key
// ArrowLeft
// ArrowRight
// ArrowUp
// ArrowDown
// Enter

interface processKeyboardEvent {
  (e: KeyboardEvent): void
}

let prevKey: string = ''
let prevIndex: number = 0

const processArrowLeft: processKeyboardEvent = function(e: KeyboardEvent): void {
  // && prevTyping != ''
  if (prevKey == 'ArrowRight' ) {
    typing.value = prevTyping
    candidatedIndex.value = prevIndex
  }
}

const processArrowRight: processKeyboardEvent = function(e: KeyboardEvent): void {
  if (candidatedItems.value.length > 0) {
    prevTyping = typing.value
    prevIndex = candidatedIndex.value
    typing.value = candidatedItems.value[candidatedIndex.value]
  }
}

const processArrowUp: processKeyboardEvent = function(e: KeyboardEvent): void {
  candidatedIndex.value = Math.max(candidatedIndex.value -1, 0)
}

const processArrowDown: processKeyboardEvent = function(e: KeyboardEvent): void {
  candidatedIndex.value = Math.min(candidatedItems.value.length -1, candidatedIndex.value +1)
}

const processEnter: processKeyboardEvent = function(e: KeyboardEvent): void {
}


let processFunctions: any = {
  'ArrowLeft': processArrowLeft,
  'ArrowRight': processArrowRight,
  'ArrowUp': processArrowUp,
  'ArrowDown': processArrowDown,
  'Enter': processEnter
}

const ArrowsAndEnter = [ 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter' ]

function keyupKeyboardEventListener(e: KeyboardEvent) {
  console.log('e.key')
  console.log(e.key)

  if (ArrowsAndEnter.includes(e.key)) {
    prevIndex = candidatedIndex.value

    processFunctions[e.key](e)
    prevKey = e.key
  }
}
</script>

<template>
<div>
  <input type="text" v-model="typing" :disabled="disabled"
    @keyup='keyupKeyboardEventListener'
    @focusin="focusIn" @focusout="focusOut"/>
  <div>
    <li @click="clickCandidatedItems(index)" v-for="(item, index) in candidatedItems"><div v-if="index == candidatedIndex">X</div>{{item}}</li>
  </div>
</div>
</template>

<style>
</style>
