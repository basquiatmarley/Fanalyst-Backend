<template>
  <div>
    <!-- If sportsGroup data is null, display a loading message or spinner -->
    <div v-if="record === null">
      <p>Loading sportsGroup details...</p>
      <!-- Optionally, add a loading spinner -->
      <div class="spinner"></div>
    </div>
    
    <!--begin::Navbar-->
    <div  v-else class="card mb-5 mb-xxl-8">
      <div class="card-header">
          <h3 class="card-title">Sports Groups View</h3>
          <div class="card-toolbar">
            <router-link
                class="btn btn-sm btn-success me-3"
                :to="{ name: 'sports-groups-list'}"
              >
                <span>Back</span>
              </router-link>
          </div>
      </div>
      <div class="card-body pt-9 pb-0">
        <!--begin::Details-->
        <div class="d-flex flex-wrap flex-sm-nowrap mb-3">
          <!--begin: Pic-->
          <div class="me-7 mb-4">
            <div
              class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative"
            >
              <img  :src="(record.imageUrl != '' ? getApiUrl('.sandbox/'+record.imageUrl) : 'https://placehold.jp/150x150.png')" alt="image" />
            </div>
          </div>
          <!--end::Pic-->

          <!--begin::Info-->
          <div class="flex-grow-1">
            <!--begin::Title-->
            <div
              class="d-flex justify-content-between align-items-start flex-wrap mb-2"
            >
              <!--begin::User-->
              <div class="d-flex flex-column">
                <!--begin::Name-->
                <div class="d-flex align-items-center mb-2">
                  <span
                    class="text-gray-800  fs-2 fw-bold me-1"
                    >{{record.title}}</span
                  >
                </div>
                <!--end::Name-->

                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semibold fs-5 pe-2">
                  <div
                    class="d-flex align-items-center text-gray-800 me-5 mb-2"
                  >
                      <span class="text-gray-800 me-2">Status :</span>
                      <span v-if="record.status == 1" :class="`badge badge-light-success`">
                        Active
                      </span>
                      <span v-else="record.status == 0" :class="`badge badge-light-danger`">
                        Inactive
                      </span>
                  </div>
                </div>
                <!--end::Info-->
                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semibold fs-5 pe-2">
                  <div
                    class="d-flex align-items-center text-gray-800 me-5 mb-2"
                  >
                      <span class="text-gray-800 me-2">Created At :</span>
                      <span :class="``">
                        {{record.createdAt}}
                      </span>
                  </div>
                </div>
                <!--end::Info-->
                <!--begin::Info-->
                <div class="d-flex flex-wrap fw-semibold fs-5 pe-2">
                  <div
                    class="d-flex align-items-center text-gray-800 me-5 mb-2"
                  >
                      <span class="text-gray-800 me-2">Update At :</span>
                      <span :class="``">
                        {{record.updatedAt}}
                      </span>
                  </div>
                </div>
                <!--end::Info-->
              </div>
              <!--end::User-->
            </div>
            <!--end::Title-->
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->
      </div>
    </div>
  </div>
  
</template>

<script lang="ts">
import { getApiUrl } from "@/core/helpers/assets";
import ApiService from "@/core/services/ApiService";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {dateTolocaleFormat} from "@/assets/ts/_utils/_TypesHelpers"
import type { SportsGroup } from "@/core/model/SportsGroup";
const getData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query(`sports-groups/${id}`,{});
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "sports-groups-view",
  components: {
    
  },
  setup() {
    const route = useRoute(); // Access route to get parameters
    const recordId = route.params.id; // Get 'id' from the route
    const record = ref<SportsGroup>({} as SportsGroup);

    const fetchSportsGroupData = async () => {
      const data = await getData(recordId);
      data.createdAt = dateTolocaleFormat(data.createdAt);
      data.updatedAt = dateTolocaleFormat(data.updatedAt);
      record.value = data;
    };

    onMounted(() => {
      fetchSportsGroupData(); // Fetch data when component is mounted
    });

    return {
      dateTolocaleFormat,
      record,
      getApiUrl,
    };
  },
});
</script>
