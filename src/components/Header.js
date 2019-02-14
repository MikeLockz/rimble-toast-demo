import React from "react"
import { Box, Flex, Link, Button, Heading } from "rimble-ui"

class Header extends React.Component {
  render() {

    return(
      <Box bg="primary" p={4} justifyContent="center" flexDirection="column">
        <Flex justifyContent="flex-end">
          <Link href="https://github.com/ConsenSys/rimble-app-demo" target="_blank">
            <Button>GitHub</Button>
          </Link>
        </Flex>

        <Box width="600px" mx="auto">
          <Heading.h1 color={'white'}>Rimble App Demo</Heading.h1>
        </Box>
      </Box>
    )
  }
}

export default Header;
