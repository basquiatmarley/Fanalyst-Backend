<template>
  <div>
    <!-- If club data is null, display a loading message or spinner -->
    <div v-if="record === null">
      <p>Loading club details...</p>
      <!-- Optionally, add a loading spinner -->
      <div class="spinner"></div>
    </div>
    
    <!--begin::FORM-->
    <div  v-else class="">
      <!--begin::Basic info-->
  <div class="card mb-5 mb-xl-10">
    <!--begin::Card header-->
    <div
      class="card-header border-0 cursor-pointer"
    >
      <!--begin::Card title-->
      <div class="card-title m-0">
        <h3 class="fw-bold m-0">Edit Sport</h3>
      </div>
      <div class="card-toolbar">
            <router-link
                class="btn btn-sm btn-success me-3"
                :to="{ name: 'sports-list'}"
              >
                <span>Back</span>
              </router-link>
          </div>
      <!--end::Card title-->
    </div>
    <!--begin::Card header-->

    <!--begin::Content-->
    <div id="kt_form_edit" class="collapse show">
      <!--begin::Form-->
      <VForm
        id="kt_form_edit_form"
        class="form"
        novalidate
        @submit="saveSubmitHandle()"
      >
        <!--begin::Card body-->
        <div class="card-body border-top p-9">
          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semibold fs-6"
              >Image</label
            >
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8">
              <Field
                type="file"
                @change="changeFileHandle"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                name="image"
                class="form-control form-control-lg form-control-solid"
                placeholder="Image"
                aria-readonly="readonly"
              />


              <!--begin::Hint-->
              <div class="form-text">Allowed file types: png, jpg, jpeg.</div>
              <!--end::Hint-->
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->
<!--begin::Input group-->
<div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semibold fs-6">
              <span class="required">Sports Group</span>

              <i
                class="fas fa-exclamation-circle ms-1 fs-7"
                data-bs-toggle="tooltip"
                title="Can edit sports group title"
              ></i>
            </label>
            <!--end::Label-->

            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input type="text" 
              class="form-control form-control-lg form-control-solid" 
              :value="record.sportsGroup?.title"
              placeholder="Sport title" readonly=true name="sport_group_title">
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->
          <!--begin::Input group-->
          <div class="row mb-6">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label required fw-semibold fs-6"
              >Sport Name</label
            >
            <!--end::Label-->
            <!--begin::Col-->
            <div class="col-lg-8 fv-row">
              <input type="text" 
              class="form-control form-control-lg form-control-solid" 
              :value="record.title"
              placeholder="Title" readonly=true name="title">
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <ErrorMessage name="title" />
                </div>
              </div>
            </div>
            <!--end::Col-->
          </div>
          <!--end::Input group-->

          

          

          <!--begin::Input group-->
          <div class="row mb-0">
            <!--begin::Label-->
            <label class="col-lg-4 col-form-label fw-semibold fs-6"
              >Status</label
            >
            <!--begin::Label-->

            <!--begin::Label-->
            <div class="col-lg-8 d-flex align-items-center">
              <div class="form-check form-check-solid form-switch fv-row">
                <input
                  class="form-check-input w-45px h-30px"
                  type="checkbox"
                  value="0"
                  :checked="record.status == 1 && true"
                  v-model="record.status"
                  id="status"
                />
                <label class="form-check-label" for="status"></label>
              </div>
            </div>
            <!--begin::Label-->
          </div>
          <!--end::Input group-->
        </div>
        <!--end::Card body-->

        <!--begin::Actions-->
        <div class="card-footer d-flex justify-content-end py-6 px-9">
          <button
            type="reset"
            class="btn btn-light btn-active-light-primary me-2"
          >
            Discard
          </button>

          <button
            type="submit"
            id="kt_form_edit_submit"
            ref="submitButtonEl"
            class="btn btn-primary"
          >
            <span class="indicator-label"> Save Changes </span>
            <span class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
        <!--end::Actions-->
      </VForm>
      <!--end::Form-->
    </div>
    <!--end::Content-->
  </div>
  <!--end::Basic info-->
    </div>
  </div>
  
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import ApiService from "@/core/services/ApiService";
import { defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {dateTolocaleFormat} from "@/assets/ts/_utils/_TypesHelpers"
import type { Sport } from "@/core/model/Sport";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import router from "@/router";

const getData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query(`sports/${id}`,{params : {filter : {include: [
          {
            relation: "sportsGroup",
            required: true, // Ensure only results with a related sportsGroup are included
            // scope: {
            //   where: {title : 'Soccer'}
            // },
          },
        ]}}});
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};



const uploadFile = async (params) => {
  try {
    ApiService.setHeader();
    ApiService.setPostAsFile();
    const response = await ApiService.post(`files/upload`,params);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
const postEditHandle = async (id,params) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.put(`sports/${id}`,params);
    return {data : response.data,status : true};
  } catch (error) {
    console.error("Error fetching data:", error);
    return {data : {},status : false};
  }
};

export default defineComponent({
  name: "sports-edit",
  components: {
    ErrorMessage,
    Field,
    VForm,
  },
  setup() {
    const submitButtonEl = ref<HTMLElement | null>(null);
    const route = useRoute(); // Access route to get parameters
    const recordId = route.params.id; // Get 'id' from the route
    const record = ref<Sport>({} as Sport);
    const fileSelected = ref([]);
    const fetchSportData = async () => {
      const data = await getData(recordId);
      record.value = data;
    };
    const changeFileHandle = (event) => {
      const file = event.target.files;
      fileSelected.value = file;
    }
    
    const saveSubmitHandle = async () => {
      
      if (submitButtonEl.value) {
        // Activate indicator
        submitButtonEl.value.setAttribute("data-kt-indicator", "on");
        submitButtonEl.value.setAttribute("disabled", "disabled");
        // console.log("status : "+ record.value.status)
        if(fileSelected.value){
          const uploadFilePost = await uploadFile(fileSelected.value);
          if(uploadFilePost.files){
            record.value.imageUrl = uploadFilePost.files[0];
          }
        }
        var params = {
          imageUrl : record.value.imageUrl,
          status : (record.value.status ? 1 : 0),
          title : record.value.title,
          key : record.value.key,
        };
        const postData = await postEditHandle(recordId,params);
        console.log(postData);
        submitButtonEl.value?.removeAttribute("data-kt-indicator");
        submitButtonEl.value?.removeAttribute("disabled");
        if(postData.status){
          Swal.fire({
            text: "You have successfully edit record!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "OK",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-primary",
            },
          }).then(() => {
            // Go to page after successfully login
            router.push('/sports');
          });
        }else{
          Swal.fire({
            text: "Something not right",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Try again!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-danger",
            },
          })
        }
      }
    };

    
    const removeImage = () => {
      // profileDetails.value.avatar = "/media/avatars/blank.png";
    };

    
    onMounted(() => {
      fetchSportData(); // Fetch data when component is mounted
    });

    return {
      changeFileHandle,
      submitButtonEl,
      removeImage,
      saveSubmitHandle,
      dateTolocaleFormat,
      record,
      getAssetPath,
    };
  },
});
</script>
