<template>
  <!-- 展示最近阅读的场 -->
<div class="item_board">
    <el-row :gutter="10" style="width:100%;">
        <el-col :span="4" v-for="chang in recent_chang" :key="chang.scene[0].id">
            <el-card class="chang_card">
                <el-row class="chang_card_title  textEllipsis">{{chang.scene[0].scene_name}}</el-row>
                <!-- 点击场展示场的内容 -->
                    <div class="content" @click="$router.push({path:'/quick/e/content',query:{scene_id:chang.scene[0].id,episode_id:chang.scene[0].episode_id,drama_id:chang.scene[0].drama_id}})">
                                    <!-- 场类型 -->
                                    <div class="item">
                                        <div class="item_title iconfont">&#xe79e;</div>
                                        <div class="item_content textEllipsis">
                                            {{chang.scene[0].scene_type}}
                                        </div>
                                    </div>
                                    <!-- 场天气 -->
                                    <div class="item">
                                        <div class="item_title iconfont">&#xe8ae;</div>
                                        <div class="item_content textEllipsis">
                                        {{chang.scene[0].weather}}
                                        </div>
                                    </div>
                                    <!-- 场时间 -->
                                    <div class="item">
                                        <div class="item_title iconfont">&#xe601;</div>
                                        <div class="item_content textEllipsis">
                                        {{chang.scene[0].scene_time}}
                                        </div>
                                    </div>
                                    <!-- 场地点 -->
                                    <div class="item">
                                        <div class="item_title iconfont">&#xe632; </div>
                                        <div class="item_content textEllipsis">
                                        {{chang.scene[0].scene_location}}
                                        </div>
                                    </div>
                            </div> 
                        </el-card>
                    </el-col>
                </el-row>
          </div>
</template>

<script>
import '../../assets/css/jeditor.css'
import { PullSceneData } from '@/api/menu.js'
const Storage = window.localStorage
export default {
  props: ["encode_drama_id", "encode_episode_id", "encode_scene_id"],
  data(){
    return{
       drama_id: 0,
       episode_id: 0,
       chang_id:0,
       selected_chang:[],
       // 在selected_chang[]里面存放：localStorage里面的最近读取的场对应的剧目剧集和场自身的id
       recent_chang:[]
       // 在recent_chang:[]里面存放最近读过的场的后台拉取的各种数据
    }
  },

  mounted: function(){
    for(var i = 0;i<Storage.length;i++){
        if(Storage.key(i) != 'loglevel:webpack-dev-server'){
            this.selected_chang.push(eval(Storage.getItem(Storage.key(i))))
        }
    }
    console.log(this.selected_chang)

    for (var i=0;i<this.selected_chang.length&&i<20;i++)
      //展示出最近阅读的20场
    {
            this.drama_id=this.selected_chang[i][0];
            this.episode_id=this.selected_chang[i][1];
            this.chang_id=this.selected_chang[i][2];
            PullSceneData(this.drama_id,this.episode_id,this.chang_id).then((returndata) => {
                console.log('这个是returndata');
                console.log(returndata);
                this.recent_chang.push(returndata) 
        }).catch((error) => console.log(error))
    }
    console.log('这是recent_chang');
    console.log(this.recent_chang);
    
  },

  methods:{
    encode: function(code) {
      return window.btoa(code)
    }
  }
}
</script>

<style scoped>
.chang_card{
    border-radius: 4px;
    position: relative;
    transition: ease .5s;
}
.chang_card:hover{
    box-shadow: 0px 2px 12px rgba(0,0,0,.3);
}
.chang_card_title{
    transition: ease .6s;
    font-weight: bold;
        font-size: 1em;
    line-height: 1.2em;
}
.content{
    height: 120px;
    background: rgba(0,0,0,.02);
    border-radius: 4px;
    transition: ease .6s;
    cursor: pointer;
}
.item_board .item{
    width: 100%;
    height: 20px;
    padding: 5px 0px;
    box-sizing: border-box;
    margin:5px 0px;
}
.item_board .item_title{
        float: left;
    height: 20px;
    line-height: 20px;
    width: 20px;
}

.item_board .item_content{
        background: rgb(245, 245, 245);
    border-radius: 10px;
    padding: 0px 5px;
    float: left;
    height: 20px;
    text-align: justify;
    line-height: 20px;
    width: calc(100% - 30px);
}
.active .content{
    transform: scale(.9);
}

.active .chang_card_title{
    transform: scale(.9);
}
</style>
