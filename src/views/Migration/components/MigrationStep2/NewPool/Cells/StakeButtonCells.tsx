import React from 'react'
import styled from 'styled-components'

const StakeButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 14px 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 0 14px 0 0;
    align-items: center;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 32px;
  }
`

const StakeButtonCells = ({ children }: { children: JSX.Element }) => {
  return <StakeButtonContainer>{children}</StakeButtonContainer>
}

export default StakeButtonCells