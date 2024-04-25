<template>
  <!--begin::Timeline-->
  <div class="card">
      <div class="card-header">
          <h3 class="card-title">Clubs List</h3>
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
        placeholder="Search by Club name" 
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
                    :to="{ name: 'clubs-view', params: { id: data.id } }"
                  >
              <KTIcon icon-name="eye" icon-class=" text-info fs-2" />
            </router-link>
          </template>
          <template v-slot:type="{ row: data }">
            {{ data.type }}
          </template>
          <template v-slot:urlRequest="{ row: data }">
            {{ data.urlRequest }}
          </template>
          <template v-slot:status="{ row: data }">
            <div class="text-center">
              <span v-if="data.status === 1" :class="`badge badge-light-success`">
                Active
              </span>
              <span v-else="data.status === 0" :class="`badge badge-light-danger`">
                Inactive
              </span>
            </div>
          </template>
        </Datatable>
      </div>
  </div>
  <!--end::Timeline-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
// Function to fetch data from the API
const getData = async (params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query("pooling-requests", { params : {filter: params }});
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "pooling-requests-list",
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
      },
      {
        columnName: "Type",
        columnLabel: "type",
        columnWidth: 100,
        sortEnabled: true,
      },
      {
        columnName: "Url Request",
        columnLabel: "urlRequest",
        columnWidth: 200,
        sortEnabled: true,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        columnWidth: 100,
        sortEnabled: true,
      },
    ]);
    const tableData = ref([]);
    const params = ref<any>({
      where: {}, 
      order:{},
      include: [
      ],
    });

    const fetchData = async () => {
      loading.value = true;
      tableData.value = await getData(params.value);
      loading.value = false;
    };

    const handleSort = async (s) => {
      let label = s.label;
      if (label) {
        label = label.replace(/\./g, " ");
        params.value.order = [`${label} ${s.order}`];
        await fetchData(); // Fetch data with new sort order
      }
    };

    const filteredData = async () => {
      params.value.where = {
        or: [
          { "name": { like: `%${searchQuery.value}%` } },
          // {"`SportsGroup`.`title`": { like: `%${searchQuery.value}%` }}
        ],
      };
      params.value.include = [
          {
            relation: "sportsGroup",
            required: true, // Ensure only results with a related sportsGroup are included
            // scope: {
            //   where: {title : 'Soccer'}
            // },
          },
        ];
      await fetchData(); // Fetch data with updated filter
    };

    watch(() => searchQuery.value,
      filteredData
    );

    onMounted(() => {
      
      fetchData(); // Calls `fetchData` with the default `params`
    });
    
    
    return {
      loading,
      tableHeader,
      tableData,
      searchQuery,
      handleSort,
    };
  },
});
</script>
