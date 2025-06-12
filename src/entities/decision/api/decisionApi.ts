// import { Decision, DecisionFormData } from "../model/types";

// const API_URL = "/api/decisions";

// export const decisionApi = {
//   async getAll(page: number = 1, pageSize: number = 10): Promise<Decision[]> {
//     const response = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch decisions");
//     }
//     return response.json();
//   },

//   async getById(id: string): Promise<Decision> {
//     const response = await fetch(`${API_URL}/${id}`);
//     if (!response.ok) {
//       throw new Error("Failed to fetch decision");
//     }
//     return response.json();
//   },

//   async create(data: DecisionFormData): Promise<Decision> {
//     const response = await fetch(API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to create decision");
//     }
//     return response.json();
//   },

//   async update(id: string, data: Partial<Decision>): Promise<Decision> {
//     const response = await fetch(`${API_URL}/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to update decision");
//     }
//     return response.json();
//   },

//   async delete(id: string): Promise<void> {
//     const response = await fetch(`${API_URL}/${id}`, {
//       method: "DELETE",
//     });
//     if (!response.ok) {
//       throw new Error("Failed to delete decision");
//     }
//   },
// }; 