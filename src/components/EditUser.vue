<template>
  <div class="edit_user" v-if="pageData.isShow">
    <div class="mask" @click="close"></div>
    <div class="edit_content">
      <div class="title">
        <span v-if="pageData.rowData.id == ''">新增</span>
        <span v-else>修改</span>
        <span>用户</span>
      </div>
      <el-form
        :model="pageData.rowData"
        :rules="rules"
        ref="formEl"
        label-position="top"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item class="form_item" prop="name" label="姓名">
              <el-input
                v-model="pageData.rowData.name"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              style="margin-left: 20px"
              class="form_item"
              label="性别"
            >
              <el-select
                v-model="pageData.rowData.gender"
                placeholder="请选择性别"
                value-key="value"
              >
                <el-option label="男" value="0" />
                <el-option label="女" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input
                v-model="pageData.rowData.phone"
                placeholder="请输入联系电话"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="margin-left: 20px" label="年龄" prop="age">
              <el-input
                v-model.number="pageData.rowData.age"
                maxlength="3"
                placeholder="请输入年龄"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="区域" prop="province">
          <Address
            :area="pageData.rowData.area"
            @change="addressChange"
          ></Address>
        </el-form-item>
        <el-row class="addr_box">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="detailedAddress">
              <el-input
                class="addr2"
                v-model="pageData.rowData.detailedAddress"
                placeholder="输入详细地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div style="text-align: right">
        <el-button class="btn" @click="resetForm(formEl)">取消</el-button>
        <el-button type="primary" @click="submitForm(formEl)" class="btn"
          >保存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import Address from "./Address.vue";

let store = useStore();

let pageData = reactive({
  isShow: false,
  rowData: {
    id: "",
    name: "",
    age: "",
    gender: "0",
    phone: "",
    province: "",
    city: "",
    area: "",
    detailedAddress: "",
  },
});

// const props = defineProps({
//   rowData: {
//     type: Object,
//     default: () => {
//       return {};
//     },
//   },
// });

const formEl = ref();
const emits = defineEmits(["change"]);

// 表单验证
const validateName = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("姓名不能为空！"));
  } else {
    callback();
  }
};

const validatePhone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("手机号不能为空！"));
  } else {
    if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(value)) {
      callback(new Error("手机号格式错误！"));
    } else {
      callback();
    }
  }
};

const validateAge = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("年龄不能为空！"));
  } else {
    if (!/^[0-9]{1,3}$/.test(value)) {
      callback(new Error("年龄格式错误！"));
    } else {
      callback();
    }
  }
};

const rules = reactive({
  name: [{ required: true, validator: validateName, trigger: "blur" }],
  phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
  age: [{ required: true, validator: validateAge, trigger: "blur" }],
  province: [{ required: true, message: "省不能为空！", trigger: "blur" }],
  detailedAddress: [
    { required: true, message: "详细地址不能为空！", trigger: "blur" },
  ],
});

// 地区组件返回
const addressChange = (data) => {
  console.log(data);
  pageData.rowData.province = data.province;
  pageData.rowData.city = data.city;
  pageData.rowData.area = data.area;
};

// 保存按钮
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(pageData.rowData);

      if (pageData.rowData["id"] == "") {
        pageData.rowData["id"] = new Date().getTime();
        store.commit("pushUserData", pageData.rowData);
        ElMessage({
          message: "新增成功！",
          type: "success",
        });
        emits("change", {
          type: "new",
          data: pageData.rowData,
        });
      } else {
        store.commit("updateUserData", pageData.rowData);
        ElMessage({
          message: "修改成功！",
          type: "success",
        });
      }
      close();
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 取消按钮
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();

  close();
};

// 打开页面
const open = (data) => {
  if (data != null) {
    pageData.rowData = data;
  } else {
    pageData.rowData = {
      id: "",
      name: "",
      age: "",
      gender: "0",
      phone: "",
      province: "",
      city: "",
      area: "",
      detailedAddress: "",
    };
  }
  pageData.isShow = true;
};

// 关闭页面
const close = () => {
  pageData.isShow = false;
};

defineExpose({
  open,
  close,
});
</script>

<style lang="scss">
.edit_user {
  .mask {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: #000;
    opacity: 0.4;
    z-index: 10;
  }
}
.edit_content {
  width: 600px;
  height: 500px;
  padding: 20px 60px;
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 12;
  border-radius: 10px;

  .title {
    $h: 20px;
    height: $h;
    line-height: $h;
    text-align: center;
    margin-bottom: 20px;
  }
  .el-input {
    width: 220px;
  }
  .el-row {
    margin-top: 10px;
  }
  .addr_box {
    .addr2 {
      width: 450px;
    }
  }
}
</style>
