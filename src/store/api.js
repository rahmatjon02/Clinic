// store/api.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  tagTypes: [
    "Users",
    "Doctors",
    "Appointments",
    "Schedules",
    "Services",
    "Reviews",
    "Faq",
  ],
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
      invalidatesTags: ["Users"],
    }),

    getDoctors: builder.query({
      query: () => "/doctors",
      providesTags: ["Doctors"],
    }),

    getDoctorById: builder.query({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: "Doctors", id }],
    }),

    getContact: builder.query({
      query: () => "/contact",
    }),

    getAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["Appointments"],
    }),

    addAppointment: builder.mutation({
      query: (newAppointment) => ({
        url: "/appointments",
        method: "POST",
        body: newAppointment,
      }),
      invalidatesTags: ["Appointments"],
    }),

    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointments"],
    }),

    getSchedules: builder.query({
      query: () => "/schedules",
      providesTags: ["Schedules"],
    }),

    getServices: builder.query({
      query: () => "/services",
      providesTags: ["Services"],
    }),

    getFaq: builder.query({
      query: () => "/faq",
      providesTags: ["Faq"],
    }),

    //-----------------------------

    getReviews: builder.query({
      query: () => "/reviews",
      providesTags: ["Reviews"],
    }),

    addReview: builder.mutation({
      query: (newReview) => ({
        url: "/reviews",
        method: "POST",
        body: newReview,
      }),
      invalidatesTags: ["Reviews"],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),

    updateReview: builder.mutation({
      query: (rev) => ({
        url: `/reviews/${rev.id}`,
        method: "Put",
        body: rev,
      }),
      invalidatesTags: ["Reviews"],
    }),

    //-----------------------------

    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    editProfile: builder.mutation({
      query: (user) => ({
        url: `/users/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetSchedulesQuery,
  useGetDoctorByIdQuery,
  useGetAppointmentsQuery,
  useAddAppointmentMutation,
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  useLoginMutation,
  useRegisterUserMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetFaqQuery,
  useGetServicesQuery,
  useGetContactQuery,
  useEditProfileMutation,
  useDeleteAppointmentMutation
} = api;
