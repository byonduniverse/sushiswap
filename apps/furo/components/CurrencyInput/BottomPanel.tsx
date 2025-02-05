import { Amount, Currency } from '@sushiswap/currency'
import { Loader, Typography } from '@sushiswap/ui'
import { FC } from 'react'

interface BottomPanel {
  loading: boolean
  label: string
  amount?: Amount<Currency>
  onChange?(value: string): void
}

export const BottomPanel: FC<BottomPanel> = ({ loading, amount, label, onChange }) => {
  return (
    <div className="flex justify-between px-4 pb-3">
      <Typography variant="xs" weight={500} className="text-slate-500">
        {label}
      </Typography>
      {loading ? (
        <Loader size="12px" />
      ) : (
        <Typography
          variant="xs"
          weight={500}
          className="text-slate-500"
          onClick={() => (amount && onChange ? onChange(amount?.toExact()) : undefined)}
        >
          {amount?.toSignificant(6)} {amount?.currency.symbol}
        </Typography>
      )}
    </div>
  )
}
