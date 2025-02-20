import type { FullStatusData } from '@lifi/sdk';
import { Container, List } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { TransactionHistoryItem } from './TransactionHistoryItem';
import { TransactionHistorySkeleton } from './TransactionHistorySkeleton';
import { minTransactionListHeight } from './constants';

export const TransactionHistoryPage: React.FC = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { data: transactions, isLoading } = useTransactionHistory();

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: transactions.length,
    overscan: 10,
    paddingStart: 8,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 194,
    getItemKey: (index) =>
      `${(transactions[index] as FullStatusData).transactionId}-${index}`,
  });

  if (!transactions.length && !isLoading) {
    return <TransactionHistoryEmpty />;
  }

  return (
    <Container
      ref={parentRef}
      style={{ height: minTransactionListHeight, overflow: 'auto' }}
    >
      <List
        style={{ height: getTotalSize(), width: '100%', position: 'relative' }}
        disablePadding
      >
        {isLoading ? (
          <List disablePadding sx={{ paddingTop: 1 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TransactionHistorySkeleton key={index} />
            ))}
          </List>
        ) : (
          getVirtualItems().map((item) => {
            const transaction = transactions[item.index];
            return (
              <TransactionHistoryItem
                key={item.key}
                size={item.size}
                start={item.start}
                transaction={transaction}
              />
            );
          })
        )}
      </List>
    </Container>
  );
};
