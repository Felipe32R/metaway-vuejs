import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth',{
  state(){
    return{
      accessToken: localStorage.getItem('access_token') || '',
      signedIn: false,
      loggedUser: {id: 1, tipos: [], username: "" },
    }
  },
  actions: {
    setToken(value: string){
      this.accessToken = value
    },
    setSignedIn(value: boolean){
      this.signedIn = value
    },
    setLoggedUser(loggedUser: any){
      this.loggedUser = loggedUser
    }
  },
  getters: {
    getToken(state){
      return state.accessToken
    },
    isSignedIn(state){
      return state.signedIn
    },
    getLoggedUser(state){
      return state.loggedUser
    }
  }
})