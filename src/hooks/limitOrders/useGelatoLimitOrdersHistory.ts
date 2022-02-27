import { Order } from '@gelatonetwork/limit-orders-lib'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'

import { getLSOrders, saveOrder } from 'utils/localStorageOrders'
import useGelatoLimitOrdersLib from './useGelatoLimitOrdersLib'

function newOrdersFirst(a: Order, b: Order) {
  return Number(b.updatedAt) - Number(a.updatedAt)
}

function syncOrderToLocalStorage({ chainId, account, orders }) {
  const ordersLS = getLSOrders(chainId, account)

  orders.forEach((order: Order) => {
    const orderExists = ordersLS.find((confOrder) => confOrder.id.toLowerCase() === order.id.toLowerCase())

    if (!orderExists || (orderExists && Number(orderExists.updatedAt) < Number(order.updatedAt))) {
      saveOrder(chainId, account, order)
    }
  })
}

export function useGelatoOpenLimitOrders(): Order[] {
  const { account, chainId } = useActiveWeb3React()

  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const { data } = useSWR(
    gelatoLimitOrders && account && chainId ? ['gelato', 'openOrders'] : null,
    async () => {
      try {
        const orders = await gelatoLimitOrders.getOpenOrders(account.toLowerCase(), false)

        syncOrderToLocalStorage({
          orders,
          chainId,
          account,
        })
      } catch (e) {
        console.error('Error fetching open orders from subgraph', e)
      }

      const openOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === 'open')

      const pendingOrdersLS = getLSOrders(chainId, account, true)

      return [
        ...openOrdersLS
          .filter((order: Order) => {
            const orderCancelled = pendingOrdersLS
              .filter((pendingOrder) => pendingOrder.status === 'cancelled')
              .find((pendingOrder) => pendingOrder.id.toLowerCase() === order.id.toLowerCase())
            return !orderCancelled
          })
          .sort(newOrdersFirst),
        ...pendingOrdersLS.filter((order) => order.status === 'open').sort(newOrdersFirst),
      ]
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return data
}

export function useGelatoLimitOrdersHistory(): Order[] {
  const { account, chainId } = useActiveWeb3React()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()

  const { data } = useSWR(
    gelatoLimitOrders && account && chainId ? ['gelato', 'cancelledOrders'] : null,
    async () => {
      try {
        const acc = account.toLowerCase()

        const [canOrders, exeOrders] = await Promise.all([
          gelatoLimitOrders.getCancelledOrders(acc, false),
          gelatoLimitOrders.getExecutedOrders(acc, false),
        ])

        syncOrderToLocalStorage({
          orders: [...canOrders, ...exeOrders],
          chainId,
          account,
        })
      } catch (e) {
        console.error('Error fetching history orders from subgraph', e)
      }

      const executedOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === 'executed')

      const cancelledOrdersLS = getLSOrders(chainId, account).filter((order) => order.status === 'cancelled')

      const pendingCancelledOrdersLS = getLSOrders(chainId, account, true).filter(
        (order) => order.status === 'cancelled',
      )

      // TODO: add sort by date
      return [
        ...pendingCancelledOrdersLS.sort(newOrdersFirst),
        ...cancelledOrdersLS.sort(newOrdersFirst),
        ...executedOrdersLS.sort(newOrdersFirst),
      ]
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return data
}