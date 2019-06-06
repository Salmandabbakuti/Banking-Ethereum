pragma solidity ^0.5.0;

contract GravatarRegistry {
  event NewGravatar(bool created, address owner, string displayName, string imageUrl);
  event UpdatedGravatar(address owner, string displayName, string imageUrl);

  struct Gravatar {
    address owner;
    string displayName;
    string imageUrl;
    bool created;
  }

  Gravatar[] public gravatars;

  mapping (address => Gravatar) private gravatarToOwner;
function createGravatar(string memory _displayName, string memory  _imageUrl) public {
    require(!gravatarToOwner[msg.sender].created);
  gravatarToOwner[msg.sender] = Gravatar(msg.sender, _displayName, _imageUrl , true);
  gravatars.push(gravatarToOwner[msg.sender]);
 emit NewGravatar(true,msg.sender, _displayName, _imageUrl);
  }
  function updateGravatarName(string memory _displayName) public {
    require(gravatarToOwner[msg.sender].created);
    require(msg.sender == gravatarToOwner[msg.sender].owner);

    gravatarToOwner[msg.sender].displayName = _displayName;
    emit UpdatedGravatar(msg.sender, _displayName, gravatarToOwner[msg.sender].imageUrl);
  }
  function updateGravatarImage(string memory _imageUrl) public {
    require(gravatarToOwner[msg.sender].created);
    require(msg.sender == gravatarToOwner[msg.sender].owner);

   gravatarToOwner[msg.sender].imageUrl = _imageUrl;
    emit UpdatedGravatar(msg.sender, _imageUrl, gravatarToOwner[msg.sender].displayName);
}
function getGravatarName(address user) public view returns(string memory) {
    return (gravatarToOwner[user].displayName);
  }
  function getGravatarImage(address user) public view returns (string memory) {
  return (gravatarToOwner[user].imageUrl);
  }
}
