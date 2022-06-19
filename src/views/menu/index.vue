<template>
  <div class="main_board app-container">
    <el-row type="flex" justify="center">
      <el-col class="center_main" :xs="24" :md="20">
        <!-- 搜索框 -->
        <div class="searchbar">
          <el-select
            v-model="searchcontent"
            class="search_input"
            filterable
            placeholder="请输入剧本名称"
            @keyup.enter.native="(searchcontent === ''?null:$router.push('/menu/e/'+encode(searchcontent)))"
          >
            <el-option
              v-for="item in jumu_data"
              :key="item.id"
              style="width: 100%;border-radius: 5px;margin: 5px;"
              :label="item.drama_name"
              :value="item.id"
            />
          </el-select>
          <div class="search_btn">
            <div class="btn" @click="(searchcontent===''?null:$router.push('/menu/e/'+encode(searchcontent)))">Search</div>
          </div>
        </div>
        <!-- 剧目板 -->
        <div class="item_board">
          <div v-for="drama in jumu_data" :key="drama.id" class="jumu_item" @dblclick="$router.push('/menu/e/'+encode(drama_id)+'/')">
            <div class="title" @click="$router.push('/menu/e/'+encode(drama.id)+'/')">{{ drama.drama_name }}</div>
            <div class="c_time">{{ drama.c_time }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import '../../assets/css/jeditor.css'
import '../../assets/css/base.css'
import { pulldata, createdata } from '@/api/menu.js'
const $ = require('jquery')
const Loadding = require('../../assets/js/loadding').default.Loadding
const base = require('../../assets/js/base').default

export default {
  data() {
    return {
      message: '',
      searchcontent: '',
      jumu_data: [],
      jumu_data_map: {},
      add_new_show: false,
      delete_show: false,
      edit_show: false,
      form_cover: false,
      need_to_delete_id: -1,
      new_drama: {
        'drama_name': '',
        'main_roles': '',
        'drama_theme': '',
        'drama_type': '',
        'drama_time': ''
      },
      edit_drama: {
        'id': '',
        'drama_name': '',
        'main_roles': '',
        'drama_theme': '',
        'drama_type': '',
        'drama_time': ''
      }
    }
  },
  mounted: function() {
    base.reset_rightboard_width()
    var that = this
    console.log(that)
    var first_loadding = new Loadding()
    first_loadding.add_title('初始化')
    first_loadding.__init__()
    first_loadding.add_process(
      '拉取数据',
      function() {
        pulldata('').then((returndata) => {
          console.log(returndata)
          that.jumu_data = returndata
          for (var i = 0; i < returndata.length; i++) {
            that.jumu_data_map[returndata[i].id] = i
          }
        })
      }
    )
    first_loadding.start()
  },
  methods: {
    reset: function(item) {
      for (const i in item) { item[i] = '' }
    },
    add_new: function() {
      var that = this
      var new_form = $('#new_form')
      var items = new_form.find('.item input')
      for (var i = 0; i < items.length; i++) {
        if (items[i].value.length === 0) {
          items[i].style.border = '2px dashed #E57373'
          setTimeout(function() {
            items[i].style.border = '0px dashed transparent'
          }, 1000)
          return
        }
      }
      var add_loadding = new Loadding()
      const param = that.new_drama
      add_loadding.add_title('新建剧目')
      add_loadding.__init__()
      add_loadding.add_process(
        '新建',
        function() {
          createdata(param).then(returndata => {
            that.jumu_data.push(returndata)
            that.jumu_data_map[returndata.id] = that.jumu_data.length - 1
            that.reset(that.new_drama)
          }).catch(() => {
            throw new Error('wrong create drama')
          })
        }
      )
      add_loadding.start(function() { that.add_new_show = false })
    },
    encode: function(code) {
      return window.btoa(code)
    }
  }
}
</script>

<style scoped>
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
