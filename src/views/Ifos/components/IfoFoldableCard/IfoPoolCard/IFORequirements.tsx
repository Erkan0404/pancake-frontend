import React, { useMemo } from 'react'
import {
  Text,
  Flex,
  AccountIcon,
  AccountFilledIcon,
  TeamBattleIcon,
  TrophyFillIcon,
  Box,
  useTooltip,
  LinkExternal,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'

const NotOkNFT = ({ admissionProfile }) => (
  <>
    Set{' '}
    <LinkExternal
      style={{ display: 'inline' }}
      href={`https://pancakeswap.finance/nfts/collections/${admissionProfile}`}
    >
      Pancake Squad NFT
    </LinkExternal>
    <br />
    as Pancake Profile avatar.
  </>
)

const NotOkProfilePoints = ({ pointThreshold }) => {
  const { account } = useWeb3React()

  return (
    <>
      Reach {pointThreshold} or more
      <br />
      <LinkExternal
        style={{ display: 'inline' }}
        href={`https://pancakeswap.finance/nfts/profile/${account}/achievements/`}
      >
        Pancake Profile
      </LinkExternal>{' '}
      points.
    </>
  )
}

const configCriterias = (pointThreshold: number, admissionProfile: string) => ({
  isQualifiedNFT: {
    OkIcon: AccountFilledIcon,
    okMsg: 'Eligible NFT avatar found!',
    notOkMsg: <NotOkNFT admissionProfile={admissionProfile} />,
    NotOkIcon: AccountIcon,
    name: 'Pancake Squad',
  },
  isQualifiedPoints: {
    OkIcon: TrophyFillIcon,
    okMsg: 'Profile Points threshold met!',
    notOkMsg: <NotOkProfilePoints pointThreshold={pointThreshold} />,
    NotOkIcon: TeamBattleIcon,
    name: 'Profile points',
  },
})

function Item({ type, isOk, isSingle, pointThreshold, admissionProfile }) {
  const config = useMemo(() => configCriterias(pointThreshold, admissionProfile), [pointThreshold, admissionProfile])

  const name = config[type]?.name
  const Icon = isOk ? config[type]?.OkIcon : config[type]?.NotOkIcon
  const okMsg = isOk ? config[type]?.okMsg : config[type]?.notOkMsg

  const { tooltipVisible, targetRef, tooltip } = useTooltip(okMsg, { placement: 'bottom', trigger: 'hover' })

  return (
    <Flex
      ref={targetRef}
      mx="4px"
      p="8px"
      justifyContent={isSingle ? 'flex-start' : 'center'}
      flex="1"
      flexWrap="wrap"
      borderRadius="8px"
      border={isOk ? '1px solid #7645D9' : '1px dashed #BDC2C4'}
      background={isOk ? 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)' : '#FAF9FA'}
    >
      <Box px="8px">
        <Icon color={isOk ? 'secondary' : 'textDisabled'} />
      </Box>
      <Text textAlign="center" px="8px" color={isOk ? 'secondary' : 'textDisabled'}>
        {name}
      </Text>
      {tooltipVisible && tooltip}
    </Flex>
  )
}

export default function IFORequirements({ criterias, pointThreshold, admissionProfile }) {
  const isSingle = criterias.length === 1

  return (
    <Flex mx="8px">
      {criterias.map(({ type, value }) => {
        return (
          <Item
            isSingle={isSingle}
            key={type}
            type={type}
            isOk={value}
            pointThreshold={pointThreshold}
            admissionProfile={admissionProfile}
          />
        )
      })}
    </Flex>
  )
}