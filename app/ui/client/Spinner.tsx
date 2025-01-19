"use client";

import React from 'react';
import { RingLoader } from "react-spinners";
export default function Spinner({
  size,
  style = {},
  // color = 'var(--blue)',
  color = 'white',
}: {
  size: number;
  style?: any;
  color?: any;
}) {
  <RingLoader color={color} loading={true}/>
}
