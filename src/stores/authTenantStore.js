import { defineStore } from "pinia";
import api from "../lib/axios";
import isTokenExpired from "../lib/token";
import router from "../router";

export const useAuthTenantStore = defineStore('authTenant', {
    state: () => ({
        registerForm: {
            tenantId: null,
            email: "",
            pin: "",
            firstName: "",
            middleName: "",
            lastName: "",
            birthday: "",
            phone: "",
            password: "",
            role: "patient",
        },
        userForm: {
            tenantId: null,
            username: "",
            email: "",
            pin: "",
            firstName: "",
            middleName: "",
            lastName: "",
            birthday: "",
            phone: "",
            password: "",
            role: "",
        },
        devForm: {
            username: "",
            email: "",
            firstName: "",
            middleName: "",
            lastName: "",
            birthday: "",
            password: "",
            role: "dev",
        },
        loginForm: {
            email: "",
            password: "",
        },
        user: {
            id: null,
            tenantId: null,
            email: "",
            pin: "",
            firstName: "",
            middleName: "",
            lastName: "",
            birthday: "",
            role: "",
            type: "",
        },
        passwordForm: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },

        tenantToken: localStorage.getItem("tenantToken") || null,
        tenant: null,
        tenants: [],
        dialogVisible: false,
        dialogRemoveVisible: false,
        isLoading: false,
        isPatient: localStorage.getItem("tenantRole") === "patient",
        isAdmin: localStorage.getItem("tenantRole") === "admin",
        isSuperAdmin: localStorage.getItem("tenantRole") === "superadmin",
        isDev: localStorage.getItem("tenantRole") === "dev",
        tenantId: localStorage.getItem("tenantId") || null

    }),
    getters: {
        roleOptions(state) {
            if (state.isDev || state.isSuperAdmin) {
                return [
                    { label: 'Admin',      value: 'admin'      },
                    { label: 'Superadmin', value: 'superadmin' },
                    { label: 'Patient',    value: 'patient'    },
                ];
            }
            // admin can only create/update patients within their tenant
            return [{ label: 'Patient', value: 'patient' }];
        },
    },
    actions: {
        async addUser() {
            try {
                if (this.userForm.role === 'superadmin') {
                    if (!this.userForm.email || !this.userForm.firstName || !this.userForm.lastName) {
                        throw new Error("Personal email, first name, and last name are required")
                    }
                } else {
                    if (!this.userForm.username || !this.userForm.firstName || !this.userForm.lastName) {
                        throw new Error("Username, first name, and last name are required")
                    }
                }

                const { data } = await api.post("auth-tenant/create", this.userForm);
                return {
                    success: data.success,
                    data: data.data,
                    generatedEmail: data.generatedEmail,
                    generatedPassword: data.generatedPassword,
                    message: data.message
                };

            } catch (error) {
                console.error({ message: error.message });

                return {
                    success: false,
                    message: error.response?.data?.message || error.message
                };
            }
        },
        async addDev() {
            try {
                if (!this.devForm.email || !this.devForm.firstName || !this.devForm.lastName) {
                    throw new Error("All Fields Are Required")
                }

                const { data } = await api.post("auth-tenant/create-dev", this.devForm);
                return {
                    success: data.success,
                    data: data.user,
                    message: data.message
                };

            } catch (error) {
                console.error({ message: error.message });

                return {
                    success: false,
                    message: error.response?.data?.message || error.message
                };
            }
        },
        async addUserPatient() {
            try {
                if (!this.registerForm.email || !this.registerForm.firstName || !this.registerForm.lastName) {
                    throw new Error("All Fields Are Required")
                }

                const { data } = await api.post("auth-tenant/create", this.registerForm);
                return {
                    success: data.success,
                    data: data.user,
                    message: data.message
                };

            } catch (error) {
                console.error({ message: error.message });

                return {
                    success: false,
                    message: error.response?.data?.message || error.message
                };
            }
        },
        async updateUser(id) {
            try {
                const { data } = await api.put(`/auth-tenant/${id}/user/update`, this.userForm);
                if (!data?.success) {
                    throw new Error("Failed to Update User")
                }
                const index = this.tenants.findIndex(u => u._id == id);
                if (index !== -1) { this.tenants[index] = data.user; }
                return { success: data.success, data: data.user, message: data.message };
            } catch (error) {
                console.error("Failed to update user", error);
                return { success: false, message: error.response?.data?.message || error.message || 'Failed to update user' };
            }
        },
        async updateDev(id) {
            try {
                const { data } = await api.put(`/auth-tenant/${id}/user/update-dev`, this.devForm);
                if (!data?.success) {
                    throw new Error("Failed to Update Developer")
                }
                const index = this.tenants.findIndex(u => u._id == id);
                if (index !== -1) { this.tenants[index] = data.user; }
                return { success: data.success, data: data.user, message: data.message };
            } catch (error) {
                console.error("Failed to update developer", error);
                return { success: false, message: error.response?.data?.message || error.message || 'Failed to update developer' };
            }
        },
        async uploadPhoto(id, file) {
            const formData = new FormData();
            formData.append("image", file);

            const res = await api.patch(`/auth-tenant/${id}/photo`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return res.data;
        },
        setTenantId() {
            this.registerForm.tenantId = localStorage.getItem("tenantId") || null;
        },
        checkToken() {
            if (!this.tenantToken) {
                return false;
            }
            if (isTokenExpired(this.tenantToken)) {
                this.logout();
                return false;
            }
            return true;
        },
        async login(isTenant = false, tenantId = null) {
            try {
                const res = await api.post("/auth-tenant/login", this.loginForm);

                this.tenantToken = res.data.token;

                if (!this.tenantToken) {
                return { success: false, message: "No token received" };
                }

                localStorage.setItem("tenantToken", this.tenantToken);

                const validate = await this.fetchUserTenant(isTenant, tenantId);

                if (!validate?.success) {
                localStorage.removeItem("tenantToken");
                this.tenantToken = null;
        
                return {
                    success: false,
                    message: validate?.message || "User validation failed"
                };
                }

                return {
                success: true,
                message: res.data.message,
                role: validate.data.role
                };
            } catch (error) {
                return {
                success: false,
                message: error.response?.data?.message || error.message || "Login failed"
                };
            }
        },
        async fetchUserTenant(isTenant = false, tenantId = null) {
            try {
                const token = localStorage.getItem("tenantToken");
                if (!token) throw new Error("No token found");

                const response = await api.get("/auth-tenant/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
                });

                if (isTenant === true && tenantId !== null) {
                if (response.data.tenantId !== tenantId) {
                    return {
                    success: false,
                    message: "Invalid credentials"
                    };
                }
                }

                if (response.data.tenantId !== null) {
                localStorage.setItem("tenantId", response.data.tenantId);
                }

                this.isPatient = response.data.role === "patient";
                this.isAdmin = response.data.role === "admin";
                this.isSuperAdmin = response.data.role === "superadmin";
                this.isDev = response.data.role === "dev";

                if(tenantId) {
                    await this.fetchTenant(tenantId);
                };
                localStorage.setItem("tenantRole", response.data.role);
                if (response.data.email) {
                  localStorage.setItem("userEmail", response.data.email);
                }

                return {
                success: true,
                data: response.data
                };
            } catch (error) {
                console.error("Failed to fetch user data", error);
                return {
                success: false,
                message: error.response?.data?.message || error.message || "Failed to fetch user"
                };
            }
        },
        async fetchTenant(id) {
            if (!id) return;
            try {
                const res = await api.get(`/tenants/${id}`)
                this.tenant = res.data.data;
            } catch (error) {
                console.error('Failed to fetch tenant', error.message);
            }
        },
        async fetchTenantUsers(id, search = '') {
            try {
                const params = search ? { params: { search } } : {};
                const res = await api.get(`/auth-tenant/${id}/users`, params);
                return res.data;
            } catch (error) {
                console.error("Failed to fetch tenant users", error.message);
            }
        },
        async fetchLinksByTenant(id) {
            try {
                const res = await api.get(`/email/${id}/links`)
                this.emails = res.data.emails;
            } catch (error) {
                console.error('Failed to fetch email links', error.message);
            }
        },
        async fetchAllUsers({ page = 1, limit = 20, search = '', role = '', tenantId = '' } = {}) {
            try {
                const params = { page, limit };
                if (search)   params.search   = search;
                if (role)     params.role      = role;
                if (tenantId) params.tenantId  = tenantId;
                const res = await api.get('/auth-tenant/users/all', { params });
                return res.data;
            } catch (error) {
                console.error('Failed to fetch all users', error.message);
                return { success: false, data: [], total: 0, page: 1, pages: 1 };
            }
        },
        async fetchActivityLogs(tenantId, limit = 20) {
            try {
                const res = await api.get(`/auth-tenant/${tenantId}/activity-logs`, { params: { limit } });
                return res.data;
            } catch (error) {
                console.error('Failed to fetch activity logs', error.message);
                return { success: false, data: [] };
            }
        },
        async toggleUserStatus(id) {
            try {
                const { data } = await api.patch(`/auth-tenant/${id}/toggle-status`);
                return { success: data.success, data: data.data, message: data.message };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Failed to toggle status' };
            }
        },
        async removeUserTenant(id) {
            try {
                await api.delete(`/auth-tenant/${id}/delete`)
                return {
                    success: true
                }
            } catch (error) {
                return {
                    success: false,
                    message: error.response?.data?.message || "Failed to delete user tenant"
                }
            }
        },
        async forgotPassword(email) {
            try {
                const { data } = await api.post('/auth-tenant/forgot-password', { email });
                return { success: true, message: data.message };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Failed to send reset email' };
            }
        },
        async resetPassword(token, newPassword, confirmPassword) {
            try {
                const { data } = await api.post('/auth-tenant/reset-password', { token, newPassword, confirmPassword });
                return { success: true, message: data.message };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || 'Failed to reset password' };
            }
        },
        async handleChangePassword() {
        try {
            const res = await api.patch("/auth-tenant/change-password", this.passwordForm);

            return {
            success: true,
            message: res.data.message || "Password changed successfully"
            };
        } catch (error) {
            return {
            success: false,
            message: error.response?.data?.message || "Failed to change password"
            };
        }
        },
        iAuthenticated() {
            try {
                const token = localStorage.getItem("tenantToken");
                if (!token) return false
                if (isTokenExpired(token)) {
                    this.logout();
                    return false;
                }
                return true
            } catch (error) {
                console.error('Authentication check failed', error.message);
                return false;
            }
        },
        resetRegisterForm() {
            this.registerForm.email = "";
            this.registerForm.pin = "";
            this.registerForm.firstName = "";
            this.registerForm.middleName = "";
            this.registerForm.lastName = "";
            this.registerForm.birthday = "";
            this.registerForm.phone = "";
        },
        resetUserForm() {
            this.userForm.tenantId = null;
            this.userForm.username = "";
            this.userForm.email = "";
            this.userForm.pin = "";
            this.userForm.firstName = "";
            this.userForm.middleName = "";
            this.userForm.lastName = "";
            this.userForm.birthday = "";
            this.userForm.phone = "";
            this.userForm.password = "";
            this.userForm.role = "";
        },
        resetPasswordForm() {
            this.passwordForm.currentPassword = "";
            this.passwordForm.newPassword = "";
            this.passwordForm.confirmPassword = "";
        },
        async registerClinic({ clinicName, domain, ownerEmail, ownerFirstName, ownerLastName, ownerPassword }) {
            try {
                const { data } = await api.post('/tenants/register', {
                    clinicName, domain, ownerEmail, ownerFirstName, ownerLastName, ownerPassword,
                });

                this.tenantToken = data.token;
                this.tenantId    = data.tenant.id;
                this.isSuperAdmin = true;
                this.isAdmin      = false;
                this.isPatient    = false;
                this.isDev        = false;

                localStorage.setItem('tenantToken', data.token);
                localStorage.setItem('tenantRole',  'superadmin');
                localStorage.setItem('tenantId',    data.tenant.id);

                return { success: true, data };
            } catch (error) {
                return {
                    success: false,
                    message: error.response?.data?.message || 'Registration failed',
                };
            }
        },
        logout() {
            this.tenantToken = null;
            this.tenantId = null;
            this.isPatient = false;
            this.isAdmin = false;
            this.isSuperAdmin = false;
            this.isDev = false;

            localStorage.removeItem("tenantToken");
            localStorage.removeItem("token");
            localStorage.removeItem("tenantId");
            localStorage.removeItem("tenantRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("notif_appt_statuses");
        }
    }
})
