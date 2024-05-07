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
import ApiService from "@/core/services/ApiService";
// Function to fetch data from the API
const getData = async (params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query("sports", {
      params: { filter: params },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "sports-list",
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
    const tableData = ref([]);
    const params = ref<any>({
      where: {},
      order: {},
      include: [
        {
          relation: "sportsGroup",
          required: true,
        },
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
        label = label.replace(/_/g, " ");
        params.value.order = [`${label} ${s.order}`];
        await fetchData(); // Fetch data with new sort order
      }
    };

    const filteredData = async () => {
      let whereCondition = {};
      if(searchQuery.value != ""){
        whereCondition = {
          or: [
            { "title": { like: `%${searchQuery.value}%` } },
            { "$sportsGroup.title$": { like: `%${searchQuery.value}%` } },
          ],
        };
      }else{
        whereCondition = {};
      }
      params.value.where = whereCondition;
      await fetchData();
    };

    watch(() => searchQuery.value, filteredData);

    onMounted(() => {
      fetchData(); 
    });

    return {
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
