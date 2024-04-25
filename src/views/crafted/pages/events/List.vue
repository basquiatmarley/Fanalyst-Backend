<template>
  <!--begin::Timeline-->
  <div class="card">
      <div class="card-header">
          <h3 class="card-title">Event List</h3>
          <div class="card-toolbar">
              <!-- <button type="button" class="btn btn-sm btn-light">
                  Add New
              </button> -->
          </div>
      </div>
      <div class="card-body">
        <!-- <input 
        v-model="searchQuery" 
        type="text" 
        class="form-control mb-4" 
        placeholder="Search by sport name" 
      /> -->
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
            <!-- <router-link
                    class="btn btn-icon btn-sm me-2 btn-light"
                    :to="{ name: 'events-edit', params: { id: data.id } }"
                  >
              <KTIcon icon-name="pencil" icon-class=" text-success fs-2" />
            </router-link> -->
            <router-link
                    class="btn btn-icon btn-sm me-2 btn-light"
                    :to="{ name: 'events-view', params: { id: data.id } }"
                  >
              <KTIcon icon-name="eye" icon-class=" text-info fs-2" />
            </router-link>
          </template>
          <template v-slot:imageUrl="{ row: data }">
            <img  :src="(data.imageUrl != '' ? getApiUrl('.sandbox/'+data.imageUrl) : 'https://placehold.jp/150x100.png')" :class="`w-100px`" alt="image"  />
          </template>
          <template v-slot:commenceTime="{ row: data }">
            {{ dateTolocaleFormat(data.commenceTime) }}
          </template>
          <template v-slot:event="{ row: data }">
            {{ data.homeClub.name }} VS {{ data.awayClub.name }}
          </template>
          <template v-slot:completed="{ row: data }">
            <div class="text-center">
              <span v-if="data.completed === 1" :class="`badge badge-light-success`">
                COMPLETED
              </span>
              <span v-else="data.completed === 0" :class="`badge badge-light-danger`">
                PENDING
              </span>
            </div>
          </template>
          <template v-slot:winner="{ row: data }">
            <div class="text-center">
              <span v-if="data.winner === 2" :class="`badge badge-light-success`">
                AWAY
              </span>
              <span v-else-if="data.winner === 1" :class="`badge badge-light-info`">
                HOME
              </span>
              <span v-else-if="data.winner === 3" :class="`badge badge-light-warning`">
                TIE
              </span>
              <span v-else :class="`badge badge-light-danger`">
                UPCOMING
              </span>
            </div>
          </template>
        </Datatable>
      </div>
  </div>
  <!--end::Timeline-->
</template>

<script lang="ts">
import { getApiUrl } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, watch } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import {dateTolocaleFormat} from "@/assets/ts/_utils/_TypesHelpers"
import ApiService from "@/core/services/ApiService";
// Function to fetch data from the API
const getData = async (params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query("events", { params : {filter: params }});
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
        columnName: "Completed",
        columnLabel: "completed",
        columnWidth: 100,
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
      order:{},
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
            relation: "eventsGroup",
            required: true, // Ensure only results with a related eventsGroup are included
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
      getApiUrl,
      loading,
      tableHeader,
      tableData,
      searchQuery,
      handleSort,
      dateTolocaleFormat,
    };
  },
});
</script>
