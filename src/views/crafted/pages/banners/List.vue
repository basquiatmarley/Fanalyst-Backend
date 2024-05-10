<template>
  <!--begin::Timeline-->
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Banners List</h3>
      <div class="card-toolbar">
        <router-link
              class="btn btn-sm btn-success me-3"
              :to="{ name: 'banners-create' }"
            >
              <span>Create New</span>
            </router-link>
      </div>
    </div>
    <div class="card-body">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control mb-4"
        placeholder="Search"
      />
      <Datatable
        :loading="loading"
        :header="tableHeader"
        :data="tableData"
        @on-sort="handleSort"
      >
        <template v-slot:action="{ row: data }">
          <a href="#" class="btn btn-icon btn-sm me-2 btn-light" v-on:click="handleDelete(data.id)">
              <i class="ki-duotone ki-trash-square text-danger fs-2x">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </a>
          <router-link
            class="btn btn-icon btn-sm me-2 btn-light"
            :to="{ name: 'banners-edit', params: { id: data.id } }"
          >
            <KTIcon icon-name="pencil" icon-class=" text-success fs-2" />
          </router-link>
          <router-link
            class="btn btn-icon btn-sm me-2 btn-light"
            :to="{ name: 'banners-view', params: { id: data.id } }"
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
        <template v-slot:name="{ row: data }">
          {{ data.name }}
        </template>
        <template v-slot:route="{ row: data }">
          {{ data.route }}
        </template>
        <template v-slot:status="{ row: data }">
          <div class="text-center">
            <span v-if="data.status === 1" :class="`badge badge-light-success`">
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
import Swal from "sweetalert2/dist/sweetalert2.js";
// Function to fetch data from the API
const getData = async (params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query("banners", {
      params: { filter: params },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
const deleteData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.delete(`banners/${id}`);
    return true;
  } catch (error) {
    console.error("Error fetching data:", error);
    return false;
  }
};

export default defineComponent({
  name: "banners-list",
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
        columnName: "Name",
        columnLabel: "name",
        columnWidth: 150,
        sortEnabled: true,
      },
      {
        columnName: "Route",
        columnLabel: "route",
        columnWidth: 150,
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
    const handleDelete = async(id) =>{
      Swal.fire({
          text: "Are you sure delete this record?",
          icon: "info",
          buttonsStyling: false,
          confirmButtonText: "Confirm",
          showCancelButton: true,
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-primary",
            cancelButton: "btn fw-semibold btn-light-danger",
          },
        }).then(async () => {
           var response = await deleteData(id);
           if(response){
            fetchData();
            Swal.fire({
              text: "You have successfully delete record!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "OK",
              heightAuto: false,
              customClass: {
                confirmButton: "btn fw-semibold btn-light-primary",
              },
            })
           }else{
            Swal.fire({
              text: "Failed delete record!",
              icon: "danger",
              buttonsStyling: false,
              confirmButtonText: "OK",
              heightAuto: false,
              customClass: {
                confirmButton: "btn fw-semibold btn-light-primary",
              },
            })
           }
        });
    }
    const filteredData = async () => {
      let whereCondition = {};
      if(searchQuery.value != ""){
        whereCondition = {
          or: [
          { name: { like: `%${searchQuery.value}%` } },
          { route: { like: `%${searchQuery.value}%` } },
          ],
        };
      }else{
        whereCondition = {};
      }
      params.value.where = whereCondition;
      await fetchData(); // Fetch data with updated filter
    };

    watch(() => searchQuery.value, filteredData);

    onMounted(() => {
      fetchData(); // Calls `fetchData` with the default `params`
    });

    return {
      handleDelete,
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
