import { postRequest, postDataFormRequest, postJsonRequest, getRequest } from '@/utils/request'

export function login(data) {
  return postJsonRequest('/user/login', data)
}

export function logout() {
  return getRequest('/user/logout')
}
