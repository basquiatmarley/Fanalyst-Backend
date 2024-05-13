<template>
  <!--begin::Timeline-->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Event List</h3>
      <div class="card-toolbar">
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
        :current-page="params.offset + 1"
        :items-per-page="params.limit"
        :sort-label="coloumDefaultLabel"
        :sort-order="coloumDefaultSort"
        @page-change="changePage"
        @on-items-per-page-change="changeRowsPerPageLimit"
        @on-sort="handleSort"
      >
        <template v-slot:action="{ row: data }">
          <router-link
            class="btn btn-icon btn-sm me-2 btn-light"
            :to="{ name: 'events-view', params: { id: data.id } }"
          >
            <KTIcon icon-name="eye" icon-class=" text-info fs-2" />
          </router-link>
        </template>
        <template v-slot:commenceTime="{ row: data }">
          {{ getLocaleFormatted(data.commenceTime) }}
        </template>
        <template v-slot:event="{ row: data }">
          {{ data.homeClub.name }} VS {{ data.awayClub.name }}
        </template>
        <template v-slot:winner="{ row: data }">
          <div class="">
            <span v-if="data.winner === 2" :class="`badge badge-light-success`">
              AWAY
            </span>
            <span
              v-else-if="data.winner === 1"
              :class="`badge badge-light-info`"
            >
              HOME
            </span>
            <span
              v-else-if="data.winner === 3"
              :class="`badge badge-light-warning`"
            >
              TIE
            </span>
            <span v-else :class="`badge badge-light-danger`"> UPCOMING </span>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
  <!--end::Timeline-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import  {getLocaleFormatted}  from "@/core/helpers/date_utils";
import ApiService from "@/core/services/ApiService";
import DataTablesService from "@/core/services/DataTablesSevice";

export default defineComponent({
  name: "events-list",
  components: {
    Datatable,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "#",
        columnLabel: "action",
        columnWidth: 100,
      },
      {
        columnName: "Commence Time",
        columnLabel: "commenceTime",
        columnWidth: 200,
        sortEnabled: true,
      },
      {
        columnName: "Event",
        columnLabel: "event",
        columnWidth: 300,
        // sortEnabled: true,
      },
      {
        columnName: "Winner",
        columnLabel: "winner",
        columnWidth: 100,
        sortEnabled: true,
      },
    ]);

    const loading = ref(true);
    const searchQuery = ref(DataTablesService.loadSearchValue());
    const tableData = ref([]);
    const countData = ref<number>(0);
    const params = ref(DataTablesService.loadParamsFromStorage() || { offset: 0, limit: 10, where: {}, order: {},include: ["sportsGroup","sport","homeClub","awayClub" ], });
    const reverseColumn = DataTablesService.reverseSort(params.value.order);
    const coloumDefaultLabel = ref();
    const coloumDefaultSort = ref();
    if(reverseColumn != null){
      coloumDefaultLabel.value = reverseColumn[0];
      coloumDefaultSort.value = reverseColumn[1];
    }
    const urlPagination = "/events/pagination";
    const fetchData = async () => {
      loading.value = true;
      const { data, params: updatedParams } = await DataTablesService.fetchDatax(urlPagination, params.value);
      tableData.value = data.records;
      countData.value = data.totalCount;
      params.value = updatedParams; // Update params in the component
      DataTablesService.saveParamsToStorage(updatedParams,searchQuery.value); 
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
      var paramsQuery = {};
      if(searchQuery.value.trim() != ''){
        paramsQuery = {
          or: [
          { "$sportsGroup.title$": { like: `%${searchQuery.value}%` } },
          { "$sport.title$": { like: `%${searchQuery.value}%` } },
          { "$homeClub.name$": { like: `%${searchQuery.value}%` } },
          { "$awayClub.name$": { like: `%${searchQuery.value}%` } },
            ],
        };
      }
      await DataTablesService.filterData(params.value, paramsQuery, fetchData);
    };



    onMounted(() => {
      fetchData();
    });

    watch(searchQuery, filterData);

    return {
      coloumDefaultLabel,
      coloumDefaultSort,
      params,
      changePage,
      changeRowsPerPageLimit,
      countData,
      loading,
      tableHeader,
      tableData,
      searchQuery,
      handleSort,
      getLocaleFormatted,
    };
  },
});
</script>
