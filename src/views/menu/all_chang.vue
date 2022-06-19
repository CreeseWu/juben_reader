<template>
  <!-- 展示最近阅读的场 -->
  <div class="item_board">
    <el-row :gutter="10" style="width: 100%">
      <ul
        class="infinite-list"
        v-infinite-scroll="load"
        style="overflow: auto; margin: 0; padding: 0"
      >
        <el-col
          :span="4"
          v-for="chang in chang_content_list"
          :key="chang.scene[0].id"
        >
          <el-card class="chang_card">
            <el-row class="chang_card_title textEllipsis">{{
              chang.scene[0].scene_name
            }}</el-row>
            <!-- 点击场展示场的内容 -->
            <div
              class="content"
              @click="
                $router.push({
                  path: '/quick/e/content',
                  query: {
                    scene_id: chang.scene[0].id,
                    episode_id: chang.scene[0].episode_id,
                    drama_id: chang.scene[0].drama_id,
                  },
                })
              "
            >
              <!-- 场类型 -->
              <div class="item">
                <div class="item_title iconfont">&#xe79e;</div>
                <div class="item_content textEllipsis">
                  {{ chang.scene[0].scene_type }}
                </div>
              </div>
              <!-- 场天气 -->
              <div class="item">
                <div class="item_title iconfont">&#xe8ae;</div>
                <div class="item_content textEllipsis">
                  {{ chang.scene[0].weather }}
                </div>
              </div>
              <!-- 场时间 -->
              <div class="item">
                <div class="item_title iconfont">&#xe601;</div>
                <div class="item_content textEllipsis">
                  {{ chang.scene[0].scene_time }}
                </div>
              </div>
              <!-- 场地点 -->
              <div class="item">
                <div class="item_title iconfont">&#xe632;</div>
                <div class="item_content textEllipsis">
                  {{ chang.scene[0].scene_location }}
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </ul>
    </el-row>
  </div>
</template>

<script>
import "../../assets/css/jeditor.css";
import { PullSceneData } from "@/api/menu.js";
const Loadding = require("../../assets/js/loadding").default.Loadding;
import {
  pulldata,
  pullcontent,
  getStartNode,
  getElementContent,
  getSceneContent,
} from "@/api/reader.js";
const base = require("../../assets/js/base").default;

import "../../assets/css/chang.css";
import "../../assets/css/base.css";
import "@/assets/css/line.css";

const $ = require("jquery");
const Storage = window.localStorage;

export default {
  props: ["encode_drama_id", "encode_episode_id"],
  data() {
    return {
      isCollapse: false,
      isCondition: false,
      searchcontent: "",
      drama_id: 0,
      episode_id: 0,
      chang_list: [],
      chang_id2idx: {},
      current_button: [],
      start_id: "",
      before: {
        graph_nodes_list: [],
        graph_edges_list: [],
        graph_nodes_set: new Set(),
        graph_edges_set: new Set(),
        node_id2edge: {},
        edge_id2node: {},
      },
      chang_content_list: [],
      next_scene: null,
    };
  },
  mounted: function () {
    base.reset_rightboard_width();
    var that = this;
    this.drama_id = window.atob(this.encode_drama_id);
    this.load();
    this.episode_id = window.atob(this.encode_episode_id);
    var first_loadding = new Loadding();
    first_loadding.add_title("初始化");
    first_loadding.__init__();
    first_loadding.add_process("拉取数据", function () {
      pulldata(that.drama_id, that.episode_id)
        .then((returndata) => {
          for (var i in returndata[0]) {
            that.chang_list.push(returndata[0][i]);
            that.chang_id2idx[returndata[0][i].id] = i;
          }
        })
        .catch((error) => console.log(error));
    });
    first_loadding.add_process("拉取第一个场", () => {
      getStartNode(this.drama_id, this.episode_id).then((res) => {
        this.show_content(res.next_list[0]);
      });
    });
    first_loadding.start();
  },
  methods: {
    show_content(data) {
      getElementContent(this.drama_id, this.episode_id, data.children_id).then(
        (res) => {
          if (res.scene) {
            console.log("res", res);
            var time = new Date();
            var recent_chang = [
              res.node[0].drama_id,
              res.node[0].episode_id,
              res.node[0].scene_id,
            ];
            var li_chang = [];
            Storage.setItem(time.getTime(), JSON.stringify(recent_chang));
            li_chang = this.checkStorage();
            //
            // console.log(li_chang)
            Storage.clear();
            for (var i = 0; i < li_chang.length; i++) {
              Storage.setItem(li_chang[i].time, li_chang[i].data);
            }
            Storage.setItem("loglevel:webpack-dev-server", "SILENT");
            this.next_scene = res.next_list[0];
            pullcontent(this.drama_id, this.episode_id, res.scene[0].id).then(
              (returndata) => {
                console.log("这是return");
                console.log(returndata);
                this.chang_content_list.push({
                  ...res,
                  content: returndata[0],
                  type: true,
                });
              }
            );
          } else {
            this.next_scene = null;
            this.chang_content_list.push({ ...res, type: false });
          }
        }
      );
    },
    show_scene(item) {
      getSceneContent(this.drama_id, this.episode_id, item.id).then((res) => {
        pullcontent(this.drama_id, this.episode_id, res.scene[0].id).then(
          (returndata) => {
            this.chang_content_list = [
              { ...res, content: returndata[0], type: true },
            ];
          }
        );
      });
    },
    encode: function (code) {
      return window.btoa(code);
    },
    load: function () {
      console.log("this.next_scene", this.next_scene);
      if (this.next_scene) {
        this.show_content(this.next_scene);
      }
    },
    checkStorage: function () {
      // 对storage进行检查。
      // 返回一个对象数组，里面根据time由大到小，并排除重复的data
      var limit_chang = [];
      var chang = {};
      for (var i = 0; i < Storage.length; i++) {
        chang = {};
        if (Storage.key(i) != "loglevel:webpack-dev-server") {
          chang.time = eval(Storage.key(i));
          chang.data = Storage.getItem(Storage.key(i));
          limit_chang.push(chang);
        }
      }
      limit_chang.sort(this.sortBy("time", true, parseInt));
      // limit_chang = this.unique(limit_chang,'data');
      limit_chang = limit_chang.reduce((acc, cur) => {
        const ids = acc.map((item) => item.data);
        return ids.includes(cur.data) ? acc : [...acc, cur];
      }, []);
      console.log(limit_chang);
      return limit_chang;
    },
    sortBy: function (filed, rev, primer) {
      // 排序
      rev = rev ? -1 : 1;
      return function (a, b) {
        a = a[filed];
        b = b[filed];
        if (typeof primer != "undefined") {
          a = primer(a);
          b = primer(b);
        }
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 1;
      };
    },
  },
};
</script>

<style scoped>
.chang_card {
  border-radius: 4px;
  position: relative;
  transition: ease 0.5s;
}
.chang_card:hover {
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.3);
}
.chang_card_title {
  transition: ease 0.6s;
  font-weight: bold;
  font-size: 1em;
  line-height: 1.2em;
}
.content {
  height: 120px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  transition: ease 0.6s;
  cursor: pointer;
}
.item_board .item {
  width: 100%;
  height: 20px;
  padding: 5px 0px;
  box-sizing: border-box;
  margin: 5px 0px;
}
.item_board .item_title {
  float: left;
  height: 20px;
  line-height: 20px;
  width: 20px;
}

.item_board .item_content {
  background: rgb(245, 245, 245);
  border-radius: 10px;
  padding: 0px 5px;
  float: left;
  height: 20px;
  text-align: justify;
  line-height: 20px;
  width: calc(100% - 30px);
}
.active .content {
  transform: scale(0.9);
}

.active .chang_card_title {
  transform: scale(0.9);
}
</style>
