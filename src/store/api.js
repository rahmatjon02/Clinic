// store/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  endpoints: (builder) => ({
    // логин
    login: builder.mutation({
      query: ({ userName, password }) => ({
        url: "/users",
        method: "GET",
        params: { userName, password },
      }),
    }),

    // регистрация
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
    }),

    getDoctors: builder.query({ query: () => "/doctors" }),

    getDoctorById: builder.query({ query: (id) => `/doctors/${id}` }),

    getClinics: builder.query({ query: () => "/clinics" }),

    getClinicById: builder.query({ query: (id) => `/clinics/${id}` }),

    getAppointments: builder.query({ query: () => "/appointments" }),

    getSchedules: builder.query({ query: () => "/schedules" }),

    getServices: builder.query({ query: () => "/services" }),

    getFaq: builder.query({ query: () => "/faq" }),

    addAppointment: builder.mutation({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: newAppointment,
      }),
    }),

    getReviews: builder.query({ query: () => "/reviews" }),

    addReview: builder.mutation({
      query: (newReview) => ({
        url: "/reviews",
        method: "POST",
        body: newReview,
      }),
    }),

    getUsers: builder.query({
      query: () => "/users",
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetSchedulesQuery,
  useGetDoctorByIdQuery,
  useGetClinicsQuery,
  useGetClinicByIdQuery,
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
  useLoginMutation,
  useRegisterUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetFaqQuery,
  useGetServicesQuery,
} = api;
