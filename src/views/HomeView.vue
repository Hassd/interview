<template>
  <div class="page_title">用户管理</div>
  <div class="page_content">
    <div class="page_select">
      <div>
        <el-button type="primary" class="btn" @click="newUser">新建</el-button>
        <el-input
          class="input"
          v-model="pageData.selectText"
          placeholder="按姓名查找"
        ></el-input>
      </div>
      <div>
        <el-button class="btn" @click="cancel" style="margin-right: 60px"
          >撤销</el-button
        >
      </div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      ref="tableRef"
      max-height="600"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="age" label="年龄" width="120" />
      <el-table-column prop="gender" label="性别" width="120">
        <template #default="scope">
          <span v-if="scope.row.gender == '0'">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="detailedAddress" label="详细地址" width="600">
        <template #default="scope">
          <span v-addr="scope"></span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="updateUser(scope)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-button type="primary" class="all_btn" @click="deleteSelectRow"
        >批量删除</el-button
      >
      <el-button class="mt-4" @click="onAddItem">快速增加数据</el-button>
    </div>
    <EditUser @change="editUserChange" ref="editUserRef"></EditUser>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useStore } from "vuex";
import EditUser from "../components/EditUser.vue";
import addrData from "../utils/address";
import { ElMessageBox } from "element-plus";
import { filter } from "lodash";

let store = useStore();

let tableRef = ref();
let editUserRef = ref();
let allSelectData = reactive([]);
let pageData = reactive({
  selectText: "",
});

let tableData = reactive([...store.state.userData]);

const deleteRow = (index) => {
  ElMessageBox.confirm("是否真的删除条数据?")
    .then(() => {
      store.commit("deleteUserData", tableData[index]);
      tableData.splice(index, 1);
    })
    .catch(() => {
      // catch error
    });
};

const editUserChange = (row) => {
  if (row.type == "new") {
    tableData.push(row.data);
  }
};

const deleteSelectRow = () => {
  let indexArr = [];

  ElMessageBox.confirm("是否真的删除所选的数据?")
    .then(() => {
      tableData.forEach((item, index) => {
        for (let i = 0; i < allSelectData.length; i++) {
          if (allSelectData[i].id == item.id) {
            indexArr.push(index);
            break;
          }
        }
      });

      for (let i = indexArr.length; i > 0; i--) {
        store.commit("deleteUserData", tableData[indexArr[i - 1]]);
        tableData.splice(indexArr[i - 1], 1);
      }
    })
    .catch(() => {
      // catch error
    });
};

const newUser = () => {
  editUserRef.value.open();
};

const updateUser = (data) => {
  console.log(data.row);
  editUserRef.value.open(data.row);
};

// 撤销按钮操作
const cancel = () => {
  tableRef.value.clearSelection();
  pageData.selectText = "";
};

const onAddItem = () => {
  let newData = {
    id: new Date().getTime(),
    name: "Tom",
    age: "18",
    gender: "0",
    phone: "15976173544",
    province: "11",
    city: "1101",
    area: "110101",
    detailedAddress: "五里屯",
  };

  tableData.push(newData);
  store.commit("pushUserData", newData);
};

const handleSelectionChange = (val) => {
  allSelectData = JSON.parse(JSON.stringify(val));
};

// 在模板中启用 v-focus
const vAddr = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, preVnode) {
    // console.log("我是钩子函数:created");
    addrJoin(el, binding);
  },
  // 在元素被插入到 DOM 前调用
  beforeMount() {
    // console.log("我是钩子函数:beforeMount");
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted() {
    // console.log("我是钩子函数:mounted");
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate() {
    // console.log("我是钩子函数:beforeUpdate");
  },
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding) {
    // console.log("我是钩子函数:updated");
    addrJoin(el, binding);
  },
  // 绑定元素的父组件卸载前调用
  beforeUnmount() {
    // console.log("我是钩子函数:beforeUnmount");
  },
  // 绑定元素的父组件卸载后调用
  unmounted() {
    // console.log("我是钩子函数:unmounted");
  },
};

function addrJoin(el, data) {
  let { province, city, area, detailedAddress } = data.value.row;
  let addrContent = "";
  addrData.forEach((item) => {
    if (item.value == province) {
      addrContent = item.label;
    }
    item.children.forEach((item2) => {
      if (item2.value == city) {
        addrContent += item2.label;
      }
      item2.children.forEach((item3) => {
        if (item3.value == area) {
          addrContent += item3.label;
          el.innerText = addrContent + detailedAddress;
        }
      });
    });
  });
}

// 监听搜索
watch(
  () => pageData.selectText,
  () => {
    fnThrottle(searchAction, 300)();
  }
);

// 搜索方法
function searchAction() {
  let userData = JSON.parse(JSON.stringify(store.state.userData));
  let index = tableData.length;
  let newData = userData.filter((item) => {
    if (item.name.indexOf(pageData.selectText) == -1) {
      return false;
    } else {
      return item;
    }
  });
  tableData.push(...newData);
  tableData.splice(0, index);
}

// 防抖函数
function fnThrottle(fn, delay) {
  let open = true;
  return function (...data) {
    if (!open) {
      //休息时间 暂不接客
      return false;
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    open = false;
    setTimeout(() => {
      fn(...data);
      open = true;
    }, delay);
  };
}
</script>

<style lang="scss">
.page_title {
  height: 88px;
  background-color: #337ecc;
  line-height: 88px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.page_content {
  max-width: 1280px;
  margin: auto;
  padding: 0 20px;
}
.page_select {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  & > div {
    display: flex;
  }
  .input {
    width: 360px;
    margin-left: 10px;
  }
}
.all_btn {
  margin: 20px 0;
}
</style>