import { api } from "@/lib/api";
import { unwrapResponse } from "./request.service";

export interface AdminDocument {
  id: number;
  title: string;
  originalFileName: string;
  objectKey: string;
  mimeType: string;
  size: number;
  status: boolean;
  uploadedAt: string;
  updatedAt: string;
}

export interface DocumentViewUrl {
  url: string;
  expiresInSeconds: number;
}

export const documentApi = {
  async getDocuments(search?: string): Promise<AdminDocument[]> {
    const response = await api.get("/documents", {
      params: {
        search: search?.trim() || undefined,
      },
    });

    return unwrapResponse<AdminDocument[]>(response);
  },

  async uploadDocument(title: string, file: File): Promise<AdminDocument> {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    const response = await api.post("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return unwrapResponse<AdminDocument>(response);
  },

  async updateTitle(id: number, title: string): Promise<AdminDocument> {
    const response = await api.patch(`/documents/${id}`, { title });
    return unwrapResponse<AdminDocument>(response);
  },

  async deleteDocument(id: number): Promise<AdminDocument> {
    const response = await api.delete(`/documents/${id}`);
    return unwrapResponse<AdminDocument>(response);
  },

  async getViewUrl(id: number): Promise<DocumentViewUrl> {
    const response = await api.get(`/documents/${id}/view-url`);
    return unwrapResponse<DocumentViewUrl>(response);
  },
};
