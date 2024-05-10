<template>
  <div>
    <!-- If club data is null, display a loading message or spinner -->
    <div v-if="record.id === undefined">
      <p>Loading data details...</p>
      <!-- Optionally, add a loading spinner -->
      <div class="spinner"></div>
    </div>

    <!--begin::FORM-->
    <div v-else class="">
      <!--begin::Basic info-->
      <div class="card mb-5 mb-xl-10">
        <!--begin::Card header-->
        <div class="card-header border-0 cursor-pointer">
          <!--begin::Card title-->
          <div class="card-title m-0">
            <h3 class="fw-bold m-0">Edit Banner</h3>
          </div>
          <div class="card-toolbar">
            <router-link
              class="btn btn-sm btn-success me-3"
              :to="{ name: 'banners-list' }"
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
            :validation-schema="validationForm"
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
                  <div class="form-text">
                    Allowed file types: png, jpg, jpeg.
                  </div>
                  <!--end::Hint-->
                </div>
                <!--end::Col-->
              </div>
              <!--end::Input group-->
               
              <!--begin::Input group-->
              <div class="row mb-6">
                <!--begin::Label-->
                <label class="col-lg-4 col-form-label fw-semibold fs-6">
                  <span class="required">Name</span>
                </label>
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                  <Field
                    type="text"
                    name="name"
                    class="form-control form-control-lg form-control-solid"
                    placeholder="Name"
                    aria-readonly="readonly"
                    v-model="record.name"
                  />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="name" />
                    </div>
                  </div>
                </div>
                <!--end::Col-->
              </div>
              <!--end::Input group-->
              <!--begin::Input group-->
              <div class="row mb-6">
                <!--begin::Label-->
                <label class="col-lg-4 col-form-label fw-semibold fs-6">
                  <span class="">Route</span>
                </label>
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                  <Field
                    type="text"
                    name="lastName"
                    class="form-control form-control-lg form-control-solid"
                    placeholder="Route : /home"
                    aria-readonly="readonly"
                    v-model="record.route"
                  />
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
import { dateTolocaleFormat } from "@/assets/ts/_utils/_TypesHelpers";
import type { Banner } from "@/core/model/Banner";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import router from "@/router";
import * as Yup from "yup";

interface BannerParams {
      name: string;
      route?: string;
      imageUrl: string;
      status: number;
    }
const getData = async (id) => {
  try {
    ApiService.setHeader();
    const response = await ApiService.query(`banners/${id}`, {});
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
    const response = await ApiService.post(`files/upload`, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
const postEditHandle = async (id, params) => {
  ApiService.setHeader();
  return ApiService.put(`banners/${id}`, params)
  .then(({ data }) => {
    return { data: data, status: true, message:"success" };
  })
  .catch(({ response }) => {
    return { data: {}, status: false, "message" : response.data.error.message };
  });
};
export default defineComponent({
  name: "banners-edit",
  components: {
    ErrorMessage,
    Field,
    VForm,
  },
  setup() {
    const submitButtonEl = ref<HTMLElement | null>(null);
    const route = useRoute(); // Access route to get parameters
    const recordId = route.params.id; // Get 'id' from the route
    const record = ref<Banner>({} as Banner);
    const fileSelected = ref([]);
    const fetchBannerData = async () => {
      const data = await getData(recordId);
      record.value = data;
    };
    const changeFileHandle = (event) => {
      const file = event.target.files;
      fileSelected.value = file;
    };
    const validationForm = Yup.object().shape({
      name: Yup.string().required().label("Name"),
    });

    const saveSubmitHandle = async () => {
      if (submitButtonEl.value) {
        // Activate indicator
        submitButtonEl.value.setAttribute("data-kt-indicator", "on");
        submitButtonEl.value.setAttribute("disabled", "disabled");
        // console.log("status : "+ record.value.status)
        if (fileSelected.value.length > 0) {
          const uploadFilePost = await uploadFile(fileSelected.value);
          if (uploadFilePost.files) {
            record.value.imageUrl = uploadFilePost.files[0];
          }
        }
        var params: BannerParams  = {
          name: record.value.name,
          imageUrl: record.value.imageUrl,
          status: record.value.status ? 1 : 0,
          route: record.value.route,
        };
        const postData = await postEditHandle(recordId, params);
        submitButtonEl.value?.removeAttribute("data-kt-indicator");
        submitButtonEl.value?.removeAttribute("disabled");
        if (postData.status) {
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
            router.push("/banners");
          });
        } else {
          Swal.fire({
            title: "Something not right",
            text: postData.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Try again!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-danger",
              title:"fw-semibold text-danger fs-3",
            },
          });
        }
      }
    };

    const removeImage = () => {
      // profileDetails.value.avatar = "/media/avatars/blank.png";
    };

    onMounted(() => {
      fetchBannerData(); // Fetch data when component is mounted
    });

    return {
      validationForm,
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
