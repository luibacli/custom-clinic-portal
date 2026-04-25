import { defineStore } from "pinia";
import api from "../lib/axios";

export const useEmailStore = defineStore('emails', {
    state: () => ({
        emails: null,
        inbox: [],
        loading: false,
        emailId: null,
        emailForm: {
            status: "pending"
        }
    }),
    actions: {
        async fetchEmails() {
            try {
                const res = await api.get('/email/inbox');
                this.emails = res.data
            } catch (error) {
                console.error({error: error.message})
            }
        },
        async fetchLinksByTenant(id) {
            try {
                const res = await api.get(`/email/${id}/links`)
                this.emails = res.data.emails;
            } catch (error) {
                console.error({ error: error.message });
            }
        },
        async updateEmail(id) {
            try {
                const updated = await api.put(`/email/${id}/email/update`, this.emailForm)
                if (!updated.data) {
                    console.error("Failed to update email")
                }
                return updated.data;
            } catch (error) {
                console.error("Update email error", error.message);
            }
        },
        async fetchInboxByAddress(address) {
            try {
                const data = await api.get(`email/emails/${address}`);
                if (!data) {
                    throw new Error("No emails found")
                }
                this.inbox = data.data || []
            } catch (error) {
                console.error("Failed to fetch emails by address", error.message)
            }
        },
        async markEmailAsRead(id) {
            try {
                const res = await api.patch(`/email/${id}/read`)
                return res.data
            } catch (error) {
                console.error("Mark as read error:", error)
                throw error
            }
        }
    }
})
