import React from 'react'
import { Box, Flex, Text } from 'rimble-ui'
import TimeAgo from 'react-timeago'

const TransactionList = ({ transactionList }) => {
  const hashStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    listStyle: 'none',
    marginLeft: 0,
    paddingLeft: 0,
  }
  return (
    <Box pb={4}>
      {Object.entries(transactionList).map(([key, transaction], index) => {
        return (
          <Box borderBottom={1} borderColor={'#E8E8E8'} key={index} >
            <ul style={hashStyle}>
              <li>created: <TimeAgo date={transaction.created} /></li>
              
              <li>status: {transaction.status}</li>
              
              { transaction.lastUpdated && 
                <li>updated: <TimeAgo date={transaction.lastUpdated} /></li>
              }

              { transaction.transactionHash && 
                <li>hash: {transaction.transactionHash}</li>
              }

              { transaction.transactionIndex && 
                <li>confirmations: { transaction.transactionIndex}</li>
              }
            </ul>
          </Box>
        )
      })}
    </Box>
  )
}

export default TransactionList
