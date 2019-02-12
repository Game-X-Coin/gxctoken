pragma solidity ^0.5.0;

import './SafeMath.sol';
import './ERC20Basic.sol';
import './ERC20.sol';
import './DetailedERC20.sol';
import './Ownable.sol';

contract BasicToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) balances;

  uint256 _totalSupply;

  /**
  * @dev total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value > 0);
    require(_value <= balances[msg.sender]);

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }
}

contract ERC20Token is BasicToken, ERC20 {
  using SafeMath for uint256;
  mapping (address => mapping (address => uint256)) allowed;

  function approve(address _spender, uint256 _value) public returns (bool) {
    require(_value == 0 || allowed[msg.sender][_spender] == 0);

    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);

    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
    return allowed[_owner][_spender];
  }

  function increaseApproval(address _spender, uint256 _addedValue) public returns (bool success) {
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_addedValue);
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  function decreaseApproval(address _spender, uint256 _subtractedValue) public returns (bool success) {
    uint256 oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue >= oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
    }
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

}

contract BurnableToken is BasicToken, Ownable {
  // events
  event Burn(address indexed burner, uint256 amount);

  // reduce sender balance and Token total supply
  function burn(uint256 _value) onlyOwner public {
    balances[msg.sender] = balances[msg.sender].sub(_value);
    _totalSupply = _totalSupply.sub(_value);
    emit Burn(msg.sender, _value);
    emit Transfer(msg.sender, address(0), _value);
  }
}

contract TokenLock is Ownable {
  using SafeMath for uint256;

  bool public transferEnabled = false; // indicates that token is transferable or not
  bool public noTokenLocked = false; // indicates all token is released or not

  struct TokenLockInfo { // token of `amount` cannot be moved before `time`
    uint256 amount; // locked amount
    uint256 time; // unix timestamp
  }

  struct TokenLockState {
    uint256 latestReleaseTime;
    TokenLockInfo[] tokenLocks; // multiple token locks can exist
  }

  mapping(address => TokenLockState) lockingStates;
  event AddTokenLock(address indexed to, uint256 time, uint256 amount);

  function unlockAllTokens() public onlyOwner {
    noTokenLocked = true;
  }

  function enableTransfer(bool _enable) public onlyOwner {
    transferEnabled = _enable;
  }

  // calculate the amount of tokens an address can use
  function getMinLockedAmount(address _addr) view public returns (uint256 locked) {
    uint256 i;
    uint256 a;
    uint256 t;
    uint256 lockSum = 0;

    // if the address has no limitations just return 0
    TokenLockState storage lockState = lockingStates[_addr];
    if (lockState.latestReleaseTime < now) {
      return 0;
    }

    for (i=0; i<lockState.tokenLocks.length; i++) {
      a = lockState.tokenLocks[i].amount;
      t = lockState.tokenLocks[i].time;

      if (t > now) {
        lockSum = lockSum.add(a);
      }
    }

    return lockSum;
  }

  function addTokenLock(address _addr, uint256 _value, uint256 _release_time) onlyOwnerOrAdmin public {
    require(_addr != address(0));
    require(_value > 0);
    require(_release_time > now);

    TokenLockState storage lockState = lockingStates[_addr]; // assigns a pointer. change the member value will update struct itself.
    if (_release_time > lockState.latestReleaseTime) {
      lockState.latestReleaseTime = _release_time;
    }
    lockState.tokenLocks.push(TokenLockInfo(_value, _release_time));

    emit AddTokenLock(_addr, _release_time, _value);
  }
}

contract GXCToken is BurnableToken, DetailedERC20, ERC20Token, TokenLock {
  using SafeMath for uint256;
  // uint256 public DISTRIBUTE_DATE = 1538319600; // 2018-10-01T00:00:00+09:00
  uint256 public DISTRIBUTE_DATE = 1536224400; // 2018-09-06T18:00:00+09:00

  // events
  event Approval(address indexed owner, address indexed spender, uint256 value);
  event UpdatedBlockingState(address indexed to, uint256 start_time, uint256 step_time, uint256 unlock_step, uint256 value);

  string public constant symbol = "GXC";
  string public constant name = "Game X Coin";
  uint8 public constant decimals = 18;
  uint256 public constant TOTAL_SUPPLY = 1*(10**9)*(10**uint256(decimals));

  constructor() DetailedERC20(name, symbol, decimals) public {
    _totalSupply = TOTAL_SUPPLY;

    // initial supply belongs to owner
    balances[owner] = _totalSupply;
    emit Transfer(address(0x0), msg.sender, _totalSupply);
  }

  // modifiers
  // checks if the address can transfer tokens
  modifier canTransfer(address _sender, uint256 _value) {
    require(_sender != address(0));
    require(
      canTransferBefore(_sender) || (
        transferEnabled && (
        now > DISTRIBUTE_DATE && (
            noTokenLocked ||
            canTransferIfLocked(_sender, _value)
          )
        )
      )
    );

    _;
  }

  function setAdmin(address newAdmin) onlyOwner public {
    address oldAdmin = admin;
    super.setAdmin(newAdmin);
    approve(oldAdmin, 0);
    approve(newAdmin, TOTAL_SUPPLY);
  }

  modifier onlyValidDestination(address to) {
    require(to != address(0x0));
    require(to != address(this));
    require(to != owner);
    _;
  }

  function canTransferBefore(address _sender) public view returns(bool) {
    return _sender != address(0) && (_sender == owner || _sender == admin);
  }

  function canTransferIfLocked(address _sender, uint256 _value) public view returns(bool) {
    require(now >= DISTRIBUTE_DATE);
    uint256 after_math = balances[_sender].sub(_value);
    return after_math >= getMinLockedAmount(_sender);
  }

  // override function using canTransfer on the sender address
  function transfer(address _to, uint256 _value) onlyValidDestination(_to) canTransfer(msg.sender, _value) public returns (bool success) {
    return super.transfer(_to, _value);
  }

  // transfer tokens from one address to another
  function transferFrom(address _from, address _to, uint256 _value) onlyValidDestination(_to) canTransfer(_from, _value) public returns (bool success) {
    // SafeMath.sub will throw if there is not enough balance.
    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value); // this will throw if we don't have enough allowance

    // this event comes from BasicToken.sol
    emit Transfer(_from, _to, _value);

    return true;
  }

  function() external payable { // don't send eth directly to token contract
    revert();
  }
  function test() public view returns(uint, uint) {
    return (block.timestamp, block.number);
  }
}
