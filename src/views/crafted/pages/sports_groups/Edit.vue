<template>
  <div>
    <!-- If sportsGroup data is null, display a loading message or spinner -->
    <div v-if="record.id === undefined">
      <p>Loading record details...</p>
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
            <h3 class="fw-bold m-0">Edit Record</h3>
          </div>
          <div class="card-toolbar">
            <router-link
              class="btn btn-sm btn-success me-3"
              :to="{ name: 'sports-groups-list' }"
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
            :validation-schema="validationSubmit"
            @submit="saveSubmitHandle()"
          >
            <!--begin::Card body-->
            <div class="card-body border-top p-9">
              <!--begin::Input group-->
              <div class="row mb-6">
                <!--begin::Label-->
                <label class="col-lg-4 col-form-label fw-semibold fs-6"
                  >Icon</label
                >
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col-lg-8">
                  <Field
                    type="file"
                    @change="changeFileHandle"
                    accept="image/svg+xml"
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
                <label class="col-lg-4 col-form-label fw-semibold fs-6"
                  >Background Image</label
                >
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col-lg-8">
                  <Field
                    type="file"
                    @change="changeFileBg"
                    accept="image/png, image/jpg, image/jpeg, image/webp"
                    name="background"
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
                <label class="col-lg-4 col-form-label required fw-semibold fs-6"
                  >Title</label
                >
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col-lg-8 fv-row">
                  <Field
                    type="text"
                    name="title"
                    class="form-control form-control-lg form-control-solid"
                    placeholder="Title"
                    aria-readonly="readonly"
                    v-model="record.title"
                  />
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
                      :checked="record.status"
                      v-model="record.status"
                      id="status"
                    />
                    <label class="form-check-label" for="status"></label>
                  </div>
                </div>
                <!--begin::Label-->
              </div>
              <!--end::Input group-->
              <!--begin::Input group-->
              <div class="row mb-0">
                <!--begin::Label-->
                <label class="col-lg-4 col-form-label fw-semibold fs-6"
                  >Hotest</label
                >
                <!--begin::Label-->

                <!--begin::Label-->
                <div class="col-lg-8 d-flex align-items-center">
                  <div class="form-check form-check-solid form-switch fv-row">
                    <input
                      class="form-check-input w-45px h-30px"
                      type="checkbox"
                      value="0"
                      :checked="record.statusHotest"
                      v-model="record.statusHotest"
                      id="statusHotest"
                    />
                    <label class="form-check-label" for="statusHotest"></label>
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
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import router from "@/router";
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
  try {
    ApiService.setHeader();
    const response = await ApiService.put(`sports-groups/${id}`, params);
    return { data: response.data, status: true };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: {}, status: false };
  }
};
export default defineComponent({
  name: "sports-groups-edit",
  components: {
    ErrorMessage,
    Field,
    VForm,
  },
  setup() {
    const submitButtonEl = ref<HTMLElement | null>(null);
    const route = useRoute(); // Access route to get parameters
    const recordId = route.params.id; // Get 'id' from the route
    const record = ref<SportsGroup>({} as SportsGroup);
    const fileSelected = ref([]);
    const fileSelectedBg = ref([]);
    const fetchRecordData = async () => {
      const data = await getData(recordId);
      data.status = data.status ==1;
      data.statusHotest = data.statusHotest ==1;
      record.value = data;
    };
    const changeFileHandle = (event) => {
      const file = event.target.files;
      fileSelected.value = file;
    };
    const changeFileBg = (event) => {
      const file = event.target.files;
      fileSelectedBg.value = file;
    };
    const validationSubmit = Yup.object().shape({
      title: Yup.string().required().label("Title"),
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
        if (fileSelectedBg.value) {
          const uploadFilePost = await uploadFile(fileSelectedBg.value);
          if (uploadFilePost.files) {
            record.value.backgroundUrl = uploadFilePost.files[0];
          }
        }
        var params = {
          imageUrl: record.value.imageUrl,
          backgroundUrl: record.value.backgroundUrl,
          status: record.value.status ? 1 : 0,
          statusHotest: record.value.statusHotest ? 1 : 0,
          title: record.value.title,
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
            // Go to page after successfully login
            router.push("/sports-groups");
          });
        } else {
          Swal.fire({
            text: "Something not right",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Try again!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn fw-semibold btn-light-danger",
            },
          });
        }
      }
    };

    const removeImage = () => {
      // profileDetails.value.avatar = "/media/avatars/blank.png";
    };

    onMounted(() => {
      fetchRecordData(); 
    });

    return {
      changeFileHandle,
      submitButtonEl,
      removeImage,
      saveSubmitHandle,
      dateTolocaleFormat,
      record,
      changeFileBg,
      getAssetPath,
      validationSubmit,
    };
  },
});
</script>
