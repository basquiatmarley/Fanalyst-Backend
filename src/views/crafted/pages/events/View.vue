<template>
  <div>
    <!-- If club data is null, display a loading message or spinner -->
    <div v-if="record.id === undefined">
      <p>Loading data details...</p>
      <!-- Optionally, add a loading spinner -->
      <div class="spinner"></div>
    </div>

    <!--begin::Navbar-->
    <div v-else class="card mb-5 mb-xxl-8">
      <div class="card-header">
        <h3 class="card-title">Event View</h3>
        <div class="card-toolbar">
          <router-link
            class="btn btn-sm btn-success me-3"
            :to="{ name: 'events-list' }"
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
              <img
                :src="
                  getUploadAssetPath(record.sport?.imageUrl)
                "
                alt="image"
              />
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
                <div>
                  <span v-if="record.winner === 2" :class="`badge badge-light-success`">
                    AWAY
                  </span>
                  <span
                    v-else-if="record.winner === 1"
                    :class="`badge badge-light-info`"
                  >
                    HOME
                  </span>
                  <span
                    v-else-if="record.winner === 3"
                    :class="`badge badge-light-warning`"
                  >
                    TIE
                  </span>
                  <span v-else :class="`badge badge-light-danger`"> UPCOMING </span>
                </div>
                <!--begin::Name-->
                <div class="d-flex align-items-center mb-2">
                  <span class="text-gray-800 fs-2 fw-bold me-1">{{
                    record.homeClub?.name
                  }} VS {{
                    record.awayClub?.name
                  }}</span>
                  
                </div>
                
                <!--end::Name-->
                <div class="d-flex flex-wrap fw-semibold fs-6 pe-2">
                  <a href="#" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                    <i class="ki-duotone ki-rocket fs-4 me-1">
                      <span class="path1"></span><span class="path2"></span><span class="path3"></span></i> 
                      {{ record.sportsGroup?.title }} 
                    </a>
                  <a href="#" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                    <i class="ki-duotone ki-time fs-4 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    {{ getLocaleFormatted(record.commenceTime,'full')}} 
                    </a>
                  <a href="#" class="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                    <i class="ki-duotone ki-star fs-4 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    {{ record.sport?.title}}  
                    </a>
                </div>
                <!--end::Info-->
              </div>
              <!--end::User-->
            </div>
            <!--end::Title-->
            <div class="d-flex flex-wrap flex-stack">
              <div
                class="d-flex flex-wrap flex-stack">
                <div
                    class="d-flex flex-column flex-grow-1 pe-8">
                    <div class="d-flex flex-wrap">
                        <div
                            class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                            <div
                                class="text-center">
                                <div
                                    class="fs-1 fw-bold">
                                    {{ record.scores![0] != undefined ? record.scores![0].homeScore : '0' }}
                                </div>
                                <div
                                class="fw-semibold fs-6 text-gray-500">
                                HOME</div>
                            </div>
                        </div>
                        <div
                            class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                            <div
                                class="text-center">
                                <div
                                    class="fs-1 fw-bold">
                                    {{ record.scores![0] != undefined ? record.scores![0].awayScore : '0' }}
                                </div>
                                <div
                                class="fw-semibold fs-6 text-gray-500">
                                AWAY</div>
                            </div>
                        </div>
                        <div
                            class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                            <div
                                class="text-center">
                                <div
                                    class="fs-1 fw-bold">
                                    {{ homePredictionsCount }}
                                </div>
                                <div
                                class="fw-semibold fs-6 text-gray-500">
                                HOME PICK</div>
                            </div>
                        </div>
                        <div
                            class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                            <div
                                class="text-center">
                                <div
                                    class="fs-1 fw-bold">
                                    {{ awayPredictionsCount }}
                                </div>
                                <div
                                class="fw-semibold fs-6 text-gray-500">
                                AWAY PICK</div>
                            </div>
                        </div>
                    </div>
                </div>  
              </div>
            </div>
          </div>
          <!--end::Info-->
        </div>
        <!--end::Details-->
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
import type { Event } from "@/core/model/Event";
const getData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query(`events/${id}`, {
      params: {
        filter: {
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
            {
              relation: "scores",
            },
            {
              relation: "usersPredictions",
            },
          ],
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default defineComponent({
  name: "sports-view",
  components: {},
  setup() {
    const route = useRoute(); // Access route to get parameters
    const clubId = route.params.id; // Get 'id' from the route
    const record = ref<Event>({} as Event);
    const usersPredictionsCount = ref(0);
    const homePredictionsCount = ref(0);
    const awayPredictionsCount = ref(0);
    const fetchData = async () => {
      const data = await getData(clubId);
      record.value = data;
      if(data.usersPredictions != null){
        usersPredictionsCount.value = data.usersPredictions.length;
        
        const teamCounts = data.usersPredictions.reduce((acc, prediction) => {
        const team = prediction.predictedTeam;
        if (acc[team]) {
          acc[team] += 1; // Increment the count
        } else {
          acc[team] = 1; // Initialize the count
        }
        return acc;
      }, {});
        homePredictionsCount.value = (teamCounts[1] != undefined ? teamCounts[1] : 0);
        awayPredictionsCount.value = (teamCounts[2] != undefined ? teamCounts[2] : 0);
      }
    };

    onMounted(() => {
      fetchData(); // Fetch data when component is mounted
    });

    return {
      awayPredictionsCount,
      homePredictionsCount,
      usersPredictionsCount,
      getUploadAssetPath,
      getLocaleFormatted,
      record,
    };
  },
});
</script>
