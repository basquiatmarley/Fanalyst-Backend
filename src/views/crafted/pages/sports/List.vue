<template>
  <!--begin::Timeline-->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Sports List</h3>
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
        placeholder="Search by sport name"
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
          <!-- <a href="#" class="btn btn-icon btn-sm me-2 btn-light">
              <i class="ki-duotone ki-trash-square text-danger fs-2x">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </a> -->
          <router-link
            class="btn btn-icon btn-sm me-2 btn-light"
            :to="{ name: 'sports-edit', params: { id: data.id } }"
          >
            <KTIcon icon-name="pencil" icon-class=" text-success fs-2" />
          </router-link>
          <router-link
            class="btn btn-icon btn-sm me-2 btn-light"
            :to="{ name: 'sports-view', params: { id: data.id } }"
          >
            <KTIcon icon-name="eye" icon-class=" text-info fs-2" />
          </router-link>
        </template>
        <template v-slot:imageUrl="{ row: data }">
          <img
            :src="
            getUploadAssetPath(data.imageUrl)
            "
            :class="`w-100px`"
            alt="image"
          />
        </template>
        <template v-slot:sportsGroup_title="{ row: data }">
          {{ data.sportsGroup.title }}
        </template>
        <template v-slot:title="{ row: data }">
          {{ data.title }}
        </template>
        <template v-slot:status="{ row: data }">
          <div class="text-center">
            <span v-if="data.status == 1" :class="`badge badge-light-success`">
              Active
            </span>
            <span v-else :class="`badge badge-light-danger`"> Inactive </span>
          </div>
        </template>
      </Datatable>
    </div>
  </div>
  <!--end::Timeline-->
</template>

<script lang="ts">
import { getUploadAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import DataTablesService from "@/core/services/DataTablesSevice";

export default defineComponent({
  name: "sports-list",
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
        columnName: "Image",
        columnLabel: "imageUrl",
        columnWidth: 100,
        sortEnabled: true,
      },
      {
        columnName: "Sport Group",
        columnLabel: "sportsGroup_title",
        columnWidth: 200,
        sortEnabled: true,
      },
      {
        columnName: "Title",
        columnLabel: "title",
        columnWidth: 300,
        sortEnabled: true,
      },
      {
        columnName: "Status",
        columnLabel: "status",
        columnWidth: 100,
        sortEnabled: true,
      },
    ]);

    const loading = ref(true);
    const searchQuery = ref(DataTablesService.loadSearchValue());
    const tableData = ref([]);
    const countData = ref<number>(0);
    const params = ref(DataTablesService.loadParamsFromStorage() || { offset: 0, limit: 10, where: {}, order: {},include: ["sportsGroup"], });
    const reverseColumn = DataTablesService.reverseSort(params.value.order);
    const coloumDefaultLabel = ref();
    const coloumDefaultSort = ref();
    if(reverseColumn != null){
      coloumDefaultLabel.value = reverseColumn[0];
      coloumDefaultSort.value = reverseColumn[1];
    }
    const urlPagination = "/sports/pagination";
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
          or: [{ "title": { like: `%${searchQuery.value}%` } },
            { "$sportsGroup.title$": { like: `%${searchQuery.value}%` } },
        ]
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
      getUploadAssetPath,
      loading,
      tableHeader,
      tableData,
      searchQuery,
      handleSort,
    };
  },
});
</script>
