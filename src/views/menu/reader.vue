<template>
  <el-container class="home-container">
      <div class="backto iconfont" @click="$router.push('/menu/e/'+encode(drama_id)+'/')">&#xe6a8;</div>
      <div
        style="display: flex;
        align-items: center"
      >  
      </div>
    
    <el-container>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col class="center_main" :xs="24" :md="20">
            <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto;margin:0;padding:0;">
              <!-- <el-card v-for="item in chang_content_list" :style="{ borderTop: item.type?'2px solid rgb(159 162 169)':0, borderBottom:item.type?0:'2px solid rgb(159 162 169)' }"> -->
              <el-card v-for="item in chang_content_list" :class="item.type?'scene':'other'">
                <div slot="header" class="clearfix" v-if="item.type">
                  <span> {{ item.scene[0].scene_name }} </span>
                </div>
                <div v-for="dialog in item.content" v-if="item.type">
                  <p v-html="dialog.content"></p>
                </div>
                <span v-if="!item.type" style="white-space: nowrap;line-height: 40px;"> {{ item.node[0].element_content + (item.node[0].element_type!='end'?':':'')}}</span>
                <div v-if="!item.type" style="width:100%;display: flex;justify-content: space-around;">
                  <el-button v-for="choice in item.next_list" type="primary" @click="() => {next_scene = choice;chang_content_list.splice(chang_content_list.length-1,1)}">{{ choice.remark }}</el-button>
                </div>
              </el-card>
            </ul>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <div class="fix_button" :style="{right:isCollapse?'200px':0}">
      <el-button type="primary" icon="el-icon-set-up" circle size="medium" @click="()=>{isCollapse = true}"></el-button>
    </div>
    <el-drawer
      :visible.sync="isCollapse"
      :with-header="false"
      :modal="false"
      size="250"
    >
      <div id="chang_item_board">
        <div v-for="item in chang_list" :key="item.id" class="item">
          <div class="title" @click="show_scene(item)">
            {{ item.scene_name }}
          </div>
        </div>
      </div>

    </el-drawer>
  </el-container>
</template>
<script>
import '../../assets/css/jeditor.css'
import '../../assets/css/chang.css'
import '../../assets/css/base.css'
import '@/assets/css/line.css'
import { pulldata, pullcontent, getStartNode, getElementContent, getSceneContent } from '@/api/reader.js'
const $ = require('jquery')
const Loadding = require('../../assets/js/loadding').default.Loadding
const base = require('../../assets/js/base').default
const Storage = window.localStorage


export default {
  props: ['encode_drama_id', 'encode_episode_id'],
  data() {
    return {
      isCollapse: false,
      isCondition: false,
      searchcontent: '',
      drama_id: 0,
      episode_id: 0,
      chang_list: [],
      chang_id2idx: {},
      current_button: [],
      start_id: '',
      before: {
        graph_nodes_list: [],
        graph_edges_list: [],
        graph_nodes_set: new Set(),
        graph_edges_set: new Set(),
        node_id2edge: {},
        edge_id2node: {}
      },
      chang_content_list: [],
      next_scene: null
    }
  },
  mounted: function() {
    base.reset_rightboard_width()
    var that = this
    this.drama_id = window.atob(this.encode_drama_id)
    this.episode_id = window.atob(this.encode_episode_id)
    var first_loadding = new Loadding()
    first_loadding.add_title('初始化')
    first_loadding.__init__()
    first_loadding.add_process(
      '拉取数据',
      function() {
        pulldata(that.drama_id, that.episode_id).then((returndata) => {
          for (var i in returndata[0]) {
            that.chang_list.push(returndata[0][i])
            that.chang_id2idx[returndata[0][i].id] = i
          }
        }).catch((error) => console.log(error))
      }
    )
    first_loadding.add_process(
      '拉取第一个场',
      () => {
        getStartNode(this.drama_id, this.episode_id).then((res) => {
          this.show_content(res.next_list[0])
        })
      }
    )
    first_loadding.start()
  },
  methods: {
    show_content(data) {
      getElementContent(this.drama_id, this.episode_id, data.children_id).then(res => {
        if (res.scene) {
          var time = new Date();
          var recent_chang=[res.node[0].drama_id,res.node[0].episode_id,res.node[0].scene_id];
          var li_chang = [];
          Storage.setItem(time.getTime(),JSON.stringify(recent_chang)); 
          li_chang = this.checkStorage();
          // 
          // console.log(li_chang)
          Storage.clear();                            
          for(var i=0;i<li_chang.length;i++){
            Storage.setItem(li_chang[i].time,li_chang[i].data)            
          }
          Storage.setItem('loglevel:webpack-dev-server','SILENT');
          this.next_scene = res.next_list[0]
          pullcontent(this.drama_id, this.episode_id, res.scene[0].id).then((returndata) => {
            console.log("这是return");
            console.log(returndata);
            this.chang_content_list.push({ ...res, 'content': returndata[0], 'type': true })
          })
        } else {
          this.next_scene = null
          this.chang_content_list.push({ ...res, 'type': false })
        }
      })
    },
    show_scene(item) {
      getSceneContent(this.drama_id, this.episode_id, item.id).then((res) => {
        pullcontent(this.drama_id, this.episode_id, res.scene[0].id).then((returndata) => {
          
          this.chang_content_list = [{ ...res, 'content': returndata[0], 'type': true }]
        })
      })
    },
    encode: function(code) {
      return window.btoa(code)
    },
    load: function() {
      if (this.next_scene) {
        this.show_content(this.next_scene)
      }
    },
    checkStorage: function() {
      // 对storage进行检查。
      // 返回一个对象数组，里面根据time由大到小，并排除重复的data
      var limit_chang =[];
      var chang = {};
      for(var i=0;i<Storage.length;i++){
        chang = {} ;
        if(Storage.key(i) != 'loglevel:webpack-dev-server'){
          chang.time = eval(Storage.key(i));
          chang.data = Storage.getItem(Storage.key(i))
          limit_chang.push(chang);
        }       
      }
      limit_chang.sort(this.sortBy('time',true,parseInt));
      // limit_chang = this.unique(limit_chang,'data');
      limit_chang = limit_chang.reduce((acc, cur) => {
          const ids = acc.map(item => item.data);
          return ids.includes(cur.data) ? acc : [...acc, cur];
      }, []);
      console.log(limit_chang)
      return limit_chang;
    },
    sortBy: function(filed,rev,primer){
      // 排序
      rev = (rev)?-1:1;
      return function(a,b){
          a = a[filed];
          b = b[filed];
          if (typeof (primer) != 'undefined'){
              a = primer(a);
              b = primer(b);
          }
          if (a < b){
              return rev * -1;
          }
          if(a>b){
              return rev * 1;
          }
          return 1;
      }
    },
  }
}
</script>
<style scoped>
html,body{width:100%;height:100%;}
span{
  text-align:center;
  display:inline-block
}
.home-container{
  height: calc(100vh - 50px);
  background:#eee;
}
.el-main{
  overflow-y: scroll;
}
.el-main::-webkit-scrollbar{
  width: 0;
  height: 0;
}
.toggle-button{
  background-color:  #87879c;
  font-size: 10px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.fix_button{
  width: 45px;
  position: fixed;
  top: calc(50vh - 10px);
}
.el-card{
  margin: 10px 0 0 0;
}
.el-card.other{
  box-shadow: none;
  -webkit-box-shadow: none;
  border:0px;
  background: transparent;
}
.el-card.scene ::v-deep .el-card__header{
  font-size:1.2em;
  font-weight: bold;
}
.el-card.other ::v-deep .el-card__body{
  display: flex;
  justify-content: left;
}
.backto{
  box-shadow: 0px 4px 10px -2px rgb(93,107,192);
      position: absolute;
    z-index: 1;
}
.el-drawer{
  overflow-y: scroll;
}
</style>
