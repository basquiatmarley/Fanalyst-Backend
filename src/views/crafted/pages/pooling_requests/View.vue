<template>
  <div>
    <div v-if="record.id == undefined">
      <p>Loading data details...</p>
      <div class="spinner"></div>
    </div>

    <!--begin::Navbar-->
    <div v-else class="card mb-5 mb-xxl-8">
      <div class="card-header">
        <h3 class="card-title">Pooling Reqeust View</h3>
        <div class="card-toolbar">
          <router-link
            class="btn btn-sm btn-success me-3"
            :to="{ name: 'pooling-requests-list' }"
          >
            <span>Back</span>
          </router-link>
        </div>
      </div>
      <div class="card-body pt-9 pb-0">
        <div class="table-responsive">
          <table class="table align-top gs-0 gy-3">
              <thead>
                  <tr>
                      <th class="p-0 w-200px"></th>
                      <th class="p-0 min-w-150px"></th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>
                        <span class="text-gray-900 fw-bold d-block fs-7">Url Request</span>
                        <span class="text-muted fw-semibold d-block w-200px">{{ record.urlRequest}}</span>
                      </td>
                      <td>
                        <span class="text-gray-900 fw-bold d-block fs-7">Type</span>
                        <span class="text-muted fw-semibold d-block  w-200 mb-5">{{ record.type}}</span>

                        <span class="text-gray-900 fw-bold d-block fs-7">Created</span>
                        <span class="text-muted fw-semibold d-block  w-200">{{ record.createdAt}}</span>
                      </td>
                      </tr>
                      <tr>
                      <td colspan="2">
                        <span class="text-gray-900 fw-bold d-block fs-7">Response</span>
                        <ul class="p-0 ">
                          <li v-for="item in listItems" :key="item">
                            <span class="text-muted fw-semibold d-block">{{ item }}</span></li>
                        </ul>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getApiUrl } from "@/core/helpers/assets";
import ApiService from "@/core/services/ApiService";
import { computed, defineComponent, onMounted, ref } from "vue";
import  {getLocaleFormatted}  from "@/core/helpers/date_utils";
import { useRoute } from "vue-router";
import type { PoolingRequest } from "@/core/model/PoolingRequest";
const getData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query(`pooling-requests/${id}`, {
      params: {
        
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "pooling-requests-view",
  components: {},
  setup() {
    const route = useRoute(); // Access route to get parameters
    const recorId = route.params.id; // Get 'id' from the route
    const record = ref<PoolingRequest>({} as PoolingRequest);
    const fetchData = async () => {
      const data = await getData(recorId);
      record.value = data;
    };

    const listItems = computed(() => {
      const responseText = record.value.response || '';
      const items = responseText.split(/(\*\*+)/);
      const parsedItems = items.filter(item => item.trim() !== "" && item !== "**").map(item => item.trim());
      return parsedItems;
    });


    onMounted(() => {
      fetchData(); // Fetch data when component is mounted
    });

    return {
      listItems,
      getLocaleFormatted,
      getApiUrl,
      record,
    };
  },
});
</script>
