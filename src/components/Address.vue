<template>
  <el-row class="address">
    <el-col :span="8">
      <el-select
        v-model="data.province"
        placeholder="省"
        @change="provinceChenga"
      >
        <el-option
          v-for="item in data.provinceData"
          :key="item.value"
          :label="item.label"
          :value="item.value + ''"
        />
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select v-model="data.city" placeholder="市" @change="cityChenga">
        <el-option
          v-for="item in data.cityData"
          :key="item.value"
          :label="item.label"
          :value="item.value + ''"
        />
      </el-select>
    </el-col>
    <el-col :span="8">
      <el-select v-model="data.area" placeholder="区" @change="areaChenga">
        <el-option
          v-for="item in data.areaData"
          :key="item.value"
          :label="item.label"
          :value="item.value + ''"
        />
      </el-select>
    </el-col>
  </el-row>
</template>
<script setup>
import { reactive, ref, watch, nextTick } from "vue";
import addrData from "../utils/address";

const props = defineProps({
  area: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["change"]);

let data = reactive({
  province: "",
  provinceData: [],
  city: "",
  cityData: [],
  area: "",
  areaData: [],
});
data.provinceData = addrData;

nextTick(() => {
  if (props.area != "") {
    data.province = props.area.substr(0, 2);
    data.city = props.area.substr(0, 4);
    data.area = props.area;

    data.provinceData.forEach((item) => {
      if (item.value == data.province) {
        data.cityData = item.children;
      }
    });

    data.cityData.forEach((item) => {
      if (item.value == data.city) {
        data.areaData = item.children;
      }
    });
    areaChenga();
  }
});

const provinceChenga = () => {
  data.provinceData.forEach((item) => {
    if (item.value == data.province) {
      data.cityData = item.children;
      data.city = item.children[0].value;
      data.areaData = item.children[0].children;
      data.area = item.children[0].children[0].value;
    }
  });
  areaChenga();
};
const cityChenga = () => {
  data.cityData.forEach((item) => {
    if (item.value == data.city) {
      data.areaData = item.children;
      data.area = item.children[0].value;
    }
  });
  areaChenga();
};
const areaChenga = () => {
  let addrContent = "";
  data.provinceData.forEach((item) => {
    if (item.value == data.province) {
      addrContent = item.label;
    }
  });
  data.cityData.forEach((item) => {
    if (item.value == data.city) {
      addrContent += item.label;
    }
  });
  data.areaData.forEach((item) => {
    if (item.value == data.area) {
      addrContent += item.label;
    }
  });

  emits("change", {
    province: data.province,
    city: data.city,
    area: data.area,
    content: addrContent,
  });
};
</script>

<style lang="scss">
.address {
  .el-input {
    width: 150px !important;
  }
}
</style>