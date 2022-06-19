<template>
  <div class="main_board">
    <el-row type="flex" justify="center">
      <el-col class="center_main" :xs="24" :md="20">
        <el-row>
          <el-button type="primary" size="middle" :icon="'el-icon-back'" @click="$router.push('/menu')" style="margin:10px 0 0 5px">剧本管理</el-button>
        </el-row>
        <div class="searchbar">
          <el-select
            v-model="searchcontent"
            class="search_input"
            filterable
            placeholder="请输入剧本名称"
            @keyup.enter.native="(searchcontent==''?null:$router.push('/menu/e/'+encode(drama_id) + '/'+encode(searchcontent)))"
          >
            <el-option
              v-for="item in episode_data"
              :key="item.id"
              style="width: 100%;"
              :label="item.episode_name"
              :value="item.id"
            />
          </el-select>
          <div class="search_btn">
            <div class="btn" @click="(searchcontent==''?null:$router.push('/menu/e/'+encode(drama_id) + '/'+encode(searchcontent)))">Search</div>
          </div>
        </div>
        <div class="item_board">
          <div
            v-for="episode in episode_data"
            :key="episode.id"
            class="jumu_item"
            @dblclick="$router.push('/menu/e/'+encode(drama.id)+`/${encode(episode.id)}`)"
          >
            <div class="title" @click="$router.push('/menu/e/'+encode(drama_id)+`/${encode(episode.id)}`)">{{ episode.episode_name }}</div>
            <div class="c_time">{{ episode.c_time }}</div>
            <div class="hidden_menu">
              <div class="btn" style="width:100%;" @click="$router.push('/menu/e/'+encode(drama_id)+`/${encode(episode.id)}`)">阅读</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../../assets/css/jeditor.css'
import '../../assets/css/base.css'
import { PullJiData } from '@/api/menu.js'
const Loadding = require('../../assets/js/loadding').default.Loadding
const base = require('../../assets/js/base').default
export default {
  props: ['encode_drama_id'],
  data() {
    return {
      drama_id: 0,
      searchcontent: '',
      episode_data: [],
      episode_data_map: {},
      add_new_show: false,
      form_cover: false,
      delete_show: false,
      edit_show: false,
      need_to_delete: -1,
      new_episode: {
        'episode_name': '',
        'main_roles': '',
        'episode_rank': ''
      },
      edit_episode: {
        'id': '',
        'episode_name': '',
        'main_roles': '',
        'episode_rank': ''
      }
    }
  },
  mounted: function() {
    base.reset_rightboard_width()
    var that = this
    this.drama_id = window.atob(this.encode_drama_id)
    var first_loadding = new Loadding()
    first_loadding.add_title('初始化')
    first_loadding.__init__()
    first_loadding.add_process(
      '拉取数据',
      function() {
        PullJiData(that.drama_id, '').then((returndata) => {
          that.episode_data = returndata.episode
          that.characters = returndata.character
          for (var i = 0; i < returndata.episode.length; i++) {
            that.episode_data_map[returndata.episode[i].id] = i
          }
        })
      }
    )
    first_loadding.start()
  },
  methods: {
    save_character_data: function(characters) {
      if (sessionStorage.getItem('character_list') == null || sessionStorage.getItem('current_drama_id') != this.drama_id) {
        window.sessionStorage.setItem('character_list', JSON.stringify(characters))
        window.sessionStorage.setItem('current_drama_id', this.drama_id)
      }
    },
    show_delete: function(id) {
      if (id === -1) { return }
      this.need_to_delete = id
      this.delete_show = true
    },
    reset_from: function(item1, item2) {
      console.log(item1, item2)
      for (const i in item2) { item1[i] = item2[i] }
    },
    show_edit: function(id) {
      if (id === -1) {
        return
      }
      this.need_to_edit_id = id
      console.log(id, this.episode_data, this.episode_data_map)
      for (var key in this.episode_data[this.episode_data_map[id]]) {
        this.edit_episode[key] = this.episode_data[this.episode_data_map[id]][key]
      }
      this.edit_show = true
    },
    reset: function(item) {
      for (var i in item) { item[i] = '' }
    },
    encode: function(code) {
      return window.btoa(code)
    }
  }
}
</script>
<style scoped>
.el-button--primary,.el-button--primary:focus,.el-button--primary.is-active, .el-button--primary:active{background:  #009688;}

.el-button--primary:hover {
    background:  #009688;
    border-color: #009688;
    color: #FFF;
}

@media only screen and (max-width: 767px){
  .jumu_item{
    width:100%;
    height:150px;
  }
  .jumu_item::before{
    bottom:-90px;
    right:-20px;
  }
}
</style>
