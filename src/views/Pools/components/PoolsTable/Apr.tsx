import React, { useEffect, useState } from 'react'
import { Flex, useModal, CalculateIcon, Skeleton, FlexProps, Button } from '@twinkykms/rubyswap-uikit'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getAprData } from 'views/Pools/helpers'
import { getAddress } from 'utils/addressHelpers'
import { getFarmApr } from 'utils/apr'

interface AprProps extends FlexProps {
  pool: Pool
  showIcon: boolean
  performanceFee?: number
}

const Apr: React.FC<AprProps> = ({ pool, showIcon, performanceFee = 0, ...props }) => {
  const { stakingToken, earningToken, isFinished, earningTokenPrice, sousId } = pool
  const { t } = useTranslation()
  const [apr, setApr] = useState("")
  const { roundingDecimals, compoundFrequency } = getAprData(pool, performanceFee)

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${getAddress(stakingToken.address)}` : '/swap'
  const getApr = async () => {
    if (sousId === 0) {
      const aprValue = await getFarmApr('ruby')
      setApr(aprValue?.toString())
    }
    else return setApr("")
  }
  useEffect(() => {
    getApr()
  }, [sousId])
  // const [onPresentApyModal] = useModal(
  //   <ApyCalculatorModal
  //     tokenPrice={earningTokenPrice}
  //     apr={apr}
  //     linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
  //     linkHref={apyModalLink}
  //     earningTokenSymbol={earningToken.symbol}
  //     roundingDecimals={roundingDecimals}
  //     compoundFrequency={compoundFrequency}
  //     performanceFee={performanceFee}
  //   />,
  // )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    // onPresentApyModal()
  }

  return (
    <Flex alignItems="center" justifyContent="space-between" {...props}>
      {apr || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="16px"
            isDisabled={isFinished}
            value={isFinished ? 0 : Number(apr)}
            decimals={2}
            unit="%"
          />
          {/* {!isFinished && showIcon && (
            <Button onClick={openRoiModal} variant="text" width="20px" height="20px" padding="0px" marginLeft="4px">
              <CalculateIcon color="textSubtle" width="20px" />
            </Button>
          )} */}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </Flex>
  )
}

export default Apr
