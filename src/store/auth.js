import { defineStore } from "pinia";
import { ElMessage } from 'element-plus'
import http from "@/api/http";

export const useAuthStore = defineStore('authUser', {
    state: () => ({
        user: {},
        isLoading: false,
        isLoadingProfile:false,
        token: localStorage.getItem('token') || null,
    }),
    getters: {
     formatDate: (state) =>{
        return (dateValue) => {
            if (!dateValue) return 'N/A';
            const date = new Date(dateValue);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            }
        }
    },
    actions: {
        async fetchProfile() {
            if (!this.token) return;
            try {
                this.isLoadingProfile = true
                const res = await http.get('/profile');
                this.user = res.user;
            } catch (err) {
                ElMessage({
                    message:"something was wrong!!"
                })
                this.logout();
            } finally{
                this.isLoadingProfile = false
            }
        },
         async login(form,router){
            try {
                this.isLoading = false
                const res = await http.post('/login',form)
                const role = res?.user?.role_id
                if(role == 1){
                    ElMessage({
                        message: err.message || 'Access Restricted: Administrator Only',
                        type: 'error',
                    })
                    return
                }
                localStorage.setItem('token',res.token)
                this.token = res?.token
                this.user = res?.user
                router.push('/dashboard')
            }catch (err){
                ElMessage({
                    message: 'Login failed. Please try again.',
                    type: 'error',
                })
            }finally {
                this.isLoading = false
            }
        },

        logout() {
        this.user = {};
        this.token = null;
        localStorage.removeItem('token');
    }
    }
})

