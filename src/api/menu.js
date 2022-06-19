import { postRequest, postDataFormRequest, postJsonRequest, getRequest } from '@/utils/request'

// 剧目数据
export function pulldata(data) {
  return postRequest("/jeditor/api/drama", data)
}

// export function renewdata(id,data) {
//     return postJsonRequest("/jeditor/api/updatedrama/"+id , data)
// }

// export function deletedata(id,data) {
//     return postRequest("/jeditor/api/deletedrama/"+id, data)
// }

// export function createdata(data) {
//     return postJsonRequest("/jeditor/api/createdrama", data)
// }

// 场数据
export function PullChangData(drama_id) {
    return postRequest("/jeditor/api/all_scene/"+ drama_id)
}
export function PullSceneData(drama_id, episode_id, scene_id) {
  return postRequest(`/reader/api/read_one_scene/${drama_id}/${episode_id}/${scene_id}`)
}
// export function CreateChang(drama_id,data){
//     return postJsonRequest("/jeditor/api/createepisodescene/"+drama_id+"/-1",data)
// }

// export function UpdateChang(data){
//     return postJsonRequest("/jeditor/api/update_scene_episode",data)
// }

// 剧集数据
export function PullJiData(drama_id,data){
    return postRequest("/jeditor/api/episode/"+ drama_id, data)
}

// export function CreateJi(drama_id,data){
//     return postJsonRequest("/jeditor/api/createepisode/" + drama_id,data)
// }

// export function DeleteJi( drama_id , id , data ){
//     return postRequest("/jeditor/api/deleteepisode/"+ drama_id + "/" + id ,data)
// }