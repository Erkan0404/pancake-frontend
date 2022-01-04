import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { useAchievementsForAddress, useProfileForAddress, useProfile } from 'state/profile/hooks'
import { useAchievements } from 'state/achievements/hooks'
import { NftMarketLayout } from 'views/Nft/market/Layout'
import NftProfile from 'views/Nft/market/Profile'
import Achievements from 'views/Nft/market/Profile/components/Achievements'
import { AchievementFetchStatus } from 'state/types'

const NftProfileAchievementsPage = () => {
  const { account } = useWeb3React()
  const accountAddress = useRouter().query.accountAddress as string
  const isConnectedProfile = account?.toLowerCase() === accountAddress?.toLowerCase()

  return <>{isConnectedProfile ? <ConnectedAchievement /> : <UnConnectedAchievement />}</>
}

const ConnectedAchievement = () => {
  const { profile } = useProfile()
  const { achievements, achievementFetchStatus } = useAchievements()
  return (
    <Achievements
      achievements={achievements}
      isLoading={achievementFetchStatus !== AchievementFetchStatus.FETCHED}
      points={profile?.points}
    />
  )
}

const UnConnectedAchievement = () => {
  const accountAddress = useRouter().query.accountAddress as string
  const { profile: profileHookState } = useProfileForAddress(accountAddress)
  const { profile } = profileHookState || {}
  const { achievements, isFetching: isAchievementFetching } = useAchievementsForAddress(accountAddress)
  return <Achievements achievements={achievements} isLoading={isAchievementFetching} points={profile?.points} />
}

NftProfileAchievementsPage.getLayout = (page) => {
  return <NftProfile>{NftMarketLayout(page)}</NftProfile>
}

export default NftProfileAchievementsPage