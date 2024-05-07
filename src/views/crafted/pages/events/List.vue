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
// Function to fetch data from the API
const getData = async (params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query("events", {
      params: { filter: params },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "events-list",
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
    const tableData = ref([]);
    const params = ref<any>({
      where: {},
      order: {},
      include: [
        {
          relation: "sportsGroup",
          required: true,
        },
        {
          relation: "sport",
          required: true,
        },
        {
          relation: "homeClub",
          required: true,
        },
        {
          relation: "awayClub",
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
          { "$sportsGroup.title$": { like: `%${searchQuery.value}%` } },
          { "$sport.title$": { like: `%${searchQuery.value}%` } },
          { "$homeClub.name$": { like: `%${searchQuery.value}%` } },
          { "$awayClub.name$": { like: `%${searchQuery.value}%` } },
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
