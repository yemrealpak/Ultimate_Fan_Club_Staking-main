// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionDelegateCall(target, data, "Address: low-level delegate call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

library SafeERC20 {
    using Address for address;

    function safeTransfer(
        IERC20 token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20Permit token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;
    mapping (address => bool) private _authorized;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
        _authorized[_msgSender()] = true;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    modifier onlyAuthorized() {
        require(_authorized[_msgSender()], "Not authorized");
        _;
    }

    function setAuthorized(address _address, bool authorized) public onlyOwner {
        _authorized[_address] = authorized;
    }

    function isAuthorized(address _address) public view returns (bool) {
        return _authorized[_address];
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}

contract UFCLStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using Address for address;

    struct StakeInfo {
        uint256 amount;
        uint256 poolId;  
        uint256 depositTime;
    }

    struct PoolInfo{
        uint256 interest;
        uint256 apy;  
        uint256 startEpoch;
        uint256 poolLength;
        uint256 lockPeriod;
        uint256 liveStakedAmount;
        uint256 totalContributed;
        uint256 emergencyWithdrawFee;
        uint256 burnFee;
        bool isOpen;
    }

    struct DynamicPoolInfo {
        uint256 interest;  
        uint256 apy;  
        uint256 lockPeriod;
        bool isOpen;
        bool isLive;
        uint256 endDate;
        uint256 liveStakedAmount;
        uint256 rewardDept;
    }

    IERC20 public token;

    PoolInfo[] public poolInfo;
    mapping(address => StakeInfo[]) public stakeInfo;

    uint256 private totalRewardDistributed;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    event EmergencyWithdrawFee(address indexed user, uint256 amount);

    constructor() {
        token = IERC20(0x71B0E1fe13258C552e5F962d9D3deCF8a24d6583);
        poolInfo.push(PoolInfo( 600,  100, block.timestamp, 3653 days, 30 days, 0, 0, 2000, 0, true));
        poolInfo.push(PoolInfo( 3200, 200, block.timestamp, 3653 days, 90 days, 0, 0, 2000, 0, true));
        poolInfo.push(PoolInfo( 10000, 300, block.timestamp, 3653 days, 180 days, 0, 0, 2000, 0, true));
    }

    function claimStuckTokens(address _token) external onlyOwner {
        if (_token == address(0x0)) {
            payable(msg.sender).transfer(address(this).balance);
            return;
        }
        IERC20 erc20Token = IERC20(_token);
        uint256 balance = erc20Token.balanceOf(address(this));
        erc20Token.transfer(msg.sender, balance);
    }

    function addPool(PoolInfo memory pool) external onlyOwner{
        poolInfo.push(pool);
    }

    function setFees(uint256 _poolId, uint emFee) external onlyOwner {
        PoolInfo storage pool = poolInfo[_poolId];
        require(emFee <= 3000, "EmergencyWithdrawFee should be <= 20");
        pool.emergencyWithdrawFee = emFee;
    }

    function changePoolStatus(uint256 _pid,bool _isOpen) external onlyAuthorized{
        PoolInfo storage pool = poolInfo[_pid];
        pool.isOpen = _isOpen;
    }

    function togglePool(uint256 _pid) external onlyAuthorized{
        PoolInfo storage pool = poolInfo[_pid];
        pool.isOpen = !pool.isOpen;
    }

    function updatePoolLength(uint256 _poolId, uint256 _poolLength) external onlyAuthorized{
        PoolInfo storage pool = poolInfo[_poolId];
        pool.poolLength = _poolLength;
    }

    function extendPoolLength(uint256 _poolId, uint256 _duration) external onlyAuthorized{
        PoolInfo storage pool = poolInfo[_poolId];
        pool.poolLength += (_duration * 1 days);
    }

    function getDynamicPoolInfo(uint256 _poolId) external view returns (DynamicPoolInfo memory) {
        PoolInfo storage pool = poolInfo[_poolId];
        DynamicPoolInfo memory dynamicPoolInfo;

        dynamicPoolInfo.interest = pool.interest;
        dynamicPoolInfo.apy = pool.apy;
        dynamicPoolInfo.lockPeriod = pool.lockPeriod;
        dynamicPoolInfo.isOpen = pool.isOpen;
        dynamicPoolInfo.isLive = isLivePool(_poolId);

        dynamicPoolInfo.endDate = pool.startEpoch + pool.poolLength;
        dynamicPoolInfo.liveStakedAmount = pool.liveStakedAmount;
        dynamicPoolInfo.rewardDept = (pool.liveStakedAmount * pool.interest) / 10000;

        return dynamicPoolInfo;
    }

    function pendingReward(uint256 _stakeId, address _user) public view returns (uint256) {
        StakeInfo memory stake = stakeInfo[_user][_stakeId];
        PoolInfo memory pool = poolInfo[stake.poolId];
        
        uint256 lockedTime = block.timestamp > stake.depositTime + pool.lockPeriod ? pool.lockPeriod : block.timestamp - stake.depositTime;
        uint256 reward = (((stake.amount * pool.interest)  * lockedTime) / pool.lockPeriod) / 10_000;
        return reward;
    }


    function canWithdraw(uint256 _stakeId, address _user) public view returns (bool) {
        return (withdrawCountdown(_stakeId,_user)==0 && stakeInfo[_user][_stakeId].amount > 0);
    }

    function withdrawCountdown(uint256 _stakeId, address _user) public view returns (uint256) {
        StakeInfo storage stake = stakeInfo[_user][_stakeId];
        PoolInfo  storage pool = poolInfo[stake.poolId];
        if ((block.timestamp < stake.depositTime + pool.lockPeriod)){
            return stake.depositTime + pool.lockPeriod -  block.timestamp;
        }else{
            return 0;
        }
    }

    function userInfo(uint256 stakeId, address _user) public view returns(uint256,uint256,uint256,uint256,uint256) {
        StakeInfo storage stake = stakeInfo[_user][stakeId];
        PoolInfo storage pool = poolInfo[stake.poolId];
        return (stake.amount, stake.depositTime, pool.interest, pool.startEpoch, pool.lockPeriod);
    }

    function getAllUserInfo(address _user) public view returns(uint256[] memory) {
        StakeInfo[] storage stake = stakeInfo[_user];
        PoolInfo[] storage pool = poolInfo;
        uint256 lenghtOfStake = 0;
         for(uint256 i = 0; i < stake.length; ++i)
             if(stake[i].amount>0)
                lenghtOfStake+=1;
            
        uint256[] memory information = new uint256[](lenghtOfStake*7);
        uint256 j=0;
        for(uint256 i = 0; i < stake.length; ++i){
            if(stake[i].amount>0){
                information[j*7+0]=stake[i].amount;
                information[j*7+1]=stake[i].depositTime;
                information[j*7+2]=pool[stake[i].poolId].interest;
                information[j*7+3]=pool[stake[i].poolId].lockPeriod;
                information[j*7+4]=i;
                information[j*7+5]=pendingReward(i,_user);
                information[j*7+6]=canWithdraw(i,_user)? 1 : 0;
                j+=1;
            }
        }
        return information;
    }

    function getUserTotalStakedAmount(address _user) public view returns(uint256) {
        StakeInfo[] storage stake = stakeInfo[_user];

        uint256 totalStakedAmount;
        for(uint256 i = 0; i < stake.length; ++i) {
            totalStakedAmount += stake[i].amount;
        }
        return totalStakedAmount;
    }

    function getTotalContributors() public view returns(uint256) {
        PoolInfo[] storage pool = poolInfo;

        uint256 totalContributors;
        for(uint256 i = 0; i < pool.length; ++i) {
            totalContributors += pool[i].totalContributed;
        }
        return totalContributors;
    }

    function getTotalLiveStakingAmount() public view returns(uint256) {
        PoolInfo[] storage pool = poolInfo;

        uint256 totalLiveStakeAmount;
        for(uint256 i = 0; i < pool.length; ++i) {
            totalLiveStakeAmount += pool[i].liveStakedAmount;
        }
        return totalLiveStakeAmount;
    }

    function getTotalRewardDepth() public view returns(uint256) {
        PoolInfo[] storage pool = poolInfo;

        uint256 pools = poolInfo.length;
        uint256 totalRewardDepth;
        for(uint256 i = 0; i < pools; ++i) {
            totalRewardDepth += (pool[i].liveStakedAmount * pool[i].interest) / 10_000;
        }
        return totalRewardDepth;
    }

    function getTotalRewardDistributed() public view returns(uint256) {
        return totalRewardDistributed;
    }

    function getTotals() external view returns(uint256[4] memory) {
        uint256[4] memory totals;

        totals[0] = getTotalContributors();
        totals[1] = getTotalLiveStakingAmount();
        totals[2] = getTotalRewardDepth();
        totals[3] = getTotalRewardDistributed();

        return totals;
    }

    function isLivePool(uint256 _poolId) public view returns(bool) {
        PoolInfo storage pool = poolInfo[_poolId];
        return (pool.isOpen && block.timestamp >= pool.startEpoch && block.timestamp <= pool.startEpoch + pool.poolLength);
    }

    function deposit(uint256 _poolId,uint256 _amount) public nonReentrant{
        require (_amount > 0, 'amount 0');
        PoolInfo storage pool = poolInfo[_poolId];

        require(isLivePool(_poolId),'Pool is not live');
        require(pool.startEpoch < block.timestamp,'pool has not started yet');
        
        token.safeTransferFrom(address(msg.sender), address(this), _amount);

        pool.liveStakedAmount += _amount;
        
        stakeInfo[msg.sender].push(StakeInfo({
            amount: _amount,
            poolId: _poolId,
            depositTime: block.timestamp
        }));

        if(stakeInfo[msg.sender].length==1){
            pool.totalContributed+=1;
        }
        emit Deposit(msg.sender, _amount);
    }

    function withdraw(uint256 _stakeId) public nonReentrant{
        require(canWithdraw(_stakeId,msg.sender),'cannot withdraw yet or already withdrawn');
        StakeInfo storage stake = stakeInfo[msg.sender][_stakeId];
        PoolInfo storage pool = poolInfo[stake.poolId];
        
        uint256 _amount = stake.amount;
        pool.liveStakedAmount -= _amount;
        
        uint256 _pendingReward = pendingReward(_stakeId, msg.sender);

        totalRewardDistributed += _pendingReward;
        _amount += _pendingReward;
        stake.amount=0;

        token.safeTransfer(address(msg.sender), _amount);

        emit Withdraw(msg.sender, _amount);
    }

    function emergencyWithdraw(uint256 _stakeId) public nonReentrant{
        require(!canWithdraw(_stakeId,msg.sender),'Use normal withdraw instead');
        StakeInfo storage stake = stakeInfo[msg.sender][_stakeId];
        PoolInfo storage pool = poolInfo[stake.poolId];
        
        uint256 _amount = stake.amount ;

        pool.liveStakedAmount -= _amount;
        stake.amount = 0;

        if(pool.emergencyWithdrawFee>0){
            if(pool.burnFee > 0){
            uint256 burnFee = (_amount * pool.burnFee) / 10_000;
            token.safeTransfer(address(0xdead), burnFee);
            }

            _amount -= (_amount * pool.emergencyWithdrawFee) / 10_000; 
            emit EmergencyWithdrawFee(address(msg.sender), (_amount * pool.emergencyWithdrawFee) / 10_000); 
        }

        token.safeTransfer(address(msg.sender), _amount);

        emit EmergencyWithdraw(msg.sender, _amount);
    }
}