import { memo } from 'react'
import { Message, MessageText, Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { VaultPosition } from 'utils/cakePool'

import ConvertToFlexibleButton from '../Buttons/ConvertToFlexibleButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import { AfterLockedActionsPropsType } from '../types'

const AfterLockedActions: React.FC<AfterLockedActionsPropsType> = ({
  currentLockedAmount,
  stakingToken,
  position,
  isInline,
}) => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const msg = {
    [VaultPosition.None]: null,
    [VaultPosition.LockedEnd]:
      'The lock period has ended. Convert to flexible staking or renew your position to start a new lock staking.',
    [VaultPosition.AfterBurning]:
      'The lock period has ended. To avoid more rewards being burned, convert to flexible staking or renew your position to start a new lock staking.',
  }
  const isDesktopView = isInline && isDesktop
  const Container = isDesktopView ? Flex : Box

  return (
    <Message
      variant="warning"
      mb="16px"
      action={
        <Container mt={!isDesktopView && '8px'} ml="10px">
          <ConvertToFlexibleButton
            mb={!isDesktopView && '8px'}
            minWidth={isDesktopView && '200px'}
            mr={isDesktopView && '14px'}
          />
          <ExtendButton
            modalTitle={t('Renew')}
            lockEndTime="0"
            lockStartTime="0"
            stakingToken={stakingToken}
            currentLockedAmount={currentLockedAmount}
            minWidth="186px"
          >
            {t('Renew')}
          </ExtendButton>
        </Container>
      }
      actionInline={isDesktopView}
    >
      <MessageText>{t(msg[position])}</MessageText>
    </Message>
  )
}

export default memo(AfterLockedActions)