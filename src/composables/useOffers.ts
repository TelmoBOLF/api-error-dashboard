import { ref, computed, watch, Ref } from 'vue'
import { failedOffersFromLambdaFunction as shellLambdaData, TLambdaOffer } from '../data/import-offers-lambda';
import { failedOffersFromOffersService as offersServiceData, TServiceOffer } from '../data/offers-service-import-offers-for-shell';
import axios from 'axios';


export function useOffers() {
  const lambdaOffers: Ref<TLambdaOffer[]> = ref([])
  const serviceOffers: Ref<TServiceOffer[]> = ref([])
  const loading = ref(true)
  const searchTerm = ref('')
  const contactFilter = ref('all')
  const lambdaCurrentPage = ref(1)
  const serviceCurrentPage = ref(1)
  const itemsPerPage = ref(20)

  // Load data from JSON files
  const loadData = async () => {
    let val;
    try {
      val =  await axios.get('https://obw36egmhvflttun4w6rdoobgy0jcpzd.lambda-url.eu-central-1.on.aws/');
    } catch (error) {
      console.error('Error fetching cloudwatch data:', error)

    }
    try {
      
      const lambdaData = val ? val.data['/aws/lambda/shell-integration-service-staging-importOffers'] : shellLambdaData;
      const serviceData = val ? val.data['/olf/ecs/logs'] : offersServiceData;

      // Flatten lambda offers array (combining all timestamps)
      lambdaOffers.value = Object.keys(lambdaData).reduce<TLambdaOffer[]>((acc, timestamp) => {
        return [...acc, ...lambdaData[timestamp]]
      }, [])

      // Flatten service offers array (combining all timestamps)
      serviceOffers.value = Object.keys(serviceData).reduce<TServiceOffer[]>((acc, timestamp) => {
        return [...acc, ...serviceData[timestamp]]
      }, [])
      console.log('Service offers:', serviceOffers.value.length)
      console.log('Lambda offers:', lambdaOffers.value.length)
      loading.value = false
    } catch (error) {
      console.error('Error loading data:', error)
      loading.value = false
    }
  }

  // Extract unique contact emails
  const uniqueContacts = computed(() => {
    return [...new Set(lambdaOffers.value.map(item => item.contactEmail))]
  })

  // Filter lambda offers based on search term and contact filter
  const filteredLambdaOffers = computed(() => {
    return lambdaOffers.value.filter(offer => {
      const matchesSearch = 
        offer.mrcNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (offer.contactEmail && offer.contactEmail.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
        (offer.errorMessage && offer.errorMessage.toLowerCase().includes(searchTerm.value.toLowerCase()))
      
      const matchesContact = contactFilter.value === 'all' || offer.contactEmail === contactFilter.value
      
      return matchesSearch && matchesContact
    })
  })

  // Filter service offers based on search term
  const filteredServiceOffers = computed(() => {
    return serviceOffers.value.filter(offer => {
      return offer.MRCNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        (offer.errorMessage && offer.errorMessage.toLowerCase().includes(searchTerm.value.toLowerCase()))
    })
  })

  // Paginated lambda offers
  const paginatedLambdaOffers = computed(() => {
    const start = (lambdaCurrentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredLambdaOffers.value.slice(start, end)
  })

  // Paginated service offers
  const paginatedServiceOffers = computed(() => {
    const start = (serviceCurrentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredServiceOffers.value.slice(start, end)
  })

  // Count unique error types for lambda offers
  const lambdaErrorCounts = computed(() => {
    return lambdaOffers.value.reduce<Record<string, number>>((acc, offer) => {
      const error = offer.errorMessage || 'Unknown Error'
      acc[error] = (acc[error] || 0) + 1
      return acc
    }, {})
  })

  // Count unique error types for service offers
  const serviceErrorCounts = computed(() => {
    return serviceOffers.value.reduce<Record<string, number>>((acc, offer) => {
      const error = offer.errorMessage || 'Unknown Error'
      acc[error] = (acc[error] || 0) + 1
      return acc
    }, {})
  })

  // Count errors by contact
  const contactCounts = computed(() => {
    return lambdaOffers.value.reduce<Record<string, number>>((acc, offer) => {
      const contact = offer.contactEmail
      if (contact) {
        acc[contact] = (acc[contact] || 0) + 1
      }
      return acc
    }, {})
  })

  // Reset pagination when filters change
  watch(searchTerm, () => {
    lambdaCurrentPage.value = 1
    serviceCurrentPage.value = 1
  })

  watch(contactFilter, () => {
    lambdaCurrentPage.value = 1
  })

  return {
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
    paginatedLambdaOffers,
    paginatedServiceOffers,
    lambdaErrorCounts,
    serviceErrorCounts,
    contactCounts,
    loadData
  }
}