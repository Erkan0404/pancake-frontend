import { useState, useCallback, memo } from 'react'
import { Flex, Card, Box } from '@pancakeswap/uikit'

import OpenOrderTable from './OpenOrderTable'
import HistoryOrderTable from './HistoryOrderTable'
import OrderTab from './OrderTab'
import { TAB_TYPE } from './types'

const LimitOrderTable: React.FC<{ isChartDisplayed: boolean }> = ({ isChartDisplayed }) => {
  const [activeTab, setIndex] = useState<TAB_TYPE>(TAB_TYPE.Open)
  const handleClick = useCallback((tabType: TAB_TYPE) => setIndex(tabType), [])

  return (
    <Flex mt={isChartDisplayed ? ['56px', '56px', '56px', '24px'] : '24px'} width="100%" justifyContent="center">
      <Card style={{ width: isChartDisplayed ? '50%' : '328px' }}>
        <OrderTab onItemClick={handleClick} activeIndex={activeTab} />
        {TAB_TYPE.Open === activeTab ? <OpenOrderTable /> : <HistoryOrderTable />}
      </Card>
      {isChartDisplayed && <Box width="328px" mx={['24px', '24px', '24px', '40px']} />}
    </Flex>
  )
}

export default memo(LimitOrderTable)