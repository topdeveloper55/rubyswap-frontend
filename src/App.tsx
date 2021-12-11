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
  // var menu = document.getElementsByTagName("a[href='/tutorials']");
  const menu = document.querySelector("a[href='/tutorials']");
  const icon = menu?.querySelector("svg");
  if(icon)
    icon.outerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
      width="24" height="24" style="margin-right:8px;min-width:24px"
      viewBox="0 0 172 172"
      style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#fd7fa0"><path d="M85.57,24.08c-0.37625,0.05375 -0.73906,0.16125 -1.075,0.3225l-82.56,41.28c-1.20937,0.56438 -1.98875,1.78719 -1.98875,3.1175c0,1.33031 0.77938,2.55313 1.98875,3.1175l11.825,5.9125v50.095c-3.9775,1.43781 -6.88,5.22719 -6.88,9.675c0,1.98875 0.67188,3.50719 1.3975,5.16c0.72563,1.65281 1.57219,3.27875 2.4725,4.8375c1.80063,3.10406 3.655,5.6975 3.655,5.6975l2.795,4.085l2.795,-4.085c0,0 1.85438,-2.59344 3.655,-5.6975c0.90031,-1.55875 1.74688,-3.18469 2.4725,-4.8375c0.72563,-1.65281 1.3975,-3.17125 1.3975,-5.16c0,-4.44781 -2.9025,-8.23719 -6.88,-9.675v-46.655l13.76,6.88v11.61c0,2.09625 1.38406,3.42656 2.4725,4.1925c1.08844,0.76594 2.2575,1.24969 3.655,1.72c2.795,0.94063 6.49031,1.72 10.965,2.365c8.96281,1.27656 21.07,2.0425 34.5075,2.0425c13.4375,0 25.54469,-0.76594 34.5075,-2.0425c4.47469,-0.645 8.17,-1.42437 10.965,-2.365c1.3975,-0.47031 2.56656,-0.95406 3.655,-1.72c1.08844,-0.76594 2.4725,-2.09625 2.4725,-4.1925v-11.61l32.465,-16.2325c1.20938,-0.56437 1.98875,-1.78719 1.98875,-3.1175c0,-1.33031 -0.77937,-2.55312 -1.98875,-3.1175l-82.56,-41.28c-0.60469,-0.29562 -1.27656,-0.40312 -1.935,-0.3225zM86,31.39l74.82,37.41l-23.22,11.61v-4.73c0,-2.10969 -1.38406,-3.44 -2.4725,-4.1925c-1.08844,-0.7525 -2.2575,-1.24969 -3.655,-1.72c-2.80844,-0.94062 -6.47687,-1.72 -10.965,-2.365c-8.97625,-1.27656 -21.12375,-2.0425 -34.5075,-2.0425c-13.38375,0 -25.53125,0.76594 -34.5075,2.0425c-4.48812,0.645 -8.15656,1.42438 -10.965,2.365c-1.3975,0.47031 -2.56656,0.9675 -3.655,1.72c-1.08844,0.7525 -2.4725,2.08281 -2.4725,4.1925v4.73l-23.22,-11.61zM86,72.24c13.115,0 25.0475,0.72563 33.54,1.935c4.24625,0.60469 7.59219,1.34375 9.675,2.0425c0.76594,0.25531 1.16906,0.47031 1.505,0.645v16.77c-2.70094,-0.84656 -6.08719,-1.55875 -10.2125,-2.15c-8.96281,-1.27656 -21.07,-2.0425 -34.5075,-2.0425c-13.4375,0 -25.54469,0.76594 -34.5075,2.0425c-4.12531,0.59125 -7.51156,1.30344 -10.2125,2.15v-16.77c0.33594,-0.17469 0.73906,-0.38969 1.505,-0.645c2.08281,-0.69875 5.42875,-1.43781 9.675,-2.0425c8.4925,-1.20937 20.425,-1.935 33.54,-1.935zM86,96.32c13.16875,0 25.06094,0.72563 33.54,1.935c3.1175,0.44344 5.18688,0.98094 7.2025,1.505c-2.01562,0.52406 -4.085,1.06156 -7.2025,1.505c-8.47906,1.20938 -20.37125,1.935 -33.54,1.935c-13.16875,0 -25.06094,-0.72562 -33.54,-1.935c-3.1175,-0.44344 -5.18687,-0.98094 -7.2025,-1.505c2.01563,-0.52406 4.085,-1.06156 7.2025,-1.505c8.47906,-1.20937 20.37125,-1.935 33.54,-1.935zM17.2,134.16c1.90813,0 3.44,1.53188 3.44,3.44c0,-0.09406 -0.18812,1.08844 -0.7525,2.365c-0.56437,1.27656 -1.43781,2.78156 -2.2575,4.1925c-0.22844,0.40313 -0.20156,0.37625 -0.43,0.7525c-0.22844,-0.37625 -0.20156,-0.34937 -0.43,-0.7525c-0.81969,-1.41094 -1.69312,-2.91594 -2.2575,-4.1925c-0.56437,-1.27656 -0.7525,-2.45906 -0.7525,-2.365c0,-1.90812 1.53188,-3.44 3.44,-3.44z"></path></g></g></svg>
      `;
}
const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  IconChanger();
  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
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
