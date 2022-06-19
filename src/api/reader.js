import { postRequest } from '@/utils/request'

export function pulldata(drama_id, episode_id) {
  return postRequest('/jeditor/api/episodeemelemtscene/' + drama_id + '/' + episode_id)
}

export function pullcontent(drama_id, episode_id, scene_id) {
  return postRequest('/jeditor/api/dialog/' + drama_id + '/' + episode_id + '/' + scene_id)
}

export function pullEpisodeRelation(drama_id, episode_id) {
  return postRequest('/jeditor/api/episoderelation/' + drama_id + '/' + episode_id)
}

export function pullAllElement(drama_id, episode_id) {
  return postRequest('/jeditor/api/episodeemelemt/' + drama_id + '/' + episode_id)
}

// 交互界面
export function pullElementContent(drama_id, episode_id, element_id) {
  return postRequest('/jeditor/api/element/' + drama_id + '/' + episode_id + '/' + element_id)
}

export function getStartNode(drama_id, episode_id) {
  return postRequest(`/reader/api/first_episode/${drama_id}/${episode_id}`)
}
export function getElementContent(drama_id, episode_id, element_id) {
  return postRequest(`/reader/api/read_one/${drama_id}/${episode_id}/${element_id}`)
}
export function getSceneContent(drama_id, episode_id, scene_id) {
  return postRequest(`/reader/api/read_one_scene/${drama_id}/${episode_id}/${scene_id}`)
}
