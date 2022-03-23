import React from 'react'
import { DeserializedPool } from 'state/types'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, Text } from '@pancakeswap/uikit'
import { ActionContainer, ActionContent, ActionTitles } from 'views/Pools/components/PoolsTable/ActionPanel/styles'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertSharesToCake } from 'views/Pools/helpers'
import StakeButton from '../StakeButton'

const Container = styled(ActionContainer)`
  flex: 3;
`

interface StackedActionProps {
  pool: DeserializedPool
}

const Staked: React.FC<StackedActionProps> = ({ pool }) => {
  const { stakingToken, userData, stakingTokenPrice, vaultKey } = pool
  const { t } = useTranslation()

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const {
    userData: { userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)

  const { cakeAsBigNumber, cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const hasStaked = pool.vaultKey ? (Number.isNaN(cakeAsNumberBalance) ? 0 : cakeAsNumberBalance) : stakedTokenBalance

  return (
    <Container>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {`${pool.stakingToken.symbol} ${t('Staked')}`}
        </Text>
      </ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="16px" flexDirection="column" alignSelf="flex-start">
          <Balance
            lineHeight="1"
            bold
            fontSize="20px"
            color={hasStaked ? 'primary' : 'textDisabled'}
            decimals={hasStaked ? 5 : 1}
            value={hasStaked}
          />
          <Balance
            fontSize="12px"
            display="inline"
            color={hasStaked ? 'textSubtle' : 'textDisabled'}
            decimals={2}
            value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
            unit=" USD"
            prefix="~"
          />
        </Flex>
        <StakeButton pool={pool} />
      </ActionContent>
    </Container>
  )
}

export default Staked