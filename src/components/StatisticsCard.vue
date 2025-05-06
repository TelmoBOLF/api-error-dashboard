<template>
  <div class="bg-white p-4 rounded shadow-md">
    <h3 class="font-semibold text-gray-700">{{ title }}</h3>
    <div :class="['text-2xl font-bold', textColorClass]">{{ value }}</div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    textColorClass: {
      type: String,
      default: 'text-blue-600'
    }
  }
}
</script>