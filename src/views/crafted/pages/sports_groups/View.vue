<template>
  <div>
    <!-- If sportsGroup data is null, display a loading message or spinner -->
    <div v-if="record.id === undefined">
      <p>Loading sportsGroup details...</p>
      <!-- Optionally, add a loading spinner -->
      <div class="spinner"></div>
    </div>

    <!--begin::Navbar-->
    <div v-else class="card mb-5 mb-xxl-8">
      <div class="card-header">
        <h3 class="card-title">Sports Groups View</h3>
        <div class="card-toolbar">
          <router-link
            class="btn btn-sm btn-success me-3"
            :to="{ name: 'sports-groups-list' }"
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
                      <th class="p-0 w-150px"></th>
                      <th class="p-0 w-150px"></th>
                      <th class="p-0 min-w-150px"></th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>
                        <div class="symbol symbol-150px mb-10">
                              <img
                                  :src="
                                   getUploadAssetPath(record.imageUrl)
                                  "
                                  alt="Logo Sport Group">
                          </div>
                          </td>
                          <td>
                        <div class="symbol symbol-150px mb-10">
                          <img
                :src="
                getUploadAssetPath(record.backgroundUrl)
                "
                alt="image"
              />
                          </div>
                      </td>
                      <td>
                        <span class="text-gray-900 fw-bold d-block fs-7">Title</span>
                        <span class="text-muted fw-semibold d-block w-200px">{{ record.title}}</span>
                        <span class="text-gray-900 fw-bold d-block fs-7">Created At</span>
                        <span class="text-muted fw-semibold d-block  w-200">{{ getLocaleFormatted(record.createdAt)}}</span>

                        <span class="text-gray-900 fw-bold d-block fs-7">Updated At</span>
                        <span class="text-muted fw-semibold d-block  w-200">{{ getLocaleFormatted(record.createdAt)}}</span>
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
import { getUploadAssetPath } from "@/core/helpers/assets";
import ApiService from "@/core/services/ApiService";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import  {getLocaleFormatted}  from "@/core/helpers/date_utils";
import type { SportsGroup } from "@/core/model/SportsGroup";
const getData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query(`sports-groups/${id}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "sports-groups-view",
  components: {},
  setup() {
    const route = useRoute(); // Access route to get parameters
    const recordId = route.params.id; // Get 'id' from the route
    const record = ref<SportsGroup>({} as SportsGroup);

    const fetchData = async () => {
      const data = await getData(recordId);
      record.value = data;
    };

    onMounted(() => {
      fetchData(); // Fetch data when component is mounted
    });

    return {
      getLocaleFormatted,
      record,
      getUploadAssetPath,
    };
  },
});
</script>
