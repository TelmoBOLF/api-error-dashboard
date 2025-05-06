<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Service Offers Errors</h2>
    <div class="text-sm mb-2 text-gray-600">
      Showing {{ filteredOffers.length }} of {{ totalOffers }} records
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr class="bg-gray-100 text-gray-700">
            <th class="py-2 px-4 text-left">MRC Number</th>
            <th class="py-2 px-4 text-left">Error Message</th>
            <th class="py-2 px-4 text-left">Split Percentage</th>
            <th class="py-2 px-4 text-left">Available Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(offer, index) in paginatedOffers" 
            :key="index" 
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
          >
            <td class="py-2 px-4 border-t">{{ offer.MRCNumber }}</td>
            <td class="py-2 px-4 border-t text-red-600">{{ offer.errorMessage }}</td>
            <td class="py-2 px-4 border-t">{{ offer.splitPercentage || 'N/A' }}</td>
            <td class="py-2 px-4 border-t">{{ offer.availableVolume }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredOffers.length > itemsPerPage" class="mt-4 flex justify-between items-center">
        <div>
          <span class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to 
            {{ Math.min(currentPage * itemsPerPage, filteredOffers.length) }} 
            of {{ filteredOffers.length }} records
          </span>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="$emit('update:currentPage', Math.max(1, currentPage - 1))"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded"
            :class="currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-white text-blue-600 hover:bg-blue-50'"
          >
            Previous
          </button>
          <button 
            @click="$emit('update:currentPage', Math.min(totalPages, currentPage + 1))"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 border rounded"
            :class="currentPage >= totalPages ? 'bg-gray-200 text-gray-400' : 'bg-white text-blue-600 hover:bg-blue-50'"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceOffersTable',
  props: {
    filteredOffers: {
      type: Array,
      required: true
    },
    totalOffers: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  emits: ['update:currentPage'],
  computed: {
    paginatedOffers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredOffers.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredOffers.length / this.itemsPerPage)
    }
  }
}
</script>