<template>
  <div class="p-6 max-w-full bg-gray-50 min-h-screen">
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="flex justify-center items-center h-40">
    <div class="text-xl font-semibold">Loading data...</div>
  </div>

  <div v-else>
    <!-- Search and Filter Controls -->
    <div class="bg-white p-4 rounded shadow-md mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <div class="flex-1">
          <input type="text" placeholder="Search by MRC number, email, or error message..."
            class="w-full p-2 border border-gray-300 rounded" v-model="searchTerm" />
        </div>

        <div v-if="activeTab === 'lambda'" class="w-full md:w-64">
          <select class="w-full p-2 border border-gray-300 rounded" v-model="contactFilter">
            <option value="all">All Contacts</option>
            <option v-for="contact in uniqueContacts" :key="contact" :value="contact">
              {{ contact }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <TabNavigation v-model:activeTab="activeTab" :tabs="[
      { label: 'Lambda Offers', value: 'lambda' },
      { label: 'Service Offers', value: 'service' },
      { label: 'Error Statistics', value: 'stats' }
    ]" />

    <!-- Tab Content -->
    <div class="bg-white p-4 rounded shadow-md">
      <!-- Lambda Offers Tab -->
      <LambdaOffersTable v-if="activeTab === 'lambda'" :filtered-offers="filteredLambdaOffers"
        :total-offers="lambdaOffers.length" v-model:current-page="lambdaCurrentPage" :items-per-page="itemsPerPage" />

      <!-- Service Offers Tab -->
      <ServiceOffersTable v-if="activeTab === 'service'" :filtered-offers="filteredServiceOffers"
        :total-offers="serviceOffers.length" v-model:current-page="serviceCurrentPage" :items-per-page="itemsPerPage" />

      <!-- Statistics Tab -->
      <ErrorStatistics v-if="activeTab === 'stats'" :lambda-error-counts="lambdaErrorCounts"
        :service-error-counts="serviceErrorCounts" :total-lambda-offers="lambdaOffers.length"
        :total-service-offers="serviceOffers.length" :unique-contacts="uniqueContacts"
        :contact-counts="contactCounts" />
    </div>
  </div>

  <div class="mb-6">
    <h1 class="text-2xl font-bold mb-2 text-blue-800">Shell Offers Error Dashboard</h1>
    <p class="mb-4 text-gray-600">
      Displaying error records from Lambda Offers and Service Offers datasets
    </p>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatisticsCard title="Lambda Offer Errors" :value="lambdaOffers.length" text-color-class="text-red-600" />
      <StatisticsCard title="Service Offer Errors" :value="serviceOffers.length" text-color-class="text-red-600" />
      <StatisticsCard title="Unique Contacts" :value="uniqueContacts.length" text-color-class="text-blue-600" />
      <StatisticsCard title="Total Errors" :value="lambdaOffers.length + serviceOffers.length"
        text-color-class="text-red-600" />
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import { useOffers } from './composables/useOffers'
import StatisticsCard from './components/StatisticsCard.vue'
import TabNavigation from './components/TabNavigation.vue'
import LambdaOffersTable from './components/LambdaOffersTable.vue'
import ServiceOffersTable from './components/ServiceOffersTable.vue'
import ErrorStatistics from './components/ErrorStatistics.vue'

export default {
  name: 'App',
  components: {
    StatisticsCard,
    TabNavigation,
    LambdaOffersTable,
    ServiceOffersTable,
    ErrorStatistics
  },
  setup() {
    const activeTab = ref('lambda')
    
    const {
      lambdaOffers,
      serviceOffers,
      loading,
      searchTerm,
      contactFilter,
      lambdaCurrentPage,
      serviceCurrentPage,
      itemsPerPage,
      uniqueContacts,
      filteredLambdaOffers,
      filteredServiceOffers,
      lambdaErrorCounts,
      serviceErrorCounts,
      contactCounts,
      loadData
    } = useOffers()
    
    onMounted(() => {
      loadData()
    })
    
    return {
      activeTab,
      lambdaOffers,
      serviceOffers,
      loading,
      searchTerm,
      contactFilter,
      lambdaCurrentPage,
      serviceCurrentPage,
      itemsPerPage,
      uniqueContacts,
      filteredLambdaOffers,
      filteredServiceOffers,
      lambdaErrorCounts,
      serviceErrorCounts,
      contactCounts
    }
  }
}
</script>