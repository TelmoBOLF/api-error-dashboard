<template>
  <div class="mb-4">
    <div class="flex border-b">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab"
        :class="activeTab === tab.value ? 'tab-active' : 'tab-inactive'"
        @click="$emit('update:activeTab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabNavigation',
  props: {
    activeTab: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true,
      validator: (tabs) => {
        return tabs.every(tab => typeof tab.label === 'string' && typeof tab.value === 'string')
      }
    }
  },
  emits: ['update:activeTab']
}
</script>