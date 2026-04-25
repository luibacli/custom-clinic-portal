import { defineStore } from 'pinia';
import api from '../lib/axios';
import resolveTenant from '../lib/resolveTenant';

export const useTenantStore = defineStore('tenants', {
  state: () => ({
    tenants: [],
    tenant: null,
    error: null,
    isLoading: false,
    dialogVisible: false,
    tenantResolved: false,
    tenantForm: {
      id: null,
      name: '',
      domain: '',
      status: '',
      tenantLogo: {
        url: "",
        publicId: "",
      }
    },
    statusOption: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }),

  actions: {
    async createTenant() {
      try {
        if (!this.tenantForm.name || !this.tenantForm.domain || !this.tenantForm.status) {
          throw new Error('All fields are required');
        }

        const { data } = await api.post('/tenants/create', this.tenantForm);
        this.tenants.push(data.data);
        this.resetTenantForm();
        this.dialogVisible = false;

        return {
          success: data.success,
          data: data.data,
          message: data.message
        };
      } catch (error) {
        console.error('Failed to create tenant', error);
        throw error;
      }
    },

    async updateTenant(id, payload) {
      try {
        const { data } = await api.put(`/tenants/${id}/update`, payload);

        if (!data?.success) {
          throw new Error('Failed to update tenant');
        }

        const index = this.tenants.findIndex(t => String(t._id) === String(id));
        if (index !== -1) this.tenants[index] = data.data;

        return {
          success: data.success,
          data: data.data,
          message: data.message
        };
      } catch (error) {
        console.error('Failed to update tenant', error);
        throw error;
      }
    },

    async uploadLogo(id, file) {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.patch(`/tenants/${id}/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      return res.data
    },

    async fetchTenants() {
      try {
        const { data } = await api.get('/tenants');
        this.tenants = data;
      } catch (error) {
        console.error('Error fetching tenants', error);
        throw error;
      }
    },

    resetTenantForm() {
      this.tenantForm = {
        id: null,
        name: '',
        domain: '',
        status: ''
      };
    },

    async initTenant() {
      try {
        this.isLoading = true;
        this.error = null;

        this.tenant = await resolveTenant();
        this.tenantResolved = true;
      } catch (error) {
        console.error('Failed to load tenant', error);
        this.tenant = null;
        this.error = error?.response?.data?.message || error.message;
        this.tenantResolved = true;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchTenant(id) {
      try {
        const res = await api.get(`/tenants/${id}`)
        return res.data;
      } catch (error) {
        console.error('Failed to fetch tenant', error.message);
      }
    },

    async deleteTenant(id) {
      try {
        const { data } = await api.delete(`/tenants/${id}`);
        this.tenants = this.tenants.filter(t => String(t._id) !== String(id));
        return { success: data.success, message: data.message };
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Failed to delete tenant' };
      }
    }
  }
});
