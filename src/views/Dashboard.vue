<template>
  <!--begin::Dashboard-->
  <div class="row g-5 g-xl-8">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
        <h1>Welcome my brother.</h1>
        <p>Lets create best app analytics sports</p>
        </div>
      </div>
    </div>
  </div>
  <!--end::Dashboard-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StatisticsWidget5 from "@/components/widgets/statsistics/Widget5.vue";
import ListsWidget1 from "@/components/widgets/lists/Widget1.vue";
import TablesWidget5 from "@/components/widgets/tables/Widget5.vue";
import ListsWidget3 from "@/components/widgets/lists/Widget3.vue";
import ChartsWidget1 from "@/components/widgets/charts/Widget1.vue";
import ListsWidget7 from "@/components/widgets/lists/Widget7.vue";
import ListsWidget6 from "@/components/widgets/lists/Widget6.vue";

export default defineComponent({
  name: "dashboard-main",
  components: {
    // StatisticsWidget5,
    // ListsWidget1,
    // TablesWidget5,
    // ListsWidget3,
    // ChartsWidget1,
    // ListsWidget7,
    // ListsWidget6,
  },
});
</script>
