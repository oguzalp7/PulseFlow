"use client"

import React, { useState, useContext } from 'react'


const SensorCard = ({ sensor }) => {
    return (
        <div>
            <h1>{sensor.name}</h1>
            <p>{sensor.description}</p>
        </div>
    )
}