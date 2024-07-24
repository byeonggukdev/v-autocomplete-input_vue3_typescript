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
const savedItems = ref<string[]>([])
const candidatedIndex = ref<number>(0)

const disabled = (useAttrs().disabled === 'true')? ref(true): ref(false);
const typing = ref('')
const focus = ref<boolean>(false)

let prevIndex: number = 0
let prevTyping: string = ''

watch(typing, (typed, prevTyped) => {
  console.log('begin watch')

  if (typed.length > 0) 
    filterCandidatedItems(typed)
  else
    candidatedItems.value = []

  prevTyping = prevTyped
  console.log('end watch')
})

function filterCandidatedItems(typed: string) {
  console.log('typed')
  console.log(typed)
  
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
  // filterCandidatedItems(typing.value)
}

function focusOut() {
  focus.value = false
  console.log('focusOut')
  candidatedItems.value = []
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

const processArrowLeft: processKeyboardEvent = function(e: KeyboardEvent): void {
  // && prevTyping != ''
  if (prevKey == 'ArrowRight' ) {
    const savedTyping: string = typing.value
    console.log('savedTyping')
    console.log(savedTyping)

    // console.log('length')
    // console.log(candidatedItems.value.length)
    typing.value = prevTyping
    // console.log('length')
    // console.log(candidatedItems.value.length)

    // const idx = candidatedItems.value.indexOf(savedTyping)
    // console.log('idx')
    // console.log(idx)
    // candidatedIndex.value = idx < 0 ? 0: idx

    candidatedIndex.value = prevIndex
  }
}

const processArrowRight: processKeyboardEvent = function(e: KeyboardEvent): void {
  if (prevKey != 'ArrowRight' && candidatedItems.value.length > 0) {
    prevTyping = typing.value
    typing.value = candidatedItems.value[candidatedIndex.value]
    prevIndex = candidatedIndex.value

    candidatedIndex.value = 0
  }
}

const processArrowUp: processKeyboardEvent = function(e: KeyboardEvent): void {
  candidatedIndex.value = Math.max(candidatedIndex.value -1, 0)
}

const processArrowDown: processKeyboardEvent = function(e: KeyboardEvent): void {
  candidatedIndex.value = Math.min(candidatedItems.value.length -1, candidatedIndex.value +1)
}

const processEnter: processKeyboardEvent = function(e: KeyboardEvent): void {
  const item: string = typing.value
  typing.value = ''

  if (!savedItems.value.includes(item))
    savedItems.value.push(item)

    candidatedItems.value = []
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
  console.log('begin e.key')
  console.log(e.key)

  if (ArrowsAndEnter.includes(e.key)) {
    processFunctions[e.key](e)
    prevKey = e.key
  }

  console.log('end e.key')
}

function clickToRemove(item: string) {
  console.log('begin clickToRemove')
  savedItems.value = savedItems.value.filter((v) => {return v != item} )
  console.log('end clickToRemove')
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
  <div v-for="item in savedItems">
    {{ item }}
    <button type="button" @click="clickToRemove(item)" :disabled="disabled">X</button>
  </div>
</div>
</template>

<style>
</style>
