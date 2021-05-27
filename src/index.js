import React from 'react';
import ReactDOM from 'react-dom';
import Apollo from './Apollo';
import {BrowserRouter} from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
ReactDOM.render(
  <BrowserRouter>
      <Apollo />
  </BrowserRouter>,
  document.getElementById('root')
);
