import { defineStore } from "pinia";
import api from "../lib/axios";

// This store is included for compatibility with TenantMailsPage (currentTenantId)
// and any router logic that checks isDevTenant / isDevCareboard.
// In the clinic portal context, isDevTenant and isDevCareboard are always false.
export const useAuthStore = defineStore("auth", {
    state: () => ({
        registerForm: {
            id: null,
            username: "",
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            role: "user",
            type: "",
            tenantId: "",
        },
        passwordConfirm: "",
        roleOptions: [
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
            { label: "Dev", value: "dev"},
        ],
        typeOptions: [
            { label: "Careboard", value: "careboard" },
            { label: "Tenant", value: "tenant" }
        ],
        isLoading: false,
        dialogVisible: false,
        loginForm: {
            username: "",
            password: "",
        },
        user: {
            id: null,
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            type: "",
        },
        users: [],
        token: null,
        isDevTenant: false,
        isDevCareboard: false,
        tenant: null,
        currentTenantId: localStorage.getItem("tenantId") || null,
        tenants: [],
        emails: [],
    }),
    getters: {
        isAdmin: (state) => state.user?.role === 'admin',
        isUser: (state) => state.user?.role === 'user'
    },
    actions: {
        async fetchTenant(id) {
            try {
                const res = await api.get(`/tenants/${id}`)
                this.tenant = res.data.data;
            } catch (error) {

            }
        },
        async fetchTenantUsers(id) {
            try {
                const res = await api.get(`/auth-tenant/${id}/users`)
                this.tenants = res.data.data;
            } catch (error) {

            }
        },
        logout() {
            this.token = null;
            this.user = { id: null, username: "", email: "", role: "", type: "" };
            this.currentTenantId = null;
            this.tenant = null;
            this.tenants = [];
            this.isDevTenant = false;
            this.isDevCareboard = false;

            localStorage.removeItem("token");
            localStorage.removeItem("tenantId");
        },
    }
});
