import { createStore } from 'vuex'

// 初始化数据
let initData = [
  {
    id: 1,
    name: "张三",
    gender: "0",
    age: "18",
    phone: "15976173544",
    province: "11",
    city: "1101",
    area: "110101",
    detailedAddress: "三里屯",
  },
  {
    id: 2,
    name: "李四",
    gender: "0",
    age: "18",
    phone: "15976173544",
    province: "11",
    city: "1101",
    area: "110101",
    detailedAddress: "四里屯",
  },
  {
    id: 3,
    name: "王五",
    gender: "0",
    age: "18",
    phone: "15976173544",
    province: "11",
    city: "1101",
    area: "110101",
    detailedAddress: "五里屯",
  },
]

let userData = window.localStorage.getItem("userData");
if (!userData) {
  userData = initData;
} else {
  userData = JSON.parse(userData);
}

export default createStore({
  state: {
    userData: userData
  },
  getters: {
  },
  mutations: {
    pushUserData(state, data) {
      state.userData.push(JSON.parse(JSON.stringify(data)));
      window.localStorage.setItem("userData", JSON.stringify(state.userData));
    },
    updateUserData(state, data) {
      state.userData.forEach((item, index) => {
        if (item.id == data.id) {
          state.userData.splice(index, 1, JSON.parse(JSON.stringify(data)));
        }
      });
      window.localStorage.setItem("userData", JSON.stringify(state.userData))
    },
    deleteUserData(state, data) {

      console.log(data);

      state.userData.forEach((item, index) => {
        if (item.id == data.id) {
          state.userData.splice(index, 1);
        }
      });
      window.localStorage.setItem("userData", JSON.stringify(state.userData))
    }
  },
  actions: {
  },
  modules: {
  }
})
