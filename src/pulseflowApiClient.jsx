"use client";

import axios from "axios";

export const pfClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PULSEFLOW_API_URL,
    // headers: {
    //     "Content-Type": "application/json",
    // },
    withCredentials: true,
    });