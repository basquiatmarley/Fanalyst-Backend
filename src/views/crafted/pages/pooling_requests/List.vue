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
        :total="countData"
        @page-change="changePage"
        @on-items-per-page-change="changeRowsPerPageLimit"
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
import DataTablesService from "@/core/services/DataTablesSevice";

export default defineComponent({
  name: "pooling-requests-list",
  components: {
    Datatable,
  },
  setup() {
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
    const loading = ref(true);
    const searchQuery = ref("");
    const tableData = ref([]);
    const countData = ref<number>(0);
    const params = ref(DataTablesService.loadParamsFromStorage() || { offset: 0, limit: 10, where: {}, order: {} });
    const urlPagination = "/pooling-requests/pagination";
    const fetchData = async () => {
      loading.value = true;
      const { data, params: updatedParams } = await DataTablesService.fetchDatax(urlPagination, params.value);
      tableData.value = data.records;
      countData.value = data.totalCount;
      params.value = updatedParams; // Update params in the component
      DataTablesService.saveParamsToStorage(updatedParams); 
      loading.value = false;
    };

    const handleSort = async (sLabel) => {
      await DataTablesService.handleSort(sLabel,params.value, fetchData);
    };

    const changeRowsPerPageLimit = async (num) => {
      await DataTablesService.changeRowsPerPageLimit(num, params.value, fetchData);
    };

    const changePage = async (num) => {
      await DataTablesService.changePage(num, params.value, fetchData);
    };

    const filterData = async () => {
      const paramsQuery = {
        or: [
          { urlRequest: { like: `%${searchQuery.value}%` } },
          { type: { like: `%${searchQuery.value}%` } },
        ],
      };
      await DataTablesService.filterData(params.value, paramsQuery, fetchData);
    };

    onMounted(() => {
      fetchData();
    });

    watch(searchQuery, filterData);

    return {
      changePage,
      changeRowsPerPageLimit,
      countData,
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