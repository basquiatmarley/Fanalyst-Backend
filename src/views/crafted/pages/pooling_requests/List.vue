<template>
  <!--begin::Timeline-->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Pooling Request List</h3>
      <div class="card-toolbar">
        <!-- <button type="button" class="btn btn-sm btn-light">
                  Add New
              </button> -->
      </div>
    </div>
    <div class="card-body">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control mb-4"
        placeholder="Search..."
      />
      <Datatable
        :loading="loading"
        :header="tableHeader"
        :data="tableData"
        @on-sort="handleSort"
      >
        <template v-slot:action="{ row: data }">
          <router-link
            class="btn btn-icon btn-sm me-2 btn-light"
            :to="{ name: 'pooling-requests-view', params: { id: data.id } }"
          >
            <KTIcon icon-name="eye" icon-class=" text-info fs-2" />
          </router-link>
        </template>
        <template v-slot:createdAt="{ row: data }">
          {{  getLocaleFormatted(data.createdAt,'') }}
        </template>
        <template v-slot:type="{ row: data }">
          {{ data.type }}
        </template>
        <template v-slot:urlRequest="{ row: data }">
          {{ data.urlRequest }}
        </template>
      </Datatable>
    </div>
  </div>
  <!--end::Timeline-->
</template>

<script lang="ts">
import { getApiUrl } from "@/core/helpers/assets";
import  {getLocaleFormatted}  from "@/core/helpers/date_utils";
import { defineComponent, ref, onMounted, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
// Function to fetch data from the API
const getData = async (params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query("pooling-requests", {
      params: { filter: params },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "clubs-list",
  components: {
    Datatable,
  },
  setup() {
    const loading = ref(true);
    const searchQuery = ref("");
    const tableHeader = ref([
      {
        columnName: "#",
        columnLabel: "action",
        columnWidth: 100,
        sortEnabled: false,
      },
      {
        columnName: "Created At",
        columnLabel: "createdAt",
        columnWidth: 150,
        sortEnabled: true,
      },
      {
        columnName: "Type",
        columnLabel: "type",
        columnWidth: 150,
        sortEnabled: true,
      },
      {
        columnName: "Url Request",
        columnLabel: "urlRequest",
        sortEnabled: true,
      },
    ]);
    const tableData = ref([]);
    const params = ref<any>({
      where: {},
      order: {}
    });

    const fetchData = async () => {
      loading.value = true;
      tableData.value = await getData(params.value);
      loading.value = false;
    };

    const handleSort = async (s) => {
      let label = s.label;
      if (label) {
        label = label.replace(/_/g, " ");
        params.value.order = [`${label} ${s.order}`];
        await fetchData(); // Fetch data with new sort order
      }
    };

    const filteredData = async () => {
      params.value.where = {
        or: [
          { urlRequest: { like: `%${searchQuery.value}%` } },
          { type: { like: `%${searchQuery.value}%` } },
        ],
      };
      
      await fetchData(); 
    };

    watch(() => searchQuery.value, filteredData);

    onMounted(() => {
      fetchData(); // Calls `fetchData` with the default `params`
    });

    return {
      getLocaleFormatted,
      getApiUrl,
      loading,
      tableHeader,
      tableData,
      searchQuery,
      handleSort,
    };
  },
});
</script>
@/core/helpers/_DateUtils