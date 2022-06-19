<template>
<el-card>
  <div v-for="item in chang_content_list">
        <div>
            <span> {{ item.scene[0].scene_name }} </span>
        </div>
        <div v-for="dialog in item.content">
            <p v-html="dialog.content"></p>
        </div>
  </div>
</el-card>
</template>

<script>
import {pullcontent, getSceneContent } from '@/api/reader.js'
export default {
    data(){
        return{
        drama_id: 0,
        episode_id: 0,
        scene_id:0,
        chang_content_list:[],
        }
    },
    created(){
        this.drama_id=this.$route.query.drama_id;
        this.episode_id=this.$route.query.episode_id;
        this.scene_id=this.$route.query.scene_id;
    },
    mounted: function(){
      getSceneContent(this.drama_id, this.episode_id, this.scene_id).then((res) => {
          // console.log('这是res');
          // console.log(res);
        pullcontent(this.drama_id, this.episode_id, res.scene[0].id).then((returndata) => {
          console.log('这是returndata');
          console.log(returndata);
          this.chang_content_list = [{ ...res, 'content': returndata[0], 'type': true }]; 
        })
      })
      console.log('这是内容列表');
      console.log(this.chang_content_list);
    }
}
</script>

<style scoped>

</style>
