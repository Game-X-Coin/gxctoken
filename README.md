# GXC Token smart contracts
## forked from MVL Token
### GXC Token

GXC Token is ERC-20 token conforms following ERC-20 https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md


##### Constants

- `name`: 'Game X Coin'
- `symbol`: 'GXC'
- `decimals`: (uint8)18
- `totalSupply`: (uint256)1e27

##### Methods

- `balanceOf`: `view (address) => (uint256)`
- `transfer`: `(address, uint256) => (bool)`
- `transferFrom`: `(address _from, address _to, uint256) => (bool)`
- `approve`: `(address, uint256) => (bool)`
- `allowance`: `(address _owner, address _spender) => (uint256)`
- `increaseApproval`: `(address _spender, uint256 _addedValue) => (bool)`
- `decreaseApproval`: `(address _spender, uint256 _subtractedValue) => (bool)`
  
##### Events

- `Transfer(address indexed _from, address indexed _to, uint256 _value)`
- `Approval(address indexed _owner, address indexed _spender, uint256 _value)`


##### Note on N+M spend attack

There is an attack vector which exploits `approve` function to spend unwanted by `spender`. The discussion is [here](https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729).
Since EIP20 fixed its interface, so the [suggestion of changing API](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit) isn't accepted.

Therefore, GXC token considers the work-around solution, hinted from [MiniMeToken](https://github.com/Giveth/minime/blob/master/contracts/MiniMeToken.sol)  

The main idea of this, enforce token holder to call `approve(spender, 0)` before call it again with positive integer value.
This is implemented [here](https://github.com/mvlchain/mvltoken/blob/master/contracts/token/GXCToken.sol#L55) and tested [here](https://github.com/mvlchain/mvltoken/blob/master/test/mvltoken.js#L113).


### Build Environment

- Solidity v0.4.19 (solc or solc-js both work)
- Truffle v4.1.3 (core: 4.1.3)
- Node.js v8.11.1 (for dependency mgmt.)
- Docker (18.03.0-ce, build 0520e24, for [oyente](https://github.com/melonproject/oyente))

##### Commands
- install dependencies 
```
$ yarn install --frozen-lockfile --production=false
```
- test command
```
$ truffle test
```
