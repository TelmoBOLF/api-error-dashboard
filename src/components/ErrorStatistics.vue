<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Error Statistics</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="font-semibold mb-2">Lambda Offer Errors</h3>
        <div class="bg-gray-50 p-4 rounded">
          <div v-for="(count, error) in lambdaErrorCounts" :key="error" class="mb-3">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{{ error }}</span>
              <span class="text-sm font-medium text-gray-700">{{ count }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-blue-600 h-2.5 rounded-full" 
                :style="{ width: `${(count / totalLambdaOffers) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 class="font-semibold mb-2">Service Offer Errors</h3>
        <div class="bg-gray-50 p-4 rounded">
          <div v-for="(count, error) in serviceErrorCounts" :key="error" class="mb-3">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-medium text-gray-700">{{ error }}</span>
              <span class="text-sm font-medium text-gray-700">{{ count }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="bg-green-600 h-2.5 rounded-full" 
                :style="{ width: `${(count / totalServiceOffers) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-6">
      <h3 class="font-semibold mb-2">Contact Email Distribution</h3>
      <div class="bg-gray-50 p-4 rounded">
        <div v-for="contact in uniqueContacts" :key="contact" class="mb-3">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">{{ contact }}</span>
            <span class="text-sm font-medium text-gray-700">{{ contactCounts[contact] }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              class="bg-purple-600 h-2.5 rounded-full" 
              :style="{ width: `${(contactCounts[contact] / totalLambdaOffers) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorStatistics',
  props: {
    lambdaErrorCounts: {
      type: Object,
      required: true
    },
    serviceErrorCounts: {
      type: Object,
      required: true
    },
    totalLambdaOffers: {
      type: Number,
      required: true
    },
    totalServiceOffers: {
      type: Number,
      required: true
    },
    uniqueContacts: {
      type: Array,
      required: true
    },
    contactCounts: {
      type: Object,
      required: true
    }
  }
}
</script>