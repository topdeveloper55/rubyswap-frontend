import React, { lazy, useEffect } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@twinkykms/rubyswap-uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import history from './routerHistory'
// Views included in the main bundle
import Pools from './views/Pools'
import Swap from './views/Swap'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'
import { useAnalytics } from 'utils/GoogleAnalytics'
import { Wrapper } from 'components/Wrapper'
// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const Farms = lazy(() => import('./views/Farms'))
const FarmAuction = lazy(() => import('./views/FarmAuction'))
const Lottery = lazy(() => import('./views/Lottery'))
const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import('./views/NotFound'))
const Collectibles = lazy(() => import('./views/Collectibles'))
const Teams = lazy(() => import('./views/Teams'))
const Team = lazy(() => import('./views/Teams/Team'))
const Profile = lazy(() => import('./views/Profile'))
const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
const Predictions = lazy(() => import('./views/Predictions'))
const Voting = lazy(() => import('./views/Voting'))
const Proposal = lazy(() => import('./views/Voting/Proposal'))
const CreateProposal = lazy(() => import('./views/Voting/CreateProposal'))
const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const Liquidity = lazy(() => import('./views/Pool'))
const PoolFinder = lazy(() => import('./views/PoolFinder'))
const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))
const Tutorials = lazy(() => import ('./views/Tutorials'))
const TFTH = lazy(() => import("./views/2f2h"))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const IconChanger = () => {
  // var menu = document.getElementsByTagName("a[href='/tutorials']")
  const menu = document.querySelector("a[href='/tutorials']")
  const icon = menu?.querySelector("svg")
  if(icon)
    icon.outerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="24" height="24" style="margin-right:8px;min-width:24px"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#fd7fa0"><path d="M85.57,24.08c-0.37625,0.05375 -0.73906,0.16125 -1.075,0.3225l-82.56,41.28c-1.20937,0.56438 -1.98875,1.78719 -1.98875,3.1175c0,1.33031 0.77938,2.55313 1.98875,3.1175l11.825,5.9125v50.095c-3.9775,1.43781 -6.88,5.22719 -6.88,9.675c0,1.98875 0.67188,3.50719 1.3975,5.16c0.72563,1.65281 1.57219,3.27875 2.4725,4.8375c1.80063,3.10406 3.655,5.6975 3.655,5.6975l2.795,4.085l2.795,-4.085c0,0 1.85438,-2.59344 3.655,-5.6975c0.90031,-1.55875 1.74688,-3.18469 2.4725,-4.8375c0.72563,-1.65281 1.3975,-3.17125 1.3975,-5.16c0,-4.44781 -2.9025,-8.23719 -6.88,-9.675v-46.655l13.76,6.88v11.61c0,2.09625 1.38406,3.42656 2.4725,4.1925c1.08844,0.76594 2.2575,1.24969 3.655,1.72c2.795,0.94063 6.49031,1.72 10.965,2.365c8.96281,1.27656 21.07,2.0425 34.5075,2.0425c13.4375,0 25.54469,-0.76594 34.5075,-2.0425c4.47469,-0.645 8.17,-1.42437 10.965,-2.365c1.3975,-0.47031 2.56656,-0.95406 3.655,-1.72c1.08844,-0.76594 2.4725,-2.09625 2.4725,-4.1925v-11.61l32.465,-16.2325c1.20938,-0.56437 1.98875,-1.78719 1.98875,-3.1175c0,-1.33031 -0.77937,-2.55312 -1.98875,-3.1175l-82.56,-41.28c-0.60469,-0.29562 -1.27656,-0.40312 -1.935,-0.3225zM86,31.39l74.82,37.41l-23.22,11.61v-4.73c0,-2.10969 -1.38406,-3.44 -2.4725,-4.1925c-1.08844,-0.7525 -2.2575,-1.24969 -3.655,-1.72c-2.80844,-0.94062 -6.47687,-1.72 -10.965,-2.365c-8.97625,-1.27656 -21.12375,-2.0425 -34.5075,-2.0425c-13.38375,0 -25.53125,0.76594 -34.5075,2.0425c-4.48812,0.645 -8.15656,1.42438 -10.965,2.365c-1.3975,0.47031 -2.56656,0.9675 -3.655,1.72c-1.08844,0.7525 -2.4725,2.08281 -2.4725,4.1925v4.73l-23.22,-11.61zM86,72.24c13.115,0 25.0475,0.72563 33.54,1.935c4.24625,0.60469 7.59219,1.34375 9.675,2.0425c0.76594,0.25531 1.16906,0.47031 1.505,0.645v16.77c-2.70094,-0.84656 -6.08719,-1.55875 -10.2125,-2.15c-8.96281,-1.27656 -21.07,-2.0425 -34.5075,-2.0425c-13.4375,0 -25.54469,0.76594 -34.5075,2.0425c-4.12531,0.59125 -7.51156,1.30344 -10.2125,2.15v-16.77c0.33594,-0.17469 0.73906,-0.38969 1.505,-0.645c2.08281,-0.69875 5.42875,-1.43781 9.675,-2.0425c8.4925,-1.20937 20.425,-1.935 33.54,-1.935zM86,96.32c13.16875,0 25.06094,0.72563 33.54,1.935c3.1175,0.44344 5.18688,0.98094 7.2025,1.505c-2.01562,0.52406 -4.085,1.06156 -7.2025,1.505c-8.47906,1.20938 -20.37125,1.935 -33.54,1.935c-13.16875,0 -25.06094,-0.72562 -33.54,-1.935c-3.1175,-0.44344 -5.18687,-0.98094 -7.2025,-1.505c2.01563,-0.52406 4.085,-1.06156 7.2025,-1.505c8.47906,-1.20937 20.37125,-1.935 33.54,-1.935zM17.2,134.16c1.90813,0 3.44,1.53188 3.44,3.44c0,-0.09406 -0.18812,1.08844 -0.7525,2.365c-0.56437,1.27656 -1.43781,2.78156 -2.2575,4.1925c-0.22844,0.40313 -0.20156,0.37625 -0.43,0.7525c-0.22844,-0.37625 -0.20156,-0.34937 -0.43,-0.7525c-0.81969,-1.41094 -1.69312,-2.91594 -2.2575,-4.1925c-0.56437,-1.27656 -0.7525,-2.45906 -0.7525,-2.365c0,-1.90812 1.53188,-3.44 3.44,-3.44z"></path></g></g></svg>
      `
  const menu2f2h = document.querySelector("a[href='/2f2h']")
  const icon2f2h = menu2f2h?.querySelector("svg")
  if(icon2f2h)
    icon2f2h.outerHTML = `
      <svg id="Layer_1" width="24" height="24" style="margin-right:8px;min-width:24px" data-name="Layer 1" fill="#fd7fa0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.03 25"><defs><style>.cls-1{fill: rgba(0,0,0,0);}.cls-2{fill:#fd7fa0;}</style></defs><title>bitcoin</title><path d="M10.8,5.65l1.61-2.91a.48.48,0,0,1,.42-.24h.37a.47.47,0,0,1,.17,0,5.16,5.16,0,0,1,2.24,1.35.33.33,0,0,1,0,.37l-1.85,3-3-1.37Z" transform="translate(-5.99 -2.5)"/><path class="cls-1" d="M21.24,15.25a1.62,1.62,0,0,1,0,.22,6,6,0,1,1-9.59-5l.07-.05a3.92,3.92,0,0,0,2.76.43A2.22,2.22,0,0,0,16,9.31l.42.07a6,6,0,0,1-.25,1.33l.07.07.84-1.24.43.15-1.41,1.9a.29.29,0,0,0,0,.31A5.9,5.9,0,0,0,18,13.65a.28.28,0,0,0,.34-.06l1.74-1.93c.09.13.18.26.26.39l-1.72,1.89a.18.18,0,0,0,0,.17,2.62,2.62,0,0,0,1.38,1.52.19.19,0,0,0,.22,0l1.06-.95A5.68,5.68,0,0,1,21.24,15.25Z" transform="translate(-5.99 -2.5)"/><path d="M23.26,13.37l-2,2.09h0a6,6,0,1,1-9.59-5l.07-.05a3.92,3.92,0,0,0,2.76.43A2.22,2.22,0,0,0,16,9.31,1.57,1.57,0,0,0,16,9a.26.26,0,0,0-.15-.28L10.53,6.2a.67.67,0,0,0-.31-.07h-.1a.72.72,0,0,0-.6.32L6.09,11.63A.56.56,0,0,0,6,12v.43a.54.54,0,0,0,.11.35l5.42,7.73-1,7h9.75v-6L22.94,16A4.6,4.6,0,0,0,23.26,13.37Zm-6.57,9.28-.64,3.57-.14-3.69-1.25-1.26a4.58,4.58,0,0,0,3.34.42Z" transform="translate(-5.99 -2.5)"/><path d="M19.27,6.27,17.05,9.54l-.84,1.24-.07-.07a6,6,0,0,0,.25-1.33,1.13,1.13,0,0,0,0-.26,1.07,1.07,0,0,0-.76-.94c-.09-.06-1.43-.74-1.43-.74l1.94-3.18a.35.35,0,0,1,.28-.15,3.66,3.66,0,0,1,2,.95,3.74,3.74,0,0,1,.86.87A.32.32,0,0,1,19.27,6.27Z" transform="translate(-5.99 -2.5)"/><path d="M24,11.89v0a.51.51,0,0,1-.16.37l-2.64,2.37-1.06.95a.19.19,0,0,1-.22,0,2.62,2.62,0,0,1-1.38-1.52.18.18,0,0,1,0-.17l1.72-1.89L22.19,10a.24.24,0,0,1,.27-.07,1,1,0,0,1,.16.09A4.69,4.69,0,0,1,24,11.65.53.53,0,0,1,24,11.89Z" transform="translate(-5.99 -2.5)"/><path class="cls-2" d="M17.63,17.58l-.31-7.23c0-.08-.05-.1-.1,0l-5.3,4.95a.24.24,0,0,0-.06.23l1.56,4a.12.12,0,0,0,.17.08l3.91-1.83A.22.22,0,0,0,17.63,17.58Zm-1.51-.27-2,1a.12.12,0,0,1-.17-.07l-.79-2.1a.21.21,0,0,1,0-.23L16,13.25c.06-.06.11,0,.11,0l.15,3.82A.21.21,0,0,1,16.12,17.31Z" transform="translate(-5.99 -2.5)"/><path class="cls-2" d="M15.86,16.93l-.11-2.8c0-.05,0-.06-.07,0l-2,1.92a.15.15,0,0,0,0,.13l.59,1.55a.08.08,0,0,0,.11,0l1.49-.69A.17.17,0,0,0,15.86,16.93Zm-.61-.07-.75.36a.08.08,0,0,1-.11,0l-.29-.77a.14.14,0,0,1,0-.14l1.06-1s.06,0,.07,0l.05,1.45A.16.16,0,0,1,15.25,16.86Z" transform="translate(-5.99 -2.5)"/><path d="M22.16,9.32l-2.11,2.34-1.74,1.93a.28.28,0,0,1-.34.06,5.9,5.9,0,0,1-1.91-1.75.29.29,0,0,1,0-.31l1.41-1.9,2.06-2.78a.34.34,0,0,1,.39-.11,4.33,4.33,0,0,1,1.37,1A4.22,4.22,0,0,1,22.22,9,.34.34,0,0,1,22.16,9.32Z" transform="translate(-5.99 -2.5)"/></svg>
    `
  const menuNft = document.querySelector("a[href='/nft']")
  const iconNft = menuNft?.querySelector("svg")
  if(iconNft)
    iconNft.outerHTML = `
    <svg width="24" height="24" viewBox="-1725.682 -984.799 1776.055 2486.893" style="margin-right:8px;min-width:24px" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clipPath18" clipPathUnits="userSpaceOnUse">
          <path id="path16" d="M 0,2516 H 4000 V 0 H 0 Z"/>
        </clipPath>
      </defs>
      <g transform="matrix(1.333333, 0, 0, -1.333333, -3504.320121, 1935.980376)" id="g10">
        <g id="g12">
          <g clip-path="url(#clipPath18)" id="g14">
            <g transform="translate(2083.1792,1850.7896)" id="g20">
              <path id="path22" style="fill:#fd7fa0;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c -5.017,-0.15 -9.988,-0.467 -14.974,-1.338 -21.747,-3.802 -43.535,-7.369 -65.308,-11.023 -25.401,-4.264 -50.806,-8.502 -76.201,-12.801 -25.725,-4.355 -51.432,-8.815 -77.16,-13.147 -29.687,-4.998 -59.394,-9.875 -89.083,-14.862 -30.678,-5.154 -61.348,-10.351 -92.013,-15.585 -10.878,-1.857 -21.853,-3.358 -32.57,-5.915 -38.964,-9.295 -64.326,-48.376 -57.398,-87.851 1.041,-5.931 1.993,-11.878 2.986,-17.817 1.62,-9.687 5.039,-18.704 10.05,-27.139 16.096,-27.091 48.922,-41.473 77.002,-36.541 23.061,4.05 46.2,7.652 69.292,11.528 29.688,4.982 59.363,10.043 89.046,15.063 30.342,5.132 60.685,10.265 91.03,15.38 29.355,4.948 58.716,9.864 88.071,14.815 31.665,5.342 63.376,10.432 94.977,16.129 44.102,7.952 68.767,51.387 61.952,87.301 -1.122,5.913 -1.823,11.905 -2.791,17.849 C 69.745,-22.012 31.829,1.063 0,0 m -310.628,-927.637 c 4.667,0.387 9.389,0.444 13.993,1.212 47.509,7.93 95.003,15.95 142.493,23.993 45.84,7.764 91.663,15.635 137.51,23.366 49.145,8.287 98.33,16.337 147.457,24.731 41.628,7.113 65.956,43.227 65,77.768 -0.317,11.46 -2.68,22.616 -5.062,33.691 -4.181,19.44 -14.778,35.011 -31.187,46.367 -18.609,12.879 -39.104,16.209 -61.256,12.329 -39.537,-6.925 -79.147,-13.432 -118.726,-20.112 -47.494,-8.015 -94.992,-16.003 -142.481,-24.049 -54.085,-9.164 -108.096,-18.788 -162.262,-27.442 -44.763,-7.152 -71.768,-50.715 -64.489,-88.226 1.146,-5.907 1.801,-11.907 2.792,-17.846 7.177,-43.013 44.228,-66.391 76.218,-65.782 m -101.652,639.041 c 0.386,-3.014 2.007,-3.776 3.204,-4.845 7.534,-6.72 14.052,-14.342 20.052,-22.432 15.276,-20.596 26.574,-43.326 35.93,-67.089 11.934,-30.31 20.006,-61.703 26.166,-93.63 4.378,-22.693 7.698,-45.56 9.488,-68.578 1.764,-22.694 2.197,-45.461 0.807,-68.238 -1.043,-17.085 -3.311,-33.972 -7.154,-50.633 -3.621,-15.698 -8.442,-30.996 -16.341,-45.165 -0.64,-1.147 -1.346,-2.529 -0.134,-3.546 0.612,-0.515 1.895,-0.487 2.816,-0.338 11.56,1.869 23.115,3.77 34.66,5.731 37.929,6.443 75.844,12.968 113.781,19.362 41.569,7.005 83.161,13.87 124.733,20.853 47.18,7.925 94.35,15.907 141.52,23.889 2.856,0.484 5.84,0.738 8.519,2.946 -0.633,1.35 -1.051,2.607 -1.753,3.679 -19.2,29.349 -32.92,61.278 -44.167,94.333 -11.235,33.021 -19.094,66.899 -24.752,101.288 -3.914,23.792 -6.645,47.751 -7.959,71.816 -1.516,27.769 -1.487,55.588 -0.028,83.363 0.843,16.034 2.424,32.034 5.042,47.903 0.762,4.62 1.541,9.238 2.302,13.859 1.101,6.68 0.304,7.444 -6.789,6.448 -1.324,-0.185 -2.629,-0.508 -3.948,-0.732 -13.853,-2.355 -27.706,-4.708 -41.562,-7.051 -26.059,-4.408 -52.119,-8.812 -78.179,-13.212 -29.359,-4.957 -58.72,-9.906 -88.08,-14.861 -26.39,-4.455 -52.777,-8.929 -79.17,-13.368 -25.734,-4.329 -51.475,-8.609 -77.207,-12.941 -17.117,-2.882 -34.224,-5.82 -51.797,-8.811 m 703.544,-118.633 c 3.296,-3.15 6.686,-3.789 9.751,-5.013 39.897,-15.932 78.521,-34.378 114.617,-57.837 33.638,-21.861 64.064,-47.383 89.55,-78.548 31.271,-38.238 52.315,-81.57 64.358,-129.354 5.077,-20.15 8.344,-40.608 10.649,-61.279 1.899,-17.028 2.495,-34.115 2.633,-51.154 0.416,-51.212 -5.726,-101.526 -22.806,-150.166 -21.838,-62.188 -58.234,-114.215 -108.524,-156.667 -39.318,-33.19 -83.664,-57.797 -131.305,-76.677 -42.147,-16.702 -85.741,-28.369 -130.271,-36.723 -27.004,-5.066 -54.191,-8.838 -81.512,-11.467 -34.353,-3.305 -68.808,-4.935 -103.342,-4.928 -247.61,0.048 -495.221,0.021 -742.831,0.034 -12.503,0 -11.398,-1.032 -11.399,11.287 -0.015,167.53 -0.019,335.061 0.006,502.592 0.002,13.099 -1.297,10.716 11.096,12.882 47.472,8.3 95.015,16.193 142.542,24.18 49.508,8.319 99.038,16.505 148.536,24.874 37.773,6.386 65.051,32.648 72.752,69.8 2.065,9.961 2.039,20.049 0.442,29.999 -4.402,27.425 -9.091,54.806 -13.813,82.178 -7.399,42.884 -39.868,66.299 -69.623,71.781 -9.345,1.723 -18.685,1.799 -28.012,0.706 -26.928,-3.155 -53.83,-6.532 -80.736,-9.87 -29.896,-3.709 -59.78,-7.52 -89.681,-11.19 -19.271,-2.365 -38.568,-4.522 -57.846,-6.838 -7.974,-0.958 -15.922,-2.14 -23.896,-3.113 -2.981,-0.364 -5.997,-0.507 -9.002,-0.59 -1.516,-0.042 -2.481,0.995 -2.551,2.472 -0.159,3.343 -0.216,6.693 -0.216,10.04 -0.01,136.035 -0.008,272.07 -0.008,408.105 0,111.576 -0.003,223.151 0.01,334.727 0,3.345 0.086,6.694 0.258,10.035 0.078,1.513 1.151,2.416 2.616,2.487 3.341,0.162 6.69,0.248 10.035,0.248 77.734,0.013 155.469,0.01 233.203,0.01 157.814,0 315.628,0.009 473.442,-0.016 13.401,-0.003 26.814,0.073 40.202,-0.415 64.163,-2.341 127.356,-10.947 188.934,-29.769 43.78,-13.381 85.407,-31.506 124.04,-56.224 50.202,-32.118 91.592,-72.898 121.863,-124.508 22.265,-37.961 36.547,-78.798 44.09,-122.131 5.836,-33.526 7.101,-67.286 5.413,-101.13 -2.321,-46.525 -11.711,-91.562 -30.739,-134.334 -21.496,-48.321 -53.328,-88.814 -93.283,-123.133 -21.403,-18.384 -44.43,-34.505 -68.764,-48.771 -3.449,-2.022 -6.84,-4.142 -10.878,-6.592"/>
            </g>
            <g transform="translate(1918.056,325.4391)" id="g24">
              <path id="path26" style="fill:#fd7fa0;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c -144.03,0 -288.061,-0.008 -432.091,0.012 -14.804,0.002 -13.055,-1.378 -13.079,12.659 -0.058,34.836 -0.36,69.676 0.107,104.505 0.328,24.445 12.502,41.788 34.57,52.087 6.728,3.141 13.955,4.651 21.431,4.701 3.014,0.02 6.029,0.024 9.043,0.024 253.896,0.001 507.791,0.005 761.687,-0.026 5.346,-10e-4 10.784,0.152 16.023,-0.712 28.654,-4.724 48.197,-27.299 48.999,-56.405 0.24,-8.702 0.045,-17.417 0.045,-26.125 C 446.736,63.588 446.76,36.457 446.722,9.326 446.709,0.094 446.637,0.017 437.116,0.013 378.164,-0.012 319.212,0 260.26,0 Z"/>
            </g>
            <g transform="translate(1670.8989,1562.1937)" id="g28">
              <path id="path30" style="fill:#ffffff00;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 17.573,2.991 34.681,5.928 51.797,8.81 25.732,4.333 51.474,8.613 77.207,12.941 26.393,4.44 52.78,8.914 79.171,13.368 29.359,4.956 58.72,9.905 88.079,14.862 26.061,4.4 52.121,8.804 78.18,13.212 13.855,2.343 27.708,4.696 41.561,7.05 1.32,0.225 2.624,0.548 3.948,0.733 7.093,0.995 7.89,0.232 6.79,-6.448 -0.761,-4.621 -1.541,-9.239 -2.303,-13.86 C 421.812,34.8 420.231,18.8 419.389,2.766 c -1.46,-27.776 -1.489,-55.594 0.028,-83.363 1.313,-24.065 4.044,-48.024 7.959,-71.816 5.658,-34.389 13.517,-68.268 24.752,-101.288 11.247,-33.055 24.966,-64.984 44.167,-94.333 0.701,-1.072 1.119,-2.33 1.753,-3.68 -2.68,-2.207 -5.664,-2.461 -8.519,-2.945 -47.171,-7.982 -94.341,-15.964 -141.521,-23.889 -41.572,-6.983 -83.164,-13.848 -124.732,-20.854 -37.937,-6.394 -75.853,-12.918 -113.782,-19.361 -11.544,-1.962 -23.1,-3.862 -34.66,-5.731 -0.92,-0.149 -2.203,-0.177 -2.816,0.337 -1.212,1.018 -0.506,2.4 0.134,3.547 7.899,14.169 12.72,29.467 16.341,45.165 3.843,16.66 6.111,33.548 7.154,50.633 1.39,22.777 0.957,45.544 -0.807,68.237 -1.79,23.019 -5.109,45.886 -9.488,68.579 -6.159,31.927 -14.232,63.32 -26.166,93.63 -9.356,23.763 -20.653,46.493 -35.929,67.089 -6,8.09 -12.518,15.712 -20.052,22.432 C 2.007,-3.776 0.386,-3.015 0,0"/>
            </g>
            <g transform="translate(1772.551,923.1521)" id="g32">
              <path id="path34" style="fill:#ffffff00;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c -31.99,-0.609 -69.041,22.769 -76.218,65.782 -0.991,5.939 -1.646,11.94 -2.792,17.846 -7.278,37.511 19.726,81.075 64.489,88.226 54.167,8.654 108.177,18.278 162.262,27.442 47.489,8.046 94.987,16.034 142.481,24.05 39.579,6.68 79.189,13.186 118.726,20.111 22.153,3.88 42.647,0.551 61.256,-12.328 16.409,-11.356 27.006,-26.928 31.187,-46.368 2.382,-11.075 4.745,-22.231 5.063,-33.691 C 507.409,116.53 483.081,80.415 441.453,73.303 392.326,64.909 343.141,56.858 293.996,48.571 248.149,40.84 202.327,32.969 156.486,25.205 108.996,17.162 61.502,9.142 13.993,1.213 9.39,0.444 4.667,0.387 0,0"/>
            </g>
            <g transform="translate(2083.1792,1850.7896)" id="g36">
              <path id="path38" style="fill:#ffffff00;fill-opacity:1;fill-rule:nonzero;stroke:none" d="m 0,0 c 31.829,1.063 69.745,-22.012 76.908,-65.954 0.968,-5.944 1.669,-11.936 2.791,-17.849 6.815,-35.914 -17.85,-79.349 -61.952,-87.301 -31.601,-5.697 -63.312,-10.787 -94.977,-16.129 -29.355,-4.951 -58.716,-9.867 -88.071,-14.815 -30.345,-5.115 -60.688,-10.248 -91.03,-15.38 -29.683,-5.02 -59.358,-10.081 -89.046,-15.063 -23.092,-3.876 -46.231,-7.478 -69.292,-11.528 -28.08,-4.932 -60.906,9.45 -77.002,36.541 -5.011,8.435 -8.43,17.452 -10.05,27.139 -0.993,5.939 -1.945,11.886 -2.986,17.817 -6.928,39.475 18.434,78.556 57.398,87.851 10.717,2.557 21.692,4.058 32.57,5.915 30.665,5.234 61.335,10.431 92.013,15.585 29.689,4.987 59.396,9.864 89.083,14.862 25.728,4.332 51.435,8.792 77.16,13.147 25.395,4.299 50.8,8.537 76.201,12.801 21.773,3.654 43.561,7.221 65.308,11.023 C -9.988,-0.467 -5.017,-0.15 0,0"/>
            </g>
          </g>
        </g>
      </g>
    </svg>
    `
}
const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  IconChanger()
  const { initialized } = useAnalytics()
  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Wrapper initialized={initialized} />
          <Switch>
              <Route path="/" exact>
                <Redirect to="/swap" />
              </Route>
              <Route exact path="/farms/auction">
                <FarmAuction />
              </Route>
              <Route path="/farms">
                <Farms />
              </Route>
              <Route path="/pools">
                <Pools />
              </Route>
              <Route path="/lottery">
                <Lottery />
              </Route>
              <Route path="/ifo">
                <Ifos />
              </Route>
              <Route path="/collectibles/:name">
                <Collectibles />
              </Route>
              <Route path="/collectibles">
                <Collectibles />
              </Route>
              <Route exact path="/teams">
                <Teams />
              </Route>
              <Route path="/teams/:id">
                <Team />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/competition">
                <TradingCompetition />
              </Route>
              <Route path="/prediction">
                <Predictions />
              </Route>
              <Route exact path="/voting">
                <Voting />
              </Route>
              <Route exact path="/voting/proposal/create">
                <CreateProposal />
              </Route>
              <Route path="/voting/proposal/:id">
                <Proposal />
              </Route>
              <Route path="/tutorials">
                <Tutorials />
              </Route>
              <Route path="/2f2h">
                <TFTH />
              </Route>
              {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/liquidity" component={Liquidity} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

              {/* Redirect */}
              <Route path="/pool">
                <Redirect to="/liquidity" />
              </Route>
              <Route path="/staking">
                <Redirect to="/pools" />
              </Route>
              <Route path="/syrup">
                <Redirect to="/pools" />
              </Route>
              <Route path="/nft">
                <Redirect to="/collectibles" />
              </Route>

              {/* 404 */}
              <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
